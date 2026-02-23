// pages/admin/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaEnvelope,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaUser,
  FaStar,
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaChartLine,
  FaCalendarAlt,
  FaSpinner,
  FaChevronRight,
} from "react-icons/fa";

const Dashboard = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overview: {
      totalDoctors: 0,
      totalPatients: 0,
      totalAppointments: 0,
      totalMessages: 0,
      todayAppointments: 0,
      monthlyAppointments: 0,
      pendingAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      paidAppointments: 0,
      unpaidAppointments: 0,
      availableDoctors: 0,
      unavailableDoctors: 0,
      unreadMessages: 0,
    },
    revenue: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      yearlyRevenue: 0,
      averageAmount: 0,
    },
    charts: {
      specialtyDistribution: [],
      appointmentsByDay: [],
    },
    recent: {
      appointments: [],
      messages: [],
    },
  });

  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/dashboard/stats`,
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  // Fetch monthly trends
  const fetchMonthlyTrends = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/dashboard/trends?year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        setMonthlyTrends(data.trends);
      }
    } catch (error) {
      console.error("Error fetching monthly trends:", error);
    }
  };

  // Fetch top doctors
  const fetchTopDoctors = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/dashboard/top-doctors`,
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        setTopDoctors(data.topDoctors);
      }
    } catch (error) {
      console.error("Error fetching top doctors:", error);
    }
  };

  useEffect(() => {
    if (aToken) {
      Promise.all([
        fetchDashboardStats(),
        fetchMonthlyTrends(),
        fetchTopDoctors(),
      ]).finally(() => setLoading(false));
    }
  }, [aToken, selectedYear]);

  // Stat Card Component
  const StatCard = ({
    title,
    value,
    icon,
    color,
    trend,
    trendValue,
    bgColor,
  }) => (
    <div
      className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color} hover:shadow-lg transition-all`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-2 flex items-center gap-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}
            >
              {trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
              {trendValue} from last month
            </p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );

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
    <div className=" bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard <span className="text-[#5f6fff]">Overview</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Doctors"
          value={stats.overview.totalDoctors}
          icon={<FaUserMd className="text-white text-xl" />}
          color="border-blue-500"
          bgColor="bg-blue-500"
        />
        <StatCard
          title="Total Patients"
          value={stats.overview.totalPatients}
          icon={<FaUsers className="text-white text-xl" />}
          color="border-green-500"
          bgColor="bg-green-500"
        />
        <StatCard
          title="Appointments"
          value={stats.overview.totalAppointments}
          icon={<FaCalendarCheck className="text-white text-xl" />}
          color="border-purple-500"
          bgColor="bg-purple-500"
        />
        <StatCard
          title="Messages"
          value={stats.overview.totalMessages}
          icon={<FaEnvelope className="text-white text-xl" />}
          color="border-orange-500"
          bgColor="bg-orange-500"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">Today</p>
          <p className="text-xl font-bold text-[#5f6fff]">
            {stats.overview.todayAppointments}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-600">
            {stats.overview.pendingAppointments}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-xl font-bold text-green-600">
            {stats.overview.completedAppointments}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">Cancelled</p>
          <p className="text-xl font-bold text-red-600">
            {stats.overview.cancelledAppointments}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">Available</p>
          <p className="text-xl font-bold text-green-600">
            {stats.overview.availableDoctors}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">Unread</p>
          <p className="text-xl font-bold text-orange-600">
            {stats.overview.unreadMessages}
          </p>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
          <p className="text-sm opacity-90 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">
            EGP {stats.revenue.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-2">All time earnings</p>
        </div>
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
          <p className="text-sm opacity-90 mb-1">Monthly Revenue</p>
          <p className="text-2xl font-bold">
            EGP {stats.revenue.monthlyRevenue.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-2">This month</p>
        </div>
        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
          <p className="text-sm opacity-90 mb-1">Yearly Revenue</p>
          <p className="text-2xl font-bold">
            EGP {stats.revenue.yearlyRevenue.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-2">This year</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Monthly Trends</h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="text-sm border rounded-lg px-2 py-1"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            {monthlyTrends.map((month, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs font-medium w-10">{month.month}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5f6fff] rounded-full"
                    style={{ width: `${(month.appointments / 50) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">
                  {month.appointments}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Specialty Distribution */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            Specialty Distribution
          </h3>
          <div className="space-y-3">
            {stats.charts.specialtyDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs font-medium w-24 truncate">
                  {item._id}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${(item.count / stats.overview.totalDoctors) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity with Fixed Height Scroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments - Fixed Height with Scroll */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col h-100">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
            <button
              onClick={() => navigate("/all-appointments")}
              className="text-sm text-[#5f6fff] hover:underline flex items-center gap-1"
            >
              View All <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {stats.recent.appointments.length > 0 ? (
              stats.recent.appointments.map((apt) => (
                <div
                  key={apt._id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <img
                    src={
                      apt.doctorDetails?.image ||
                      "https://via.placeholder.com/40"
                    }
                    alt={apt.doctorDetails?.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {apt.doctorDetails?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {apt.userDetails?.name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium">EGP {apt.amount}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                        apt.payment
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {apt.payment ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No recent appointments
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages - Fixed Height with Scroll */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col h-100">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="font-semibold text-gray-900">Recent Messages</h3>
            <button
              onClick={() => navigate("/admin-messages")}
              className="text-sm text-[#5f6fff] hover:underline flex items-center gap-1"
            >
              View All <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {stats.recent.messages.length > 0 ? (
              stats.recent.messages.map((msg) => (
                <div
                  key={msg._id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <FaUser className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{msg.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {msg.message}
                    </p>
                  </div>
                  {!msg.isRead && (
                    <div className="shrink-0">
                      <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No recent messages
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Doctors */}
      {topDoctors.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            Top Performing Doctors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topDoctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-gray-50 rounded-lg p-3 text-center hover:shadow-md transition"
              >
                <img
                  src={doc.details?.image || "https://via.placeholder.com/60"}
                  alt={doc.details?.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                />
                <p className="font-medium text-sm truncate">
                  {doc.details?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {doc.details?.speciality}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2 text-xs">
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {doc.appointmentCount} apps
                  </span>
                  <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                    EGP {doc.revenue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
