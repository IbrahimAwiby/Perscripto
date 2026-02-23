// controllers/adminAppointmentController.js
import Appointment from "../model/Appointment.js";
import Doctor from "../model/Doctor.js";
import User from "../model/User.js";

// ! API to Get All Appointments (Admin Only)
export const getAllAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      doctorId,
      userId,
      startDate,
      endDate,
      search,
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    let filter = {};

    // Filter by status
    if (status) {
      switch (status) {
        case "upcoming":
          filter.cancelled = false;
          filter.isCompleted = false;
          filter.slotDate = { $gte: new Date().toISOString().split("T")[0] };
          break;
        case "completed":
          filter.isCompleted = true;
          break;
        case "cancelled":
          filter.cancelled = true;
          break;
        case "paid":
          filter.payment = true;
          break;
        case "unpaid":
          filter.payment = false;
          break;
      }
    }

    // Filter by doctor
    if (doctorId) {
      filter.docId = doctorId;
    }

    // Filter by user
    if (userId) {
      filter.userId = userId;
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.slotDate = {};
      if (startDate) filter.slotDate.$gte = startDate;
      if (endDate) filter.slotDate.$lte = endDate;
    }

    // Search by doctor name or user name
    if (search) {
      // First find doctors matching the search
      const doctors = await Doctor.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const doctorIds = doctors.map((d) => d._id.toString());

      // Find users matching the search
      const users = await User.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const userIds = users.map((u) => u._id.toString());

      filter.$or = [
        { docId: { $in: doctorIds } },
        { userId: { $in: userIds } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort order
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Fetch appointments with pagination
    const appointments = await Appointment.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Appointment.countDocuments(filter);

    // Fetch doctor and user details for each appointment
    const enrichedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await Doctor.findById(appointment.docId).select(
          "name email image speciality degree experience fees address",
        );

        const user = await User.findById(appointment.userId).select(
          "name email phone image",
        );

        return {
          ...appointment,
          doctorDetails: doctor || null,
          userDetails: user || null,
        };
      }),
    );

    // Get statistics
    const stats = {
      total: await Appointment.countDocuments(),
      upcoming: await Appointment.countDocuments({
        cancelled: false,
        isCompleted: false,
        slotDate: { $gte: new Date().toISOString().split("T")[0] },
      }),
      completed: await Appointment.countDocuments({ isCompleted: true }),
      cancelled: await Appointment.countDocuments({ cancelled: true }),
      paid: await Appointment.countDocuments({ payment: true }),
      unpaid: await Appointment.countDocuments({ payment: false }),
      today: await Appointment.countDocuments({
        slotDate: new Date().toISOString().split("T")[0],
      }),
    };

    // Get revenue statistics
    const revenueStats = {
      total: await Appointment.aggregate([
        { $match: { payment: true } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      thisMonth: await Appointment.aggregate([
        {
          $match: {
            payment: true,
            createdAt: {
              $gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1,
              ),
              $lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0,
              ),
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    };

    res.status(200).json({
      success: true,
      appointments: enrichedAppointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: skip + appointments.length < total,
        hasPrevPage: page > 1,
      },
      stats,
      revenue: {
        total: revenueStats.total[0]?.total || 0,
        thisMonth: revenueStats.thisMonth[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

// ! API to Get Single Appointment Details (Admin Only)
export const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId).lean();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Fetch doctor and user details
    const doctor = await Doctor.findById(appointment.docId).select(
      "name email image speciality degree experience fees address about",
    );

    const user = await User.findById(appointment.userId).select(
      "name email phone image gender dob address",
    );

    res.status(200).json({
      success: true,
      appointment: {
        ...appointment,
        doctorDetails: doctor,
        userDetails: user,
      },
    });
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment details",
    });
  }
};

// ! API to Update Appointment Status (Admin Only)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body; // status: 'completed', 'cancelled', 'paid'

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Update status based on request
    switch (status) {
      case "completed":
        appointment.isCompleted = true;
        appointment.cancelled = false;
        break;
      case "cancelled":
        appointment.cancelled = true;
        appointment.isCompleted = false;

        // If cancelled, free up the slot in doctor's schedule
        const doctor = await Doctor.findById(appointment.docId);
        if (doctor && doctor.slots_booked) {
          const slotDate = appointment.slotDate;
          const slotTime = appointment.slotTime;

          if (doctor.slots_booked[slotDate]) {
            doctor.slots_booked[slotDate] = doctor.slots_booked[
              slotDate
            ].filter((time) => time !== slotTime);

            // Remove the date if no slots left
            if (doctor.slots_booked[slotDate].length === 0) {
              delete doctor.slots_booked[slotDate];
            }

            await doctor.save();
          }
        }
        break;
      case "paid":
        appointment.payment = true;
        appointment.paidAt = new Date();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
    });
  }
};

// ! API to Get Appointment Statistics (Admin Only)
export const getAppointmentStats = async (req, res) => {
  try {
    const { period = "week" } = req.query; // week, month, year

    let startDate;
    const endDate = new Date();

    // Set start date based on period
    switch (period) {
      case "week":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get appointments by date
    const appointmentsByDate = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Get appointments by doctor
    const appointmentsByDoctor = await Appointment.aggregate([
      {
        $group: {
          _id: "$docId",
          count: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Get doctor names for the above
    const doctorIds = appointmentsByDoctor.map((item) => item._id);
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "name",
    );

    const doctorMap = {};
    doctors.forEach((doc) => {
      doctorMap[doc._id] = doc.name;
    });

    const topDoctors = appointmentsByDoctor.map((item) => ({
      doctorId: item._id,
      doctorName: doctorMap[item._id] || "Unknown Doctor",
      count: item.count,
      revenue: item.revenue,
    }));

    res.status(200).json({
      success: true,
      stats: {
        byDate: appointmentsByDate,
        topDoctors,
      },
    });
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment statistics",
    });
  }
};
