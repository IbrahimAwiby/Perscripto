// components/RelatedDoctors.jsx
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaTimesCircle,
  FaChevronRight,
  FaAward,
  FaMapMarkerAlt,
  FaCalendarCheck,
} from "react-icons/fa";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0) {
      const relatedDoctors = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId,
      );
      setRelDoc(relatedDoctors.slice(0, 4));
    }
  }, [doctors, speciality, docId]);

  const handleImageLoad = (docId) => {
    setImageLoaded((prev) => ({ ...prev, [docId]: true }));
  };

  const handleScroll = (e) => {
    const element = e.target;
    setShowLeftArrow(element.scrollLeft > 0);
    setShowRightArrow(
      element.scrollLeft < element.scrollWidth - element.clientWidth - 10,
    );
  };

  const scroll = (direction) => {
    const container = document.getElementById("related-doctors-scroll");
    if (container) {
      const scrollAmount = direction === "left" ? -280 : 280;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (relDoc.length === 0) return null;

  return (
    <section className="mt-8 pt-8 border-t">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Related <span className="text-blue-600">Doctors</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            You might also be interested in
          </p>
        </div>
        <button
          onClick={() => {
            navigate("/doctors");
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          View All
          <FaChevronRight className="text-xs" />
        </button>
      </div>

      {/* Mobile Horizontal Scroll with Arrows */}
      <div className="relative px-4 md:px-0">
        {/* Left Scroll Button - Mobile Only */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 md:hidden bg-white shadow-lg rounded-full w-8 h-8 flex items-center justify-center border border-gray-200"
          >
            <FaChevronRight className="text-gray-600 text-sm rotate-180" />
          </button>
        )}

        {/* Right Scroll Button - Mobile Only */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 md:hidden bg-white shadow-lg rounded-full w-8 h-8 flex items-center justify-center border border-gray-200"
          >
            <FaChevronRight className="text-gray-600 text-sm" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          id="related-doctors-scroll"
          className="overflow-x-auto scrollbar-hide md:overflow-visible"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 min-w-max md:min-w-0 pb-2">
            {relDoc.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => {
                  if (doctor.available) {
                    navigate(`/appointment/${doctor._id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`w-56 md:w-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl
                  ${
                    doctor.available
                      ? "cursor-pointer hover:-translate-y-1"
                      : "cursor-not-allowed opacity-75"
                  }`}
              >
                {/* Image Container */}
                <div className="relative h-56 sm:h-50 overflow-hidden bg-gray-200 hover:bg-blue-600 transition-all duration-300">
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
                <div className="p-3">
                  {/* Name & Rating */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate max-w-[120px]">
                      Dr. {doctor.name}
                    </h3>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-xs text-gray-600">4.5</span>
                    </div>
                  </div>

                  {/* Speciality */}
                  <p className="text-blue-600 text-xs mb-2 truncate">
                    {doctor.speciality}
                  </p>

                  {/* Experience & Location */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <FaAward className="text-blue-500 flex-shrink-0" />
                      <span>{doctor.experience}y</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-red-400 flex-shrink-0" />
                      <span className="truncate max-w-[70px]">
                        {doctor.address?.line1?.split(",")[0] || "Local"}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Fee</p>
                      <p className="font-bold text-gray-900 text-sm">
                        ${doctor.fees}
                      </p>
                    </div>

                    {/* Book Button */}
                    <button
                      disabled={!doctor.available}
                      className={`p-1.5 rounded-lg text-xs transition-all
                        ${
                          doctor.available
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      <FaCalendarCheck className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator Dots - Mobile Only */}
      <div className="flex justify-center gap-1 mt-3 md:hidden">
        {relDoc.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === 0 ? "w-4 bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedDoctors;
