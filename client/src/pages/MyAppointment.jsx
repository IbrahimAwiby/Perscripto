// pages/MyAppointment.jsx
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaCheckCircle,
  FaSpinner,
  FaCreditCard,
  FaTrash,
  FaUserMd,
  FaRegClock,
  FaUndoAlt,
  FaTrashAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const MyAppointment = () => {
  const { token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const navigate = useNavigate();

  // Fetch user appointments
  const getUserAppointments = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/user/my-appointments`,
        {
          headers: { token },
        },
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(
        error.response?.data?.message || "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setProcessingId(appointmentId);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } },
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully", {
          icon: "✅",
          duration: 3000,
        });
        getUserAppointments();
        loadUserProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Delete appointment
  const deleteAppointment = async (appointmentId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setProcessingId(appointmentId);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/delete-appointment`,
        { appointmentId },
        { headers: { token } },
      );

      if (data.success) {
        toast.success("Appointment deleted permanently", {
          icon: "🗑️",
          duration: 3000,
        });
        setAppointments((prev) =>
          prev.filter((app) => app._id !== appointmentId),
        );
        setShowDeleteConfirm(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete appointment",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Paymob payment
  const handlePayment = async (appointment) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setPaymentLoading(appointment._id);

    try {
      // Create payment order
      const { data } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { appointmentId: appointment._id },
        { headers: { token } },
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // Redirect to Paymob iframe
      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${data.iframeId}?payment_token=${data.paymentKey}`;
      window.location.href = iframeUrl;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setPaymentLoading(null);
    }
  };

  // Rebook appointment
  const rebookAppointment = (doctorId) => {
    navigate(`/appointment/${doctorId}`);
    toast.success("Redirecting to booking page...", {
      icon: "📅",
      duration: 2000,
    });
  };

  // Format date
  const formatAppointmentDate = (slotDate) => {
    const [day, month, year] = slotDate.split("_").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) {
      return {
        text: "Cancelled",
        className: "bg-red-100 text-red-700",
        icon: <FaTimesCircle className="text-red-500" />,
      };
    } else if (appointment.isCompleted) {
      return {
        text: "Completed",
        className: "bg-green-100 text-green-700",
        icon: <FaCheckCircle className="text-green-500" />,
      };
    } else if (appointment.payment) {
      return {
        text: "Paid",
        className: "bg-blue-100 text-blue-700",
        icon: <FaCheckCircle className="text-blue-500" />,
      };
    } else {
      return {
        text: "Upcoming",
        className: "bg-yellow-100 text-yellow-700",
        icon: <FaRegClock className="text-yellow-500" />,
      };
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    } else {
      navigate("/login");
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My <span className="text-blue-600">Appointments</span>
          </h1>
          <div className="flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-3">
            View and manage all your medical appointments
          </p>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Appointments Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't booked any appointments. Start your healthcare journey
              today!
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 
                text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 
                hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
            >
              <FaUserMd />
              Find a Doctor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const status = getStatusBadge(appointment);
              const doctorData = appointment.docData;
              const currencySymbol = "EGP";

              return (
                <div
                  key={appointment._id}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden
                    ${appointment.cancelled ? "opacity-90" : ""}`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Doctor Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-full h-56 sm:h-50 rounded-xl overflow-hidden shadow-md">
                          <img
                            src={
                              doctorData?.image ||
                              "https://via.placeholder.com/150"
                            }
                            alt={doctorData?.name}
                            className="w-full h-full object-cover bg-blue-500 hover:bg-slate-300 transition-all duration-300"
                          />
                          {!appointment.cancelled && (
                            <div
                              className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                              ${doctorData?.available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                            >
                              {doctorData?.available ? (
                                <>
                                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                  <span>Available</span>
                                </>
                              ) : (
                                <span>Not Available</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-gray-900">
                              {doctorData?.name}
                            </h2>
                            <span className="text-blue-600 text-sm font-medium">
                              {doctorData?.speciality}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {doctorData?.degree}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
                            <span>
                              <span className="font-medium">Date:</span>{" "}
                              {formatAppointmentDate(appointment.slotDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaClock className="text-green-500 flex-shrink-0" />
                            <span>
                              <span className="font-medium">Time:</span>{" "}
                              {appointment.slotTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                            <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                            <span>
                              <span className="font-medium">Address:</span>{" "}
                              {doctorData?.address?.line1},{" "}
                              {doctorData?.address?.line2}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaMoneyBillWave className="text-purple-500 flex-shrink-0" />
                            <span>
                              <span className="font-medium">Fee:</span>{" "}
                              {appointment.amount} {currencySymbol}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.className}`}
                          >
                            {status.icon}
                            <span>{status.text}</span>
                          </div>
                          {appointment.payment && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <FaMoneyBillWave className="text-blue-500" />
                              <span>Paid</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-row lg:flex-col gap-3 justify-end lg:min-w-[200px]">
                        {!appointment.cancelled && !appointment.isCompleted && (
                          <>
                            {!appointment.payment && (
                              <button
                                onClick={() => handlePayment(appointment)}
                                disabled={paymentLoading === appointment._id}
                                className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 
                                  text-white rounded-xl font-medium text-sm hover:from-green-700 
                                  hover:to-green-800 transition transform hover:scale-105 
                                  flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                              >
                                {paymentLoading === appointment._id ? (
                                  <>
                                    <FaSpinner className="animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <FaCreditCard />
                                    Pay Now
                                  </>
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => cancelAppointment(appointment._id)}
                              disabled={processingId === appointment._id}
                              className="flex-1 lg:flex-none px-4 py-2.5 border-2 border-red-500 
                                text-red-500 rounded-xl font-medium text-sm hover:bg-red-500 
                                hover:text-white transition transform hover:scale-105 
                                flex items-center justify-center gap-2 disabled:opacity-50 
                                disabled:cursor-not-allowed"
                            >
                              {processingId === appointment._id ? (
                                <>
                                  <FaSpinner className="animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <FaTrash />
                                  Cancel
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {appointment.cancelled && (
                          <>
                            {showDeleteConfirm === appointment._id ? (
                              <div className="flex flex-col gap-2">
                                <p className="text-xs text-gray-600 mb-1">
                                  Permanently delete?
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      deleteAppointment(appointment._id)
                                    }
                                    disabled={processingId === appointment._id}
                                    className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg 
                                      text-xs font-medium hover:bg-red-600 transition flex items-center justify-center gap-1"
                                  >
                                    {processingId === appointment._id ? (
                                      <FaSpinner className="animate-spin" />
                                    ) : (
                                      <>Yes</>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 px-3 py-1.5 bg-gray-300 text-gray-700 rounded-lg 
                                      text-xs font-medium hover:bg-gray-400 transition"
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    setShowDeleteConfirm(appointment._id)
                                  }
                                  className="flex-1 lg:flex-none px-4 py-2.5 bg-gray-500 
                                    text-white rounded-xl font-medium text-sm hover:bg-gray-600 
                                    transition transform hover:scale-105 flex items-center justify-center gap-2"
                                >
                                  <FaTrashAlt />
                                  Delete
                                </button>

                                <button
                                  onClick={() =>
                                    rebookAppointment(doctorData?._id)
                                  }
                                  className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                                    text-white rounded-xl font-medium text-sm hover:from-blue-700 
                                    hover:to-purple-700 transition transform hover:scale-105 
                                    flex items-center justify-center gap-2 shadow-md"
                                >
                                  <FaUndoAlt />
                                  Book Again
                                </button>
                              </>
                            )}
                          </>
                        )}

                        {appointment.isCompleted && (
                          <div
                            className="px-4 py-2.5 bg-green-100 text-green-700 rounded-xl 
                            font-medium text-sm text-center"
                          >
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t">
                    <p className="text-xs text-gray-500">
                      Booking ID: {appointment._id} • Booked on{" "}
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;
