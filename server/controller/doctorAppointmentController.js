// controllers/doctorAppointmentController.js
import Appointment from "../model/Appointment.js";
import User from "../model/User.js";

// ! API to Get Doctor's Appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.docId; // From authDoctor middleware
    const { status, date, search, page = 1, limit = 10 } = req.query;

    // Build filter
    let filter = { docId: doctorId };

    // Filter by status
    if (status) {
      switch (status) {
        case "upcoming":
          filter.cancelled = false;
          filter.isCompleted = false;
          filter.slotDate = {
            $gte: new Date().toISOString().split("T")[0].replace(/-/g, "_"),
          };
          break;
        case "completed":
          filter.isCompleted = true;
          break;
        case "cancelled":
          filter.cancelled = true;
          break;
        case "today":
          const today = new Date()
            .toISOString()
            .split("T")[0]
            .replace(/-/g, "_");
          filter.slotDate = today;
          filter.cancelled = false;
          filter.isCompleted = false;
          break;
        default:
          break;
      }
    }

    // Filter by specific date
    if (date) {
      filter.slotDate = date;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get appointments
    let appointments = await Appointment.find(filter)
      .sort({ slotDate: -1, slotTime: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get patient details for each appointment
    let appointmentsWithPatients = await Promise.all(
      appointments.map(async (apt) => {
        const patient = await User.findById(apt.userId).select(
          "name email phone image gender dob",
        );
        return {
          ...apt,
          patientDetails: patient || null,
        };
      }),
    );

    // Apply search filter on patient name/email if search term exists
    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase().trim();
      appointmentsWithPatients = appointmentsWithPatients.filter(
        (apt) =>
          apt.patientDetails?.name?.toLowerCase().includes(searchLower) ||
          apt.patientDetails?.email?.toLowerCase().includes(searchLower),
      );
    }

    // Get total count for pagination (after search)
    const total = appointmentsWithPatients.length;

    // Get statistics
    const stats = {
      total: await Appointment.countDocuments({ docId: doctorId }),
      upcoming: await Appointment.countDocuments({
        docId: doctorId,
        cancelled: false,
        isCompleted: false,
        slotDate: {
          $gte: new Date().toISOString().split("T")[0].replace(/-/g, "_"),
        },
      }),
      completed: await Appointment.countDocuments({
        docId: doctorId,
        isCompleted: true,
      }),
      cancelled: await Appointment.countDocuments({
        docId: doctorId,
        cancelled: true,
      }),
      today: await Appointment.countDocuments({
        docId: doctorId,
        slotDate: new Date().toISOString().split("T")[0].replace(/-/g, "_"),
        cancelled: false,
        isCompleted: false,
      }),
    };

    res.status(200).json({
      success: true,
      appointments: appointmentsWithPatients,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

// ! API to Get Single Appointment Details
export const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const doctorId = req.docId;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      docId: doctorId,
    }).lean();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Get patient details
    const patient = await User.findById(appointment.userId).select(
      "name email phone image gender dob address",
    );

    res.status(200).json({
      success: true,
      appointment: {
        ...appointment,
        patientDetails: patient,
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

// ! API to Update Appointment Status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body; // 'completed', 'cancelled'
    const doctorId = req.docId;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      docId: doctorId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Update status
    if (status === "completed") {
      appointment.isCompleted = true;
      appointment.cancelled = false;
    } else if (status === "cancelled") {
      appointment.cancelled = true;
      appointment.isCompleted = false;

      // Free up the slot in doctor's schedule
      const doctor = await Doctor.findById(doctorId);
      if (doctor && doctor.slots_booked) {
        const slotDate = appointment.slotDate;
        const slotTime = appointment.slotTime;

        if (doctor.slots_booked[slotDate]) {
          doctor.slots_booked[slotDate] = doctor.slots_booked[slotDate].filter(
            (time) => time !== slotTime,
          );

          if (doctor.slots_booked[slotDate].length === 0) {
            delete doctor.slots_booked[slotDate];
          }

          await doctor.save();
        }
      }
    } else {
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
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
    });
  }
};

// ! API to Get Today's Schedule
export const getTodaySchedule = async (req, res) => {
  try {
    const doctorId = req.docId;
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "_");

    const appointments = await Appointment.find({
      docId: doctorId,
      slotDate: today,
      cancelled: false,
      isCompleted: false,
    })
      .sort({ slotTime: 1 })
      .lean();

    // Get patient details
    const appointmentsWithPatients = await Promise.all(
      appointments.map(async (apt) => {
        const patient = await User.findById(apt.userId).select(
          "name email phone image",
        );
        return {
          ...apt,
          patientDetails: patient,
        };
      }),
    );

    res.status(200).json({
      success: true,
      appointments: appointmentsWithPatients,
      total: appointments.length,
    });
  } catch (error) {
    console.error("Error fetching today's schedule:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's schedule",
    });
  }
};
