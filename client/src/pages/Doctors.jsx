// pages/Doctors.jsx
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  FaStar,
  FaUserMd,
  FaCalendarCheck,
  FaFilter,
  FaTimesCircle,
  FaAward,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  useEffect(() => {
    if (doctors.length > 0) {
      setLoading(false);
      let filtered = doctors;

      // Filter by speciality
      if (speciality) {
        filtered = filtered.filter((doc) => doc.speciality === speciality);
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (doc) =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.speciality.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      setFilteredDoctors(filtered);
    }
  }, [doctors, speciality, searchTerm]);

  const handleImageLoad = (docId) => {
    setImageLoaded((prev) => ({ ...prev, [docId]: true }));
  };

  // Loading Spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaUserMd className="text-blue-600 text-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your <span className="text-blue-600">Doctor</span>
          </h1>
          <p className="text-gray-600">
            Browse through our extensive list of trusted doctors
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                shadow-md"
            />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button
          className={`lg:hidden w-full mb-4 px-4 py-2 rounded-lg font-medium
            flex items-center justify-center gap-2 transition-all
            ${
              showFilter
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          <FaFilter />
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Sticky on Desktop */}
          <div className="lg:w-1/4">
            <div
              className={`lg:sticky lg:top-24 bg-white rounded-xl shadow-md p-5
              ${showFilter ? "block" : "hidden lg:block"}`}
            >
              <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b">
                Specialties
              </h2>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate("/doctors");
                    setShowFilter(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm
                    ${
                      !speciality
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-50 text-gray-700"
                    }`}
                >
                  All Doctors
                </button>

                {specialities.map((spec, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(
                        speciality === spec ? "/doctors" : `/doctors/${spec}`,
                      );
                      setShowFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm
                      ${
                        speciality === spec
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-50 text-gray-700"
                      }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>

              {/* Clear Filters */}
              {(speciality || searchTerm) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    navigate("/doctors");
                  }}
                  className="mt-4 w-full text-center text-sm text-red-600 hover:text-red-700 
                    pt-3 border-t"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="lg:w-3/4">
            {/* Results Count */}
            <p className="mb-4 text-sm text-gray-600">
              <span className="font-semibold text-blue-600">
                {filteredDoctors.length}
              </span>{" "}
              doctors found
            </p>

            {/* Doctors Grid */}
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => {
                      if (doctor.available) {
                        navigate(`/appointment/${doctor._id}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={`group bg-white rounded-xl shadow-md overflow-hidden 
                      transition-all duration-300 hover:shadow-xl
                      ${
                        doctor.available
                          ? "cursor-pointer hover:-translate-y-1"
                          : "cursor-not-allowed opacity-75"
                      }`}
                  >
                    {/* Image Container */}
                    <div className="relative h-56 sm:h-50 overflow-hidden bg-gray-200 hover:bg-blue-500 transition-all duration-300">
                      {!imageLoaded[doctor._id] && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                      )}
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className={`w-full h-full object-cover transition-all duration-500 
                          group-hover:scale-110 ${imageLoaded[doctor._id] ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => handleImageLoad(doctor._id)}
                      />

                      {/* Availability Badge */}
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 
                          rounded-full text-xs font-medium flex items-center gap-1
                          ${
                            doctor.available
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                      >
                        {doctor.available ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="text-white text-xs" />
                            <span>Not Available</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="p-4">
                      {/* Name & Rating */}
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg sm:text-base">
                          {doctor.name}
                        </h3>
                        <div className="flex items-center gap-0.5">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-xs text-gray-600">4.5</span>
                        </div>
                      </div>

                      {/* Speciality */}
                      <p className="text-blue-600 text-sm sm:text-xs mb-2">
                        {doctor.speciality}
                      </p>

                      {/* Experience & Location */}
                      <div className="flex items-center gap-3 text-sm sm:text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <FaAward className="text-blue-500" />
                          <span>{doctor.experience} yrs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-red-400" />
                          <span className="truncate max-w-[80px]">
                            {doctor.address?.line1?.split(",")[0] || "Local"}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Fee</p>
                          <p className="font-bold text-gray-900">
                            ${doctor.fees}
                          </p>
                        </div>

                        {/* Book Button */}
                        <button
                          disabled={!doctor.available}
                          className={`p-3 sm:p-2 rounded-lg text-base sm:text-sm transition-all
                            ${
                              doctor.available
                                ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          <FaCalendarCheck />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500 mb-3">No doctors found</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    navigate("/doctors");
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
