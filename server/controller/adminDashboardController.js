// controllers/adminDashboardController.js
import Appointment from "../model/Appointment.js";
import Doctor from "../model/Doctor.js";
import User from "../model/User.js";
import Message from "../model/Message.js";

// ! API to Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get start of month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get start of year
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Parallel queries for better performance
    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalMessages,
      todayAppointments,
      monthlyAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      paidAppointments,
      unpaidAppointments,
      availableDoctors,
      unavailableDoctors,
      unreadMessages,
      recentAppointments,
      recentMessages,
      revenueStats,
    ] = await Promise.all([
      // Counts
      Doctor.countDocuments(),
      User.countDocuments(),
      Appointment.countDocuments(),
      Message.countDocuments(),

      // Today's appointments
      Appointment.countDocuments({
        slotDate: {
          $gte: today.toISOString().split("T")[0].replace(/-/g, "_"),
          $lt: tomorrow.toISOString().split("T")[0].replace(/-/g, "_"),
        },
      }),

      // Monthly appointments
      Appointment.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),

      // Appointments by status
      Appointment.countDocuments({ cancelled: false, isCompleted: false }),
      Appointment.countDocuments({ isCompleted: true }),
      Appointment.countDocuments({ cancelled: true }),
      Appointment.countDocuments({ payment: true }),
      Appointment.countDocuments({ payment: false }),

      // Doctors by availability
      Doctor.countDocuments({ available: true }),
      Doctor.countDocuments({ available: false }),

      // Unread messages
      Message.countDocuments({ isRead: false }),

      // Recent appointments (last 5)
      Appointment.find().sort({ createdAt: -1 }).limit(5).lean(),

      // Recent messages (last 5)
      Message.find().sort({ createdAt: -1 }).limit(5).lean(),

      // Revenue statistics
      Appointment.aggregate([
        { $match: { payment: true } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            monthlyRevenue: {
              $sum: {
                $cond: [{ $gte: ["$createdAt", startOfMonth] }, "$amount", 0],
              },
            },
            yearlyRevenue: {
              $sum: {
                $cond: [{ $gte: ["$createdAt", startOfYear] }, "$amount", 0],
              },
            },
            averageAmount: { $avg: "$amount" },
          },
        },
      ]),
    ]);

    // Get recent appointments with doctor and user details
    const appointmentDetails = await Promise.all(
      recentAppointments.map(async (apt) => {
        const doctor = await Doctor.findById(apt.docId).select(
          "name image speciality",
        );
        const user = await User.findById(apt.userId).select("name email image");
        return {
          ...apt,
          doctorDetails: doctor,
          userDetails: user,
        };
      }),
    );

    // Get doctor specialty distribution
    const specialtyDistribution = await Doctor.aggregate([
      {
        $group: {
          _id: "$speciality",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Get appointments by day for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await Appointment.countDocuments({
        createdAt: { $gte: date, $lt: nextDate },
      });

      last7Days.push({
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        count,
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        overview: {
          totalDoctors,
          totalPatients,
          totalAppointments,
          totalMessages,
          todayAppointments,
          monthlyAppointments,
          pendingAppointments,
          completedAppointments,
          cancelledAppointments,
          paidAppointments,
          unpaidAppointments,
          availableDoctors,
          unavailableDoctors,
          unreadMessages,
        },
        revenue: revenueStats[0] || {
          totalRevenue: 0,
          monthlyRevenue: 0,
          yearlyRevenue: 0,
          averageAmount: 0,
        },
        charts: {
          specialtyDistribution,
          appointmentsByDay: last7Days,
        },
        recent: {
          appointments: appointmentDetails,
          messages: recentMessages,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// ! API to Get Monthly Trends
export const getMonthlyTrends = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const monthlyData = await Appointment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year, 11, 31),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          appointments: { $sum: 1 },
          revenue: { $sum: "$amount" },
          completed: {
            $sum: { $cond: ["$isCompleted", 1, 0] },
          },
          cancelled: {
            $sum: { $cond: ["$cancelled", 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format for chart
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const trends = months.map((month, index) => {
      const data = monthlyData.find((d) => d._id === index + 1) || {};
      return {
        month,
        appointments: data.appointments || 0,
        revenue: data.revenue || 0,
        completed: data.completed || 0,
        cancelled: data.cancelled || 0,
      };
    });

    res.status(200).json({
      success: true,
      trends,
    });
  } catch (error) {
    console.error("Monthly trends error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly trends",
    });
  }
};

// ! API to Get Top Doctors
export const getTopDoctors = async (req, res) => {
  try {
    const topDoctors = await Appointment.aggregate([
      {
        $group: {
          _id: "$docId",
          appointmentCount: { $sum: 1 },
          revenue: { $sum: "$amount" },
          completedCount: {
            $sum: { $cond: ["$isCompleted", 1, 0] },
          },
        },
      },
      { $sort: { appointmentCount: -1 } },
      { $limit: 5 },
    ]);

    // Get doctor details
    const doctorIds = topDoctors.map((d) => d._id);
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "name image speciality experience",
    );

    const result = topDoctors.map((doc) => ({
      ...doc,
      details: doctors.find((d) => d._id.toString() === doc._id.toString()),
    }));

    res.status(200).json({
      success: true,
      topDoctors: result,
    });
  } catch (error) {
    console.error("Top doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top doctors",
    });
  }
};
