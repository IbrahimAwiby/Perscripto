// components/Header.jsx (Simpler Version)
import { assets } from "../assets/assets";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl my-6 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 py-8 md:py-12">
        {/* Left Side */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          {/* Badge */}
          <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
            🔥 Trusted by 50,000+ patients
          </span>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Book Appointment{" "}
            <span className="text-yellow-300">With Trusted Doctors</span>
          </h1>

          {/* Description */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex -space-x-2">
              <img
                className="h-8 rounded-full border-white"
                src={assets.group_profiles}
                alt=""
              />
              
              <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-blue-600 font-bold text-xs">
                +100
              </div>
            </div>
            <p className="text-white/90 text-sm">
              Simply browse through our extensive list of trusted doctors
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#speciality"
              className="group bg-white text-blue-600 px-8 py-3 rounded-full font-semibold 
                hover:shadow-xl transform hover:scale-105 transition-all 
                flex items-center justify-center gap-2"
            >
              <span>Book Appointment</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={() => navigate("/doctors")}
              className="group bg-transparent border-2 border-white text-white px-8 py-3 
                rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              Find Doctors
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
          <img
            className="w-full max-w-md lg:max-w-lg drop-shadow-2xl"
            src={assets.header_img}
            alt="Header"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
