// components/TopDoctors.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  FaStar,
  FaUserMd,
  FaCalendarCheck,
  FaChevronRight,
  FaAward,
  FaMapMarkerAlt,
  FaTimesCircle,
} from "react-icons/fa";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState({});

  useEffect(() => {
    if (doctors.length > 0) {
      setLoading(false);
    }
  }, [doctors]);

  const handleImageLoad = (docId) => {
    setImageLoaded((prev) => ({ ...prev, [docId]: true }));
  };

  // Loading Spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaUserMd className="text-blue-600 text-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Get only first 4 doctors
  const topDoctors = doctors.slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Top <span className="text-blue-600">Doctors</span> to Book
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free with our top-rated
            specialists.
          </p>

          {/* Decorative Line */}
          <div className="flex justify-center mt-4">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Doctors Grid - 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topDoctors.map((doctor) => (
            <div
              key={doctor._id}
              onClick={() => {
                navigate(`/appointment/${doctor._id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer 
                transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                border border-gray-100 hover:border-blue-200"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                {!imageLoaded[doctor._id] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                )}
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className={`w-full h-full object-cover transition-all duration-700 
                    group-hover:scale-110 ${imageLoaded[doctor._id] ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => handleImageLoad(doctor._id)}
                />

                {/* Availability Badge - Dynamic based on doctor.available */}
                <div
                  className={`absolute top-3 right-3 px-3 py-1.5 
                    rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg
                    transform transition-transform group-hover:scale-105
                    ${
                      doctor.available
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                >
                  {doctor.available ? (
                    <>
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      <span>Available</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-white text-xs" />
                      <span>Not Available</span>
                    </>
                  )}
                </div>

                {/* Experience Badge */}
                <div
                  className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm 
                    text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold 
                    flex items-center gap-1.5 shadow-lg"
                >
                  <FaAward className="text-blue-600" />
                  <span>{doctor.experience} years</span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-5">
                {/* Rating - You can make this dynamic if you have ratings in your DB */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(124)</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FaMapMarkerAlt className="text-red-400" />
                    <span>Near you</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                  {doctor.name}
                </h3>

                {/* Speciality */}
                <p className="text-blue-600 text-sm font-medium mb-3">
                  {doctor.speciality}
                </p>

                {/* Degree */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                    <FaUserMd className="text-blue-500" />
                    <span>{doctor.degree}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Consultation Fee</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${doctor.fees}
                      <span className="text-xs font-normal text-gray-500 ml-1">
                        / session
                      </span>
                    </p>
                  </div>

                  {/* Book Button - Disabled if doctor not available */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (doctor.available) {
                        navigate(`/appointment/${doctor._id}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={!doctor.available}
                    className={`p-3 rounded-full transition-all transform 
                      ${
                        doctor.available
                          ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 cursor-pointer"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <FaCalendarCheck className="text-lg" />
                  </button>
                </div>

                {/* Availability Status Text for Mobile */}
                {!doctor.available && (
                  <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <FaTimesCircle />
                    <span>Currently not accepting appointments</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              navigate("/doctors");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 
              text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 
              transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="text-lg">View All Doctors</span>
            <FaChevronRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;
