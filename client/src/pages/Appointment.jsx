// pages/Appointment.jsx
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import {
  FaStar,
  FaGraduationCap,
  FaBriefcase,
  FaInfoCircle,
  FaCalendarAlt,
  FaDollarSign,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, token, backendUrl } = useContext(AppContext);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  const [docInfo, setDocInfo] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetching doctor info
  useEffect(() => {
    if (doctors.length > 0) {
      const doc = doctors.find((doc) => doc._id === docId);
      if (doc) {
        setDocInfo(doc);
      }
      setLoading(false);
    }
  }, [doctors, docId]);

  // Get available slots
  const getAvailableSlots = () => {
    setDocSlots([]);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 0 : 30);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        // Check if slot is already booked from docInfo.slots_booked
        const slotDateStr = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
        const isBooked =
          docInfo?.slots_booked?.[slotDateStr]?.includes(formattedTime);

        if (!isBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  const handleBookAppointment = async () => {
    if (!token) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!slotTime || !selectedDate) {
      toast.error("Please select a date and time");
      return;
    }

    setBookingLoading(true);

    try {
      // Format date for backend (day_month_year)
      const slotDateStr = `${selectedDate.getDate()}_${selectedDate.getMonth() + 1}_${selectedDate.getFullYear()}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate: slotDateStr,
          slotTime,
        },
        {
          headers: {
            token: token,
          },
        },
      );

      if (data.success) {
        toast.success(data.message || "Appointment booked successfully!", {
          duration: 4000,
          icon: "🎉",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        // Refresh doctor data to update booked slots
        const updatedDoc = doctors.find((doc) => doc._id === docId);
        if (updatedDoc) {
          setDocInfo(updatedDoc);
        }

        // Reset selection
        setSlotTime("");
        setSlotIndex(0);
        setSelectedDate(null);
        setShowBooking(false);

        // Optional: Navigate to my appointments page
        navigate("/myappointment");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const scrollDates = (direction) => {
    const container = document.getElementById("date-slots");
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const formatDate = (date) => {
    return `${daysOfWeek[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!docInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Doctor Not Found
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            The doctor you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/doctors")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {/* Desktop Back Button */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <FaHome className="text-xs" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <FaChevronRight className="text-gray-400 text-xs" />

            <button
              onClick={() => navigate("/doctors")}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Doctors
            </button>
            <FaChevronRight className="text-gray-400 text-xs" />

            <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-xs">
              {docInfo.name}
            </span>
          </nav>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24">
              {/* Profile Image */}
              <div className="relative h-56 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 bg-black opacity-10"></div>

                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {/* Main Image Container */}
                    <div className="w-48 h-48 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-2xl">
                      {!imageLoaded && (
                        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                      )}
                      <img
                        src={docInfo.image}
                        alt={docInfo.name}
                        className={`w-full h-full object-cover transition-all duration-700 hover:scale-110 ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                      />
                    </div>

                    {/* Online Status Indicator */}
                    <div
                      className={`absolute -top-2 -right-2 w-7 h-7 rounded-full border-4 border-white shadow-lg
                        ${docInfo.available ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {docInfo.available && (
                        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                      )}
                    </div>

                    {/* Verified Badge */}
                    <div className="absolute -bottom-2 -left-2 bg-blue-600 rounded-full p-2 border-2 border-white shadow-lg">
                      <img
                        src={assets.verified_icon}
                        alt="Verified"
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Basic Info */}
              <div className="pt-16 pb-6 px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {docInfo.name}
                  </h1>
                  <img
                    src={assets.verified_icon}
                    alt="Verified"
                    className="w-5 h-5"
                  />
                </div>

                <p className="text-blue-600 font-medium text-sm mb-3">
                  {docInfo.speciality}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(128 reviews)</span>
                </div>

                {/* Availability Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm
                    ${docInfo.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {docInfo.available ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="font-medium">Available Today</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-500 text-sm" />
                      <span className="font-medium">Not Available</span>
                    </>
                  )}
                </div>
              </div>

              {/* Doctor Stats */}
              <div className="px-6 pb-6 grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <FaGraduationCap className="text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Degree</p>
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {docInfo.degree}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <FaBriefcase className="text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {docInfo.experience}y
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <FaDollarSign className="text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Fee</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {currencySymbol}
                    {docInfo.fees}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="px-6 pb-6 border-t pt-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Clinic Location
                    </p>
                    <p className="text-sm text-gray-600">
                      {docInfo.address?.line1 || "Main Medical Center"}
                      <br />
                      {docInfo.address?.line2 || "Downtown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - About & Booking */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaInfoCircle className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  About {docInfo.name}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {docInfo.about}
              </p>
            </div>

            {/* Booking Section */}
            {docInfo.available ? (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Booking Header */}
                <div
                  className="p-6 flex items-center justify-between cursor-pointer md:cursor-default"
                  onClick={() => setShowBooking(!showBooking)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaCalendarAlt className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Book Appointment
                      </h2>
                      <p className="text-sm text-gray-500">
                        Select your preferred date and time
                      </p>
                    </div>
                  </div>
                  <button className="md:hidden text-blue-600 text-sm">
                    {showBooking ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Booking Content */}
                {(showBooking || window.innerWidth >= 768) && (
                  <div className="p-6 pt-0 border-t">
                    {/* Date Selection */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Select Date
                      </h3>
                      <div className="relative">
                        {/* Scroll Buttons - Mobile Only */}
                        <button
                          onClick={() => scrollDates("left")}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 md:hidden bg-white shadow-lg rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          <FaChevronLeft className="text-gray-600 text-sm" />
                        </button>

                        {/* Date Slots */}
                        <div
                          id="date-slots"
                          className="flex gap-2 overflow-x-auto scrollbar-hide px-2 md:px-0 md:grid md:grid-cols-7 md:gap-2"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {docSlots.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSlotIndex(index);
                                setSlotTime("");
                                setSelectedDate(item[0]?.datetime);
                              }}
                              disabled={item.length === 0}
                              className={`flex-shrink-0 w-16 md:w-full p-3 rounded-xl text-center transition-all
                                ${item.length === 0 ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
                                ${
                                  slotIndex === index && item.length > 0
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              <p className="text-xs">
                                {item[0] &&
                                  daysOfWeek[item[0].datetime.getDay()]}
                              </p>
                              <p className="text-lg font-bold">
                                {item[0] && item[0].datetime.getDate()}
                              </p>
                              <p className="text-xs">
                                {item[0] && months[item[0].datetime.getMonth()]}
                              </p>
                              {item.length === 0 && (
                                <p className="text-[10px] mt-1 text-red-500">
                                  Full
                                </p>
                              )}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => scrollDates("right")}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 md:hidden bg-white shadow-lg rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          <FaChevronRight className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Time Selection */}
                    {slotIndex !== undefined &&
                      docSlots[slotIndex]?.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Select Time
                          </h3>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {docSlots[slotIndex].map((item, index) => (
                              <button
                                key={index}
                                onClick={() => setSlotTime(item.time)}
                                className={`p-3 rounded-xl text-sm font-medium transition-all
                                  ${
                                    item.time === slotTime
                                      ? "bg-blue-600 text-white shadow-md"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                              >
                                {item.time.toLowerCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Selected Info & Book Button */}
                    {slotTime && selectedDate && (
                      <div className="border-t pt-4">
                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Your selected slot:
                          </p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(selectedDate)} at{" "}
                            {slotTime.toLowerCase()}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Fee:{" "}
                            <span className="font-semibold text-gray-900">
                              {currencySymbol}
                              {docInfo.fees}
                            </span>
                          </p>
                        </div>

                        <button
                          onClick={handleBookAppointment}
                          disabled={bookingLoading}
                          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold 
                            hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-[0.98]
                            disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {bookingLoading ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span>Booking...</span>
                            </>
                          ) : (
                            <span>Book Appointment</span>
                          )}
                        </button>
                      </div>
                    )}

                    {docSlots.every((slot) => slot.length === 0) && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No available slots for this week
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Please check back later
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTimesCircle className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Doctor Not Available
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  This doctor is currently not accepting appointments.
                </p>
                <button
                  onClick={() => navigate("/doctors")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Find Another Doctor
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Doctors */}
        {docInfo && (
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        )}
      </div>
    </div>
  );
};

export default Appointment;
