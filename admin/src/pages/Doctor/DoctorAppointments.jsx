// pages/doctor/DoctorAppointments.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
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
  FaEye,
  FaFilter,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaCalendarCheck,
  FaBan,
  FaCheckDouble,
  FaTimes,
} from "react-icons/fa";

const DoctorAppointments = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!dToken) {
      navigate("/login");
      return;
    }

    try {
      setFilterLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(filterStatus && { status: filterStatus }),
        ...(selectedDate && { date: selectedDate.replace(/-/g, "_") }),
        ...(searchTerm && { search: searchTerm }),
      });

      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments?${params}`,
        { headers: { token: dToken } },
      );

      if (data.success) {
        setAppointments(data.appointments);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, [
    dToken,
    backendUrl,
    pagination.currentPage,
    pagination.itemsPerPage,
    filterStatus,
    selectedDate,
    searchTerm,
    navigate,
  ]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dToken) {
        fetchAppointments();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dToken, fetchAppointments]);

  // Fetch on filter change
  useEffect(() => {
    if (dToken) {
      fetchAppointments();
    }
  }, [
    dToken,
    pagination.currentPage,
    filterStatus,
    selectedDate,
    fetchAppointments,
  ]);

  // View appointment details
  const viewDetails = async (appointmentId) => {
    setModalLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments/${appointmentId}`,
        { headers: { token: dToken } },
      );

      if (data.success) {
        setSelectedAppointment(data.appointment);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error("Failed to load appointment details");
    } finally {
      setModalLoading(false);
    }
  };

  // Update appointment status
  const updateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);

      const { data } = await axios.patch(
        `${backendUrl}/api/doctor/appointments/${appointmentId}/status`,
        { status },
        { headers: { token: dToken } },
      );

      if (data.success) {
        toast.success(`Appointment marked as ${status}`);
        fetchAppointments();
        if (selectedAppointment?._id === appointmentId) {
          setSelectedAppointment(null);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Format date
  const formatSlotDate = (slotDate) => {
    if (!slotDate) return "N/A";
    const [day, month, year] = slotDate.split("_");
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge
  const StatusBadge = ({ appointment }) => {
    if (appointment.cancelled) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          Cancelled
        </span>
      );
    }
    if (appointment.isCompleted) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Completed
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
        Upcoming
      </span>
    );
  };

  // Clear filters
  const clearFilters = () => {
    setFilterStatus("");
    setSearchTerm("");
    setSelectedDate("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#5f6fff] text-5xl mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          My <span className="text-[#5f6fff]">Appointments</span>
        </h1>
        <p className="text-gray-600">Manage your patient appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard
          label="Total"
          value={stats.total}
          color="blue"
          icon={<FaCalendarAlt />}
        />
        <StatCard
          label="Today"
          value={stats.today}
          color="green"
          icon={<FaClock />}
        />
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          color="purple"
          icon={<FaCalendarCheck />}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          color="green"
          icon={<FaCheckCircle />}
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled}
          color="red"
          icon={<FaTimesCircle />}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
            />
            {filterLoading && (
              <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
            )}
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
          >
            <option value="">All Appointments</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="today">Today</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
          />

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800">
            No Appointments Found
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            No appointments match your criteria
          </p>
          {(filterStatus || searchTerm || selectedDate) && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-[#5f6fff] text-white rounded-lg hover:bg-blue-600"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Patient Info */}
                <div className="flex items-center gap-3 flex-1">
                  {apt.patientDetails?.image ? (
                    <img
                      src={apt.patientDetails.image}
                      alt={apt.patientDetails.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <FaUserCircle className="text-gray-400 text-2xl" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {apt.patientDetails?.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {apt.patientDetails?.email}
                    </p>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="flex flex-wrap gap-4 flex-1">
                  <div className="min-w-25">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-sm truncate">
                      {formatSlotDate(apt.slotDate)}
                    </p>
                  </div>
                  <div className="min-w-20">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-sm">{apt.slotTime}</p>
                  </div>
                  <div className="min-w-20">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-medium text-sm">EGP {apt.amount}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  <StatusBadge appointment={apt} />
                  <button
                    onClick={() => viewDetails(apt._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg shrink-0"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  {!apt.cancelled && !apt.isCompleted && (
                    <>
                      <button
                        onClick={() => updateStatus(apt._id, "completed")}
                        disabled={updatingId === apt._id}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg shrink-0"
                        title="Mark Completed"
                      >
                        {updatingId === apt._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheckDouble />
                        )}
                      </button>
                      <button
                        onClick={() => updateStatus(apt._id, "cancelled")}
                        disabled={updatingId === apt._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                        title="Cancel"
                      >
                        {updatingId === apt._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaBan />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Showing {appointments.length} of {pagination.totalItems} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage - 1,
                    }))
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                <span className="px-3 py-1 border rounded bg-gray-50">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage + 1,
                    }))
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Appointment Details Modal - Responsive */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          loading={modalLoading}
          onClose={() => setSelectedAppointment(null)}
          onUpdateStatus={updateStatus}
          updatingId={updatingId}
          formatSlotDate={formatSlotDate}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color, icon }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className={`${colors[color]} rounded-lg p-3`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs opacity-75">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
        <div className="text-xl opacity-75">{icon}</div>
      </div>
    </div>
  );
};

// Appointment Details Modal - Fixed for mobile
const AppointmentDetailsModal = ({
  appointment,
  loading,
  onClose,
  onUpdateStatus,
  updatingId,
  formatSlotDate,
}) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6">
          <FaSpinner className="animate-spin text-[#5f6fff] text-3xl mx-auto" />
          <p className="text-center mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-[#5f6fff] to-blue-400 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Patient Info */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Patient Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                {appointment.patientDetails?.image ? (
                  <img
                    src={appointment.patientDetails.image}
                    alt={appointment.patientDetails.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    <FaUserCircle className="text-gray-400 text-3xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 truncate">
                    {appointment.patientDetails?.name}
                  </p>
                  <p className="text-sm text-gray-600 break-all">
                    {appointment.patientDetails?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="min-w-0">
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium truncate">
                    {appointment.patientDetails?.phone || "N/A"}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium truncate">
                    {appointment.patientDetails?.gender || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Appointment Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="min-w-0">
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium truncate">
                    {formatSlotDate(appointment.slotDate)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium">{appointment.slotTime}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">EGP {appointment.amount}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500">Status</p>
                  {appointment.cancelled ? (
                    <span className="text-red-600">Cancelled</span>
                  ) : appointment.isCompleted ? (
                    <span className="text-green-600">Completed</span>
                  ) : (
                    <span className="text-blue-600">Upcoming</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!appointment.cancelled && !appointment.isCompleted && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onUpdateStatus(appointment._id, "completed")}
                disabled={updatingId === appointment._id}
                className="w-full sm:flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {updatingId === appointment._id ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  "Mark Completed"
                )}
              </button>
              <button
                onClick={() => onUpdateStatus(appointment._id, "cancelled")}
                disabled={updatingId === appointment._id}
                className="w-full sm:flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {updatingId === appointment._id ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  "Cancel"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
