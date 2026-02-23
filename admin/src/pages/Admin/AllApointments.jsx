// pages/admin/AllAppointments.jsx
import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaUserMd,
  FaUser,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaMoneyBillWave,
  FaBan,
  FaCheckDouble,
  FaTimes,
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
} from "react-icons/fa";

const AllAppointments = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  // State for appointments data
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    paid: 0,
    unpaid: 0,
    today: 0,
  });
  const [revenue, setRevenue] = useState({ total: 0, thisMonth: 0 });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter state
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    startDate: "",
    endDate: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // Build query string
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const { data } = await axios.get(
        `${backendUrl}/api/admin/appointments?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        setAppointments(data.appointments);
        setStats(data.stats);
        setRevenue(data.revenue);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/appointments/${appointmentId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        toast.success(`Appointment marked as ${status}`);

        // Update local state immediately for better UX
        setAppointments((prevAppointments) =>
          prevAppointments.map((apt) =>
            apt._id === appointmentId
              ? {
                  ...apt,
                  ...(status === "paid" && { payment: true }),
                  ...(status === "cancelled" && { cancelled: true }),
                  ...(status === "completed" && { isCompleted: true }),
                }
              : apt,
          ),
        );

        // Update statistics based on status change
        setStats((prevStats) => {
          const newStats = { ...prevStats };

          // Find the appointment to get its previous state
          const appointment = appointments.find(
            (apt) => apt._id === appointmentId,
          );

          if (appointment) {
            // Decrement previous status counts
            if (appointment.cancelled) newStats.cancelled--;
            if (appointment.isCompleted) newStats.completed--;
            if (appointment.payment) newStats.paid--;
            else newStats.unpaid--;

            // Increment new status counts
            switch (status) {
              case "paid":
                newStats.paid++;
                newStats.unpaid--;
                break;
              case "cancelled":
                newStats.cancelled++;
                newStats.upcoming--;
                break;
              case "completed":
                newStats.completed++;
                newStats.upcoming--;
                break;
              default:
                break;
            }
          }

          return newStats;
        });

        // Also update revenue if payment status changed
        if (status === "paid") {
          const appointment = appointments.find(
            (apt) => apt._id === appointmentId,
          );
          if (appointment && !appointment.payment) {
            setRevenue((prev) => ({
              total: prev.total + appointment.amount,
              thisMonth: prev.thisMonth + appointment.amount,
            }));
          }
        }

        // Close modal if open
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

  // View appointment details
  const viewDetails = async (appointmentId) => {
    setModalLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        setSelectedAppointment(data.appointment);
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      toast.error("Failed to load appointment details");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAppointments();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "",
      search: "",
      startDate: "",
      endDate: "",
      sortBy: "date",
      sortOrder: "desc",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Fetch on page change or filter change
  useEffect(() => {
    if (aToken) {
      fetchAppointments();
    }
  }, [pagination.currentPage, aToken]);

  // Status badge component
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
    if (appointment.payment) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          Paid
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
        Upcoming
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format slot date (from day_month_year format)
  const formatSlotDate = (slotDate) => {
    if (!slotDate) return "N/A";
    const [day, month, year] = slotDate.split("_");
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#5f6fff] text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
          All <span className="text-[#5f6fff]">Appointments</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          Manage and monitor all appointments
        </p>
      </div>

      {/* Stats Cards - Scrollable on mobile */}
      <div className="overflow-x-auto pb-2 mb-4 sm:mb-6 -mx-3 sm:mx-0 px-3 sm:px-0">
        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 min-w-max sm:min-w-0">
          <StatCard
            label="Total"
            value={stats.total}
            color="blue"
            icon={<FaCalendarAlt />}
          />
          <StatCard
            label="Today"
            value={stats.today}
            color="purple"
            icon={<FaClock />}
          />
          <StatCard
            label="Upcoming"
            value={stats.upcoming}
            color="yellow"
            icon={<FaClock />}
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
          <StatCard
            label="Paid"
            value={stats.paid}
            color="blue"
            icon={<FaMoneyBillWave />}
          />
          <StatCard
            label="Unpaid"
            value={stats.unpaid}
            color="orange"
            icon={<FaDollarSign />}
          />
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-3 sm:p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm opacity-90">Total Revenue</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                EGP {revenue.total.toLocaleString()}
              </p>
            </div>
            <FaDollarSign className="text-2xl sm:text-3xl opacity-75" />
          </div>
        </div>
        <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-3 sm:p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm opacity-90">This Month</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                EGP {revenue.thisMonth.toLocaleString()}
              </p>
            </div>
            <FaCalendarAlt className="text-2xl sm:text-3xl opacity-75" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-[#5f6fff] font-medium"
          >
            <FaFilter className="text-xs sm:text-sm" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-[#5f6fff]"
          >
            <FaSyncAlt className="text-xs sm:text-sm" />
            <span className="hidden xs:inline">Refresh</span>
          </button>
        </div>

        {showFilters && (
          <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>

              {/* Start Date */}
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                placeholder="Start Date"
              />

              {/* End Date */}
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                placeholder="End Date"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#5f6fff] text-white rounded-lg hover:bg-blue-600"
              >
                Apply Filters
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Card View (visible on small screens) */}
      <div className="block sm:hidden space-y-3">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500">
            No appointments found
          </div>
        ) : (
          appointments.map((apt) => (
            <MobileAppointmentCard
              key={apt._id}
              appointment={apt}
              onViewDetails={viewDetails}
              onUpdateStatus={updateStatus}
              updatingId={updatingId}
            />
          ))
        )}
      </div>

      {/* Desktop Table View (visible on medium screens and up) */}
      <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <StatusBadge appointment={apt} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            apt.doctorDetails?.image ||
                            "https://via.placeholder.com/40"
                          }
                          alt={apt.doctorDetails?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {apt.doctorDetails?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {apt.doctorDetails?.speciality}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            apt.userDetails?.image ||
                            "https://via.placeholder.com/40"
                          }
                          alt={apt.userDetails?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {apt.userDetails?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {apt.userDetails?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p>{formatSlotDate(apt.slotDate)}</p>
                        <p className="text-xs text-gray-500">{apt.slotTime}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">EGP {apt.amount}</td>
                    <td className="px-4 py-3">
                      {apt.payment ? (
                        <span className="text-green-600 text-sm">Paid</span>
                      ) : (
                        <span className="text-yellow-600 text-sm">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ActionButtons
                        appointment={apt}
                        onViewDetails={viewDetails}
                        onUpdateStatus={updateStatus}
                        updatingId={updatingId}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-gray-500">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems,
              )}{" "}
              of {pagination.totalItems} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                disabled={!pagination.hasPrevPage}
                className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <span className="px-3 py-1 border rounded bg-gray-50 text-sm">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                disabled={!pagination.hasNextPage}
                className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          loading={modalLoading}
          onClose={() => setSelectedAppointment(null)}
          onUpdateStatus={updateStatus}
          updatingId={updatingId}
        />
      )}
    </div>
  );
};

// Mobile Appointment Card Component
const MobileAppointmentCard = ({
  appointment,
  onViewDetails,
  onUpdateStatus,
  updatingId,
}) => {
  const formatSlotDate = (slotDate) => {
    if (!slotDate) return "N/A";
    const [day, month, year] = slotDate.split("_");
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-3 border-l-4 border-[#5f6fff]">
      {/* Header with Status */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <img
            src={
              appointment.doctorDetails?.image ||
              "https://via.placeholder.com/40"
            }
            alt={appointment.doctorDetails?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">
              {appointment.doctorDetails?.name}
            </p>
            <p className="text-xs text-gray-500">
              {appointment.doctorDetails?.speciality}
            </p>
          </div>
        </div>
        <StatusBadge appointment={appointment} />
      </div>

      {/* Patient Info */}
      <div className="flex items-center gap-2 mb-2">
        <img
          src={
            appointment.userDetails?.image || "https://via.placeholder.com/30"
          }
          alt={appointment.userDetails?.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-sm">{appointment.userDetails?.name}</span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{formatSlotDate(appointment.slotDate)}</p>
        </div>
        <div>
          <p className="text-gray-500">Time</p>
          <p className="font-medium">{appointment.slotTime}</p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-medium">EGP {appointment.amount}</p>
        </div>
        <div>
          <p className="text-gray-500">Payment</p>
          <p
            className={`font-medium ${appointment.payment ? "text-green-600" : "text-yellow-600"}`}
          >
            {appointment.payment ? "Paid" : "Pending"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t">
        <button
          onClick={() => onViewDetails(appointment._id)}
          className="flex-1 px-3 py-1.5 bg-[#f2f3ff] text-[#5f6fff] rounded-lg text-xs font-medium flex items-center justify-center gap-1"
        >
          <FaEye /> View
        </button>
        {!appointment.cancelled &&
          !appointment.isCompleted &&
          !appointment.payment && (
            <button
              onClick={() => onUpdateStatus(appointment._id, "paid")}
              disabled={updatingId === appointment._id}
              className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
            >
              {updatingId === appointment._id ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaMoneyBillWave />
              )}
              Pay
            </button>
          )}
        {!appointment.cancelled && !appointment.isCompleted && (
          <button
            onClick={() => onUpdateStatus(appointment._id, "cancelled")}
            disabled={updatingId === appointment._id}
            className="flex-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
          >
            {updatingId === appointment._id ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaBan />
            )}
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

// Action Buttons Component
const ActionButtons = ({
  appointment,
  onViewDetails,
  onUpdateStatus,
  updatingId,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onViewDetails(appointment._id)}
        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
        title="View Details"
      >
        <FaEye />
      </button>
      {!appointment.cancelled &&
        !appointment.isCompleted &&
        !appointment.payment && (
          <button
            onClick={() => onUpdateStatus(appointment._id, "paid")}
            disabled={updatingId === appointment._id}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
            title="Mark as Paid"
          >
            {updatingId === appointment._id ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaMoneyBillWave />
            )}
          </button>
        )}
      {!appointment.cancelled && !appointment.isCompleted && (
        <button
          onClick={() => onUpdateStatus(appointment._id, "cancelled")}
          disabled={updatingId === appointment._id}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
          title="Cancel"
        >
          {updatingId === appointment._id ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaBan />
          )}
        </button>
      )}
      {!appointment.isCompleted &&
        !appointment.cancelled &&
        appointment.payment && (
          <button
            onClick={() => onUpdateStatus(appointment._id, "completed")}
            disabled={updatingId === appointment._id}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
            title="Mark as Completed"
          >
            {updatingId === appointment._id ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaCheckDouble />
            )}
          </button>
        )}
    </div>
  );
};

// Appointment Details Modal
const AppointmentDetailsModal = ({
  appointment,
  loading,
  onClose,
  onUpdateStatus,
  updatingId,
}) => {
  const formatSlotDate = (slotDate) => {
    if (!slotDate) return "N/A";
    const [day, month, year] = slotDate.split("_");
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
    if (appointment.payment) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          Paid
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
        Upcoming
      </span>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6">
          <FaSpinner className="animate-spin text-[#5f6fff] text-3xl mx-auto" />
          <p className="text-center mt-2">Loading details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-[#5f6fff] to-blue-400 p-3 sm:p-4 flex items-center justify-between">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">
            Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {/* Status Badge */}
          <div className="flex justify-end mb-3">
            <StatusBadge appointment={appointment} />
          </div>

          {/* Doctor Info */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Doctor Information
            </h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={
                    appointment.doctorDetails?.image ||
                    "https://via.placeholder.com/50"
                  }
                  alt={appointment.doctorDetails?.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-sm sm:text-base">
                    {appointment.doctorDetails?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {appointment.doctorDetails?.speciality}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-500">Degree</p>
                  <p className="font-medium">
                    {appointment.doctorDetails?.degree}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="font-medium">
                    {appointment.doctorDetails?.experience}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Patient Information
            </h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={
                    appointment.userDetails?.image ||
                    "https://via.placeholder.com/50"
                  }
                  alt={appointment.userDetails?.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-sm sm:text-base">
                    {appointment.userDetails?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {appointment.userDetails?.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">
                    {appointment.userDetails?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium">
                    {appointment.userDetails?.gender || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Appointment Details
            </h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">
                    {formatSlotDate(appointment.slotDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium">{appointment.slotTime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">EGP {appointment.amount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment</p>
                  <p
                    className={`font-medium ${appointment.payment ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {appointment.payment ? "Paid" : "Pending"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Booked On</p>
                  <p className="font-medium text-xs sm:text-sm">
                    {formatDateTime(appointment.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {!appointment.cancelled &&
              !appointment.isCompleted &&
              !appointment.payment && (
                <button
                  onClick={() => onUpdateStatus(appointment._id, "paid")}
                  disabled={updatingId === appointment._id}
                  className="w-full sm:flex-1 py-2 sm:py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {updatingId === appointment._id ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    "Mark as Paid"
                  )}
                </button>
              )}
            {!appointment.cancelled && !appointment.isCompleted && (
              <button
                onClick={() => onUpdateStatus(appointment._id, "cancelled")}
                disabled={updatingId === appointment._id}
                className="w-full sm:flex-1 py-2 sm:py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {updatingId === appointment._id ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  "Cancel Appointment"
                )}
              </button>
            )}
            {!appointment.isCompleted &&
              !appointment.cancelled &&
              appointment.payment && (
                <button
                  onClick={() => onUpdateStatus(appointment._id, "completed")}
                  disabled={updatingId === appointment._id}
                  className="w-full sm:flex-1 py-2 sm:py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {updatingId === appointment._id ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    "Mark as Completed"
                  )}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color, icon }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div
      className={`${colors[color]} rounded-lg p-2 sm:p-3 min-w-20 sm:min-w-0`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] sm:text-xs opacity-75">{label}</p>
          <p className="text-sm sm:text-base md:text-lg font-bold">{value}</p>
        </div>
        <div className="text-base sm:text-lg md:text-xl opacity-75">{icon}</div>
      </div>
    </div>
  );
};

// Status Badge Component (reused)
const StatusBadge = ({ appointment }) => {
  if (appointment.cancelled) {
    return (
      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] sm:text-xs font-medium">
        Cancelled
      </span>
    );
  }
  if (appointment.isCompleted) {
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs font-medium">
        Completed
      </span>
    );
  }
  if (appointment.payment) {
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] sm:text-xs font-medium">
        Paid
      </span>
    );
  }
  return (
    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] sm:text-xs font-medium">
      Upcoming
    </span>
  );
};

export default AllAppointments;
