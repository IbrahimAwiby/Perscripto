// components/SpecialityMenu.jsx
import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets";
import {
  FaStethoscope,
  FaHeartbeat,
  FaBrain,
  FaBaby,
  FaUserMd,
  FaChevronRight,
} from "react-icons/fa";
import { useState, useEffect } from "react";

// Map of icons for different specialities (optional)
const iconMap = {
  "General physician": <FaUserMd />,
  Gynecologist: <FaHeartbeat />,
  Dermatologist: <FaHeartbeat />,
  Pediatricians: <FaBaby />,
  Neurologist: <FaBrain />,
  Gastroenterologist: <FaStethoscope />,
  // Add more as needed
};

const SpecialityMenu = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="speciality"
      className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find by <span className="text-blue-600">Speciality</span>
          </h2>
          <div className="flex justify-center mb-4">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted doctors and
            schedule your appointment hassle-free.
          </p>
        </div>

        {/* Speciality Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {specialityData.map((speciality, index) => (
            <Link
              key={index}
              to={`/doctors/${speciality.speciality}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative flex flex-col items-center p-6 bg-white rounded-2xl 
                shadow-lg hover:shadow-2xl transition-all duration-300 transform 
                hover:-translate-y-2 hover:scale-105
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r 
                before:from-blue-600 before:to-purple-600 before:opacity-0 
                before:transition-opacity before:duration-300 hover:before:opacity-10`}
              style={{
                transitionDelay: `${index * 100}ms`,
                animation: isVisible ? "fadeInUp 0.6s ease-out" : "none",
              }}
            >
              {/* Icon or Image Container */}
              <div className="relative mb-4">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 
                  rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 
                  scale-150 group-hover:scale-125`}
                ></div>
                <div className="relative">
                  {/* Image with overlay effect */}
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden 
                    border-3 border-gray-200 group-hover:border-blue-300 
                    transition-all duration-300 shadow-md group-hover:shadow-xl"
                  >
                    <img
                      src={speciality.image}
                      alt={speciality.speciality}
                      className="w-full h-full object-cover transition-transform duration-500 
                        group-hover:scale-110"
                    />
                  </div>

                  {/* Optional Icon Overlay */}
                  <div
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r 
                    from-blue-600 to-purple-600 rounded-full flex items-center justify-center 
                    text-white shadow-lg opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300"
                  >
                    {iconMap[speciality.speciality] || (
                      <FaStethoscope className="text-sm" />
                    )}
                  </div>
                </div>
              </div>

              {/* Speciality Name */}
              <h3
                className="text-sm mt-1.5 md:text-base font-semibold text-gray-800 
                group-hover:text-blue-600 transition-colors duration-300 text-center"
              >
                {speciality.speciality}
              </h3>

              {/* Decorative dot pattern */}
              <div
                className="absolute bottom-3 left-1/2 transform -translate-x-1/2 
                flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/doctors"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 bg-gradient-to-r 
              from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full 
              font-semibold hover:from-blue-700 hover:to-purple-700 
              transition-all duration-300 transform hover:scale-105 
              shadow-lg hover:shadow-xl"
          >
            <span>Browse All Specialities</span>
            <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default SpecialityMenu;
