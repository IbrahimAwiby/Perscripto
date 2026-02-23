// components/Banner.jsx
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaCalendarCheck, FaUserPlus, FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";

const Banner = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl shadow-2xl my-6 ">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative flex flex-col md:flex-row items-center justify-between px-6 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 md:py-12 lg:py-16">
        {/* Left Side - Text Content */}
        <div
          className={`flex-1 text-center md:text-left transform transition-all duration-1000 
          ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
            <FaCalendarCheck className="text-sm" />
            <span className="text-xs font-medium">Telemedicine Available</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
            <span className="inline-block">Book Appointment</span>
            <br />
            <span className="inline-block mt-2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
              With 100+ Trusted Doctors
            </span>
          </h1>

          {/* Description */}
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-xl mb-8 mx-auto md:mx-0">
            Connect with experienced doctors from the comfort of your home.
            Secure, private, and convenient healthcare at your fingertips.
          </p>

          {/* Features List */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-xs text-white">
                ✓
              </div>
              <span className="text-xs sm:text-sm">24/7 Available</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-xs text-white">
                ✓
              </div>
              <span className="text-xs sm:text-sm">Secure Video Calls</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-xs text-white">
                ✓
              </div>
              <span className="text-xs sm:text-sm">Instant Booking</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => {
                navigate("/login");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group bg-white text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full 
                font-semibold text-sm sm:text-base hover:shadow-2xl transform hover:scale-105 
                transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaUserPlus className="group-hover:rotate-12 transition-transform" />
              <span>Create Account</span>
              <FaArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => {
                navigate("/doctors");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 
                rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 
                transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Find Doctors</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 flex gap-6 justify-center md:justify-start">
            <div>
              <p className="text-2xl font-bold text-white">100+</p>
              <p className="text-xs text-white/70">Expert Doctors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">50k+</p>
              <p className="text-xs text-white/70">Happy Patients</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-xs text-white/70">Support</p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div
          className={`hidden md:block md:w-1/2 lg:w-[45%] relative transform transition-all duration-1000 delay-300
          ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
        >
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl opacity-30"></div>

          {/* Main Image */}
          <div className="relative z-10">
            <img
              className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              src={assets.appointment_img}
              alt="Doctor appointment"
            />

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-4 animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCalendarCheck className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next Available</p>
                  <p className="text-sm font-bold text-gray-800">
                    Today, 2:30 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-2xl p-3 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400 text-xs">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-800">4.9</span>
              </div>
              <p className="text-xs text-gray-500">from 10k+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
