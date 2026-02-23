// pages/admin/DoctorsList.jsx
import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaUserMd,
  FaEnvelope,
  FaDollarSign,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaCalendarAlt,
  FaEye,
  FaStethoscope,
  FaBriefcase,
  FaGraduationCap,
  FaPhone,
  FaStar,
  FaRegClock,
  FaIdCard,
  FaGlobe,
  FaHospital,
  FaClock,
  FaAward,
  FaCertificate,
  FaUserGraduate,
  FaHeartbeat,
  FaUserCircle,
} from "react-icons/fa";

const DoctorsList = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("All");
  const [togglingId, setTogglingId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Get unique specialities for filter
  const specialities = [
    "All",
    ...new Set(doctors.map((doc) => doc.speciality)),
  ];

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/doctors-list`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async (docId, currentStatus) => {
    try {
      setTogglingId(docId);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        },
      );

      if (data.success) {
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor._id === docId
              ? { ...doctor, available: !currentStatus }
              : doctor,
          ),
        );
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter doctors based on search and speciality
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.degree.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpeciality =
      filterSpeciality === "All" || doctor.speciality === filterSpeciality;

    return matchesSearch && matchesSpeciality;
  });

  const handleRefresh = () => {
    fetchDoctors();
    toast.success("Refreshed successfully");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const closeDetails = () => {
    setSelectedDoctor(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#5f6fff] text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Doctors <span className="text-[#5f6fff]">List</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Manage and monitor all registered doctors
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Total Doctors
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {doctors.length}
              </p>
            </div>
            <div className="bg-blue-100 p-2.5 rounded-full">
              <FaUserMd className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Available
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {doctors.filter((d) => d.available).length}
              </p>
            </div>
            <div className="bg-green-100 p-2.5 rounded-full">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Unavailable
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {doctors.filter((d) => !d.available).length}
              </p>
            </div>
            <div className="bg-red-100 p-2.5 rounded-full">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent"
            />
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={filterSpeciality}
              onChange={(e) => setFilterSpeciality(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent bg-white appearance-none"
            >
              {specialities.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-[#5f6fff] text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm"
          >
            <FaSyncAlt className="text-sm" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaUserMd className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No Doctors Found
          </h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your search or add a new doctor
          </p>
        </div>
      ) : (
        <>
          {/* Enhanced Doctor Details Modal */}
          {selectedDoctor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header with Gradient */}
                <div className="sticky top-0 z-10 bg-linear-to-r from-[#5f6fff] to-blue-400 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-white text-3xl" />
                      <h2 className="text-2xl font-bold text-white">
                        Doctor Profile
                      </h2>
                    </div>
                    <button
                      onClick={closeDetails}
                      className="text-white hover:bg-white/20 p-2 rounded-full transition"
                    >
                      <FaTimesCircle className="text-2xl" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Doctor Header with Image */}
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div className="relative">
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="w-36 h-36 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-[#5f6fff] shadow-xl"
                      />
                      <div
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-4 border-white
                        ${selectedDoctor.available ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedDoctor.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                        <span className="px-3 py-1 bg-[#f2f3ff] text-[#5f6fff] rounded-full text-sm font-medium">
                          <FaStethoscope className="inline mr-1" />
                          {selectedDoctor.speciality}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          <FaBriefcase className="inline mr-1" />
                          {selectedDoctor.experience}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span
                          className={`px-4 py-2 rounded-lg font-semibold ${
                            selectedDoctor.available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedDoctor.available
                            ? "Available for Appointments"
                            : "Currently Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Personal Info Card */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FaUserGraduate className="text-[#5f6fff]" />
                        Personal Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <FaGraduationCap className="text-[#5f6fff] mt-1" />
                          <div>
                            <p className="text-xs text-gray-500">Degree</p>
                            <p className="font-medium text-gray-900">
                              {selectedDoctor.degree}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FaAward className="text-[#5f6fff] mt-1" />
                          <div>
                            <p className="text-xs text-gray-500">Experience</p>
                            <p className="font-medium text-gray-900">
                              {selectedDoctor.experience}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FaCalendarAlt className="text-[#5f6fff] mt-1" />
                          <div>
                            <p className="text-xs text-gray-500">Joined Date</p>
                            <p className="font-medium text-gray-900">
                              {formatDate(selectedDoctor.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info Card */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FaEnvelope className="text-[#5f6fff]" />
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <FaEnvelope className="text-[#5f6fff] mt-1" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-900 break-all">
                              {selectedDoctor.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FaPhone className="text-[#5f6fff] mt-1" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">
                              {selectedDoctor.phone || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Info Card */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FaHospital className="text-[#5f6fff]" />
                        Professional Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <FaDollarSign className="text-[#5f6fff] mt-1" />
                          <div>
                            <p className="text-xs text-gray-500">
                              Consultation Fee
                            </p>
                            <p className="font-medium text-gray-900">
                              ${selectedDoctor.fees} / session
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FaCertificate className="text-[#5f6fff] mt-1" />
                          <div>
                            <p className="text-xs text-gray-500">Speciality</p>
                            <p className="font-medium text-gray-900">
                              {selectedDoctor.speciality}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#5f6fff]" />
                        Clinic Location
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-900 font-medium">
                          {selectedDoctor.address?.line1}
                        </p>
                        <p className="text-gray-700">
                          {selectedDoctor.address?.line2}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FaHeartbeat className="text-[#5f6fff] text-xl" />
                      <h4 className="font-semibold text-gray-700">
                        About Doctor
                      </h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedDoctor.about}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        toggleAvailability(
                          selectedDoctor._id,
                          selectedDoctor.available,
                        )
                      }
                      disabled={togglingId === selectedDoctor._id}
                      className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2
                        ${
                          selectedDoctor.available
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                    >
                      {togglingId === selectedDoctor._id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          {selectedDoctor.available ? (
                            <FaToggleOff />
                          ) : (
                            <FaToggleOn />
                          )}
                          {selectedDoctor.available
                            ? "Mark as Unavailable"
                            : "Mark as Available"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Doctors Grid - Modern Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#5f6fff]"
              >
                {/* Card Header with Image and Status */}
                <div className="relative h-44 bg-linear-to-br from-[#5f6fff] to-blue-400">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-contain p-3 transform group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Status Badge */}
                  <div
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-sm font-semibold shadow-lg
                    ${doctor.available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {doctor.available ? "Active" : "Inactive"}
                  </div>
                  {/* Speciality Badge */}
                  <div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 
                      flex items-center gap-1.5
                      px-3 py-1 
                      bg-white/90 backdrop-blur-sm 
                      rounded-full 
                      text-sm font-medium text-[#5f6fff] 
                      shadow-sm whitespace-nowrap"
                  >
                    <FaStethoscope className="text-sm" />
                    <span>{doctor.speciality}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Name and Degree */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#5f6fff] transition-colors line-clamp-1">
                      {doctor.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <FaGraduationCap className="text-gray-400 text-sm" />
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {doctor.degree}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400 text-sm" />
                      <span className="truncate text-sm">{doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaDollarSign className="text-gray-400 text-sm" />
                      <span className="font-semibold text-gray-900">
                        ${doctor.fees}
                      </span>
                      <span className="text-sm text-gray-500">/ session</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400 text-sm" />
                      <span className="truncate text-sm">
                        {doctor.address?.line1?.split(",")[0] || "No address"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className="flex items-center gap-1 px-3 py-2 text-[#5f6fff] hover:bg-[#f2f3ff] rounded-lg transition text-sm font-medium"
                    >
                      <FaEye className="text-sm" />
                      View Profile
                    </button>

                    <button
                      onClick={() =>
                        toggleAvailability(doctor._id, doctor.available)
                      }
                      disabled={togglingId === doctor._id}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition text-sm font-medium
                        ${
                          doctor.available
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }
                        ${togglingId === doctor._id ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {togglingId === doctor._id ? (
                        <FaSpinner className="animate-spin text-sm" />
                      ) : doctor.available ? (
                        <FaToggleOn className="text-lg" />
                      ) : (
                        <FaToggleOff className="text-lg" />
                      )}
                      <span className="text-xs">
                        {doctor.available ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorsList;
