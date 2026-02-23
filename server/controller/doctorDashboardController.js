// controllers/doctorDashboardController.js
import Appointment from "../model/Appointment.js";
import User from "../model/User.js";

// ! API to Get Doctor Dashboard Statistics
export const getDoctorDashboardStats = async (req, res) => {
  try {
    const doctorId = req.docId; // From authDoctor middleware

    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = today.toISOString().split("T")[0].replace(/-/g, "_");

    // Get start of month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonthStr = startOfMonth
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "_");

    // Parallel queries for better performance
    const [
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      monthlyAppointments,
      totalPatients,
      recentAppointments,
      todaySchedule,
    ] = await Promise.all([
      // Total appointments
      Appointment.countDocuments({ docId: doctorId }),

      // Today's appointments
      Appointment.countDocuments({
        docId: doctorId,
        slotDate: todayStr,
        cancelled: false,
        isCompleted: false,
      }),

      // Upcoming appointments
      Appointment.countDocuments({
        docId: doctorId,
        cancelled: false,
        isCompleted: false,
        slotDate: { $gte: todayStr },
      }),

      // Completed appointments
      Appointment.countDocuments({
        docId: doctorId,
        isCompleted: true,
      }),

      // Cancelled appointments
      Appointment.countDocuments({
        docId: doctorId,
        cancelled: true,
      }),

      // Monthly appointments
      Appointment.countDocuments({
        docId: doctorId,
        slotDate: { $gte: startOfMonthStr },
      }),

      // Total unique patients
      Appointment.distinct("userId", { docId: doctorId }).then(
        (ids) => ids.length,
      ),

      // Recent appointments (last 5)
      Appointment.find({ docId: doctorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Today's schedule (all appointments for today)
      Appointment.find({
        docId: doctorId,
        slotDate: todayStr,
        cancelled: false,
      })
        .sort({ slotTime: 1 })
        .lean(),
    ]);

    // Get patient details for recent appointments
    const recentWithPatients = await Promise.all(
      recentAppointments.map(async (apt) => {
        const patient = await User.findById(apt.userId).select(
          "name email image phone",
        );
        return {
          ...apt,
          patientDetails: patient || null,
        };
      }),
    );

    // Get patient details for today's schedule
    const scheduleWithPatients = await Promise.all(
      todaySchedule.map(async (apt) => {
        const patient = await User.findById(apt.userId).select(
          "name email image phone",
        );
        return {
          ...apt,
          patientDetails: patient || null,
        };
      }),
    );

    // Calculate completion rate
    const completionRate =
      totalAppointments > 0
        ? Math.round((completedAppointments / totalAppointments) * 100)
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        overview: {
          totalAppointments,
          todayAppointments,
          upcomingAppointments,
          completedAppointments,
          cancelledAppointments,
          monthlyAppointments,
          totalPatients,
          completionRate,
        },
        recent: recentWithPatients,
        todaySchedule: scheduleWithPatients,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

// ! API to Get Weekly Appointment Trends
export const getWeeklyTrends = async (req, res) => {
  try {
    const doctorId = req.docId;

    // Get dates for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0].replace(/-/g, "_");

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      last7Days.push({
        date: dateStr,
        day: dayName,
        display: `${dayName} ${date.getDate()}`,
      });
    }

    // Get appointment counts for each day
    const trends = await Promise.all(
      last7Days.map(async (day) => {
        const total = await Appointment.countDocuments({
          docId: doctorId,
          slotDate: day.date,
        });

        const completed = await Appointment.countDocuments({
          docId: doctorId,
          slotDate: day.date,
          isCompleted: true,
        });

        const cancelled = await Appointment.countDocuments({
          docId: doctorId,
          slotDate: day.date,
          cancelled: true,
        });

        return {
          day: day.display,
          total,
          completed,
          cancelled,
        };
      }),
    );

    res.status(200).json({
      success: true,
      trends,
    });
  } catch (error) {
    console.error("Weekly trends error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly trends",
    });
  }
};

// ! API to Get Appointment Distribution by Status
export const getStatusDistribution = async (req, res) => {
  try {
    const doctorId = req.docId;

    const [upcoming, completed, cancelled] = await Promise.all([
      Appointment.countDocuments({
        docId: doctorId,
        cancelled: false,
        isCompleted: false,
        slotDate: {
          $gte: new Date().toISOString().split("T")[0].replace(/-/g, "_"),
        },
      }),
      Appointment.countDocuments({
        docId: doctorId,
        isCompleted: true,
      }),
      Appointment.countDocuments({
        docId: doctorId,
        cancelled: true,
      }),
    ]);

    res.status(200).json({
      success: true,
      distribution: {
        upcoming,
        completed,
        cancelled,
      },
    });
  } catch (error) {
    console.error("Status distribution error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch status distribution",
    });
  }
};

// ! API to Get Recent Patients
export const getRecentPatients = async (req, res) => {
  try {
    const doctorId = req.docId;
    const { limit = 5 } = req.query;

    // Get unique recent patients from appointments
    const recentAppointments = await Appointment.find({ docId: doctorId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) * 2)
      .lean();

    // Get unique patient IDs
    const patientIds = [
      ...new Set(recentAppointments.map((apt) => apt.userId)),
    ].slice(0, limit);

    // Get patient details
    const patients = await User.find({ _id: { $in: patientIds } })
      .select("name email image phone gender")
      .lean();

    // Get last appointment date for each patient
    const patientsWithLastVisit = await Promise.all(
      patients.map(async (patient) => {
        const lastAppointment = await Appointment.findOne({
          docId: doctorId,
          userId: patient._id,
        })
          .sort({ createdAt: -1 })
          .select("slotDate slotTime createdAt")
          .lean();

        return {
          ...patient,
          lastVisit: lastAppointment
            ? {
                date: lastAppointment.slotDate,
                time: lastAppointment.slotTime,
              }
            : null,
        };
      }),
    );

    res.status(200).json({
      success: true,
      patients: patientsWithLastVisit,
    });
  } catch (error) {
    console.error("Recent patients error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent patients",
    });
  }
};
