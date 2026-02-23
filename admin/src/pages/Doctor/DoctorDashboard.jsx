// pages/doctor/DoctorDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUser,
  FaChartLine,
  FaCalendarCheck,
  FaHistory,
  FaArrowRight,
  FaEye,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const DoctorDashboard = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overview: {
      totalAppointments: 0,
      todayAppointments: 0,
      upcomingAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      monthlyAppointments: 0,
      totalPatients: 0,
      completionRate: 0,
    },
    recent: [],
    todaySchedule: [],
  });

  const [trends, setTrends] = useState([]);
  const [distribution, setDistribution] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!dToken) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await axios.get(
        `${backendUrl}/api/doctor/dashboard/stats`,
        { headers: { token: dToken } },
      );

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      // Fetch trends
      const trendsRes = await axios.get(
        `${backendUrl}/api/doctor/dashboard/trends`,
        { headers: { token: dToken } },
      );

      if (trendsRes.data.success) {
        setTrends(trendsRes.data.trends);
      }

      // Fetch distribution
      const distRes = await axios.get(
        `${backendUrl}/api/doctor/dashboard/distribution`,
        { headers: { token: dToken } },
      );

      if (distRes.data.success) {
        setDistribution(distRes.data.distribution);
      }

      // Fetch recent patients
      const patientsRes = await axios.get(
        `${backendUrl}/api/doctor/dashboard/recent-patients`,
        { headers: { token: dToken } },
      );

      if (patientsRes.data.success) {
        setRecentPatients(patientsRes.data.patients);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#5f6fff] text-5xl mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Doctor <span className="text-[#5f6fff]">Dashboard</span>
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's your practice overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          title="Total Appointments"
          value={stats.overview.totalAppointments}
          icon={<FaCalendarAlt />}
          color="blue"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.overview.todayAppointments}
          icon={<FaClock />}
          color="green"
        />
        <StatCard
          title="Total Patients"
          value={stats.overview.totalPatients}
          icon={<FaUser />}
          color="purple"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.overview.completionRate}%`}
          icon={<FaCheckCircle />}
          color="green"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          title="Upcoming"
          value={stats.overview.upcomingAppointments}
          icon={<FaCalendarCheck />}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={stats.overview.completedAppointments}
          icon={<FaCheckCircle />}
          color="green"
        />
        <StatCard
          title="Cancelled"
          value={stats.overview.cancelledAppointments}
          icon={<FaTimesCircle />}
          color="red"
        />
        <StatCard
          title="This Month"
          value={stats.overview.monthlyAppointments}
          icon={<FaHistory />}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Trends */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaChartLine className="text-[#5f6fff]" />
            Weekly Trends
          </h3>
          <div className="space-y-3">
            {trends.map((trend, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs font-medium w-16">{trend.day}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5f6fff] rounded-full"
                    style={{ width: `${(trend.total / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{trend.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            Appointment Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium w-20">Upcoming</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${(distribution.upcoming / (distribution.upcoming + distribution.completed + distribution.cancelled || 1)) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">
                {distribution.upcoming}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium w-20">Completed</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(distribution.completed / (distribution.upcoming + distribution.completed + distribution.cancelled || 1)) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">
                {distribution.completed}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium w-20">Cancelled</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${(distribution.cancelled / (distribution.upcoming + distribution.completed + distribution.cancelled || 1)) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">
                {distribution.cancelled}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
          <button
            onClick={() => navigate("/doctor-appointments")}
            className="text-sm text-[#5f6fff] hover:underline flex items-center gap-1"
          >
            View All <FaArrowRight className="text-xs" />
          </button>
        </div>

        {stats.todaySchedule.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No appointments scheduled for today
          </p>
        ) : (
          <div className="space-y-3">
            {stats.todaySchedule.map((apt) => (
              <div
                key={apt._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {apt.patientDetails?.image ? (
                    <img
                      src={apt.patientDetails.image}
                      alt={apt.patientDetails.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                      <FaUser className="text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {apt.patientDetails?.name}
                    </p>
                    <p className="text-xs text-gray-500">{apt.slotTime}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/doctor-appointments`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg shrink-0"
                >
                  <FaEye />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Patients - Fixed for mobile */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Patients</h3>
          <button
            onClick={() => navigate("/doctor-appointments")}
            className="text-sm text-[#5f6fff] hover:underline flex items-center gap-1"
          >
            View All <FaArrowRight className="text-xs" />
          </button>
        </div>

        {recentPatients.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No patients yet</p>
        ) : (
          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <div
                key={patient._id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Patient Image */}
                {patient.image ? (
                  <img
                    src={patient.image}
                    alt={patient.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    <FaUser className="text-gray-400" />
                  </div>
                )}

                {/* Patient Info - with proper truncation */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {patient.name}
                  </p>

                  {/* Contact Info - Stacked on mobile, row on desktop */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FaPhone className="text-[10px] shrink-0" />
                      <span className="truncate">{patient.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FaEnvelope className="text-[10px] shrink-0" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className={`${colors[color]} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs opacity-75 truncate">{title}</p>
          <p className="text-2xl font-bold mt-1 truncate">{value}</p>
        </div>
        <div className="text-xl sm:text-2xl opacity-75 shrink-0 ml-2">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
