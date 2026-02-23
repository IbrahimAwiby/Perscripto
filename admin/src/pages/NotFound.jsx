// pages/NotFound.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import {
  FaHome,
  FaSearch,
  FaArrowLeft,
  FaUserMd,
  FaUserShield,
  FaExclamationTriangle,
  FaLock,
  FaSignInAlt,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaUserPlus,
  FaClock,
} from "react-icons/fa";
import toast from "react-hot-toast";

const NotFound = () => {
  const navigate = useNavigate();
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const isAdmin = !!aToken;
  const isDoctor = !!dToken;
  const isAuthenticated = isAdmin || isDoctor;

  // Admin menu items
  const adminMenuItems = [
    { path: "/admin-dashboard", icon: <FaHome />, label: "Dashboard" },
    {
      path: "/all-appointments",
      icon: <FaCalendarAlt />,
      label: "Appointments",
    },
    { path: "/add-doctor", icon: <FaUserPlus />, label: "Add Doctor" },
    { path: "/doctors-list", icon: <FaUsers />, label: "Doctors List" },
    { path: "/admin-messages", icon: <FaEnvelope />, label: "Messages" },
  ];

  // Doctor menu items
  const doctorMenuItems = [
    { path: "/doctor-dashboard", icon: <FaHome />, label: "Dashboard" },
    {
      path: "/doctor-appointments",
      icon: <FaCalendarAlt />,
      label: "My Appointments",
    },
    { path: "/doctor-profile", icon: <FaUserMd />, label: "Profile" },
  ];

  // Get content based on auth status
  const getContent = () => {
    if (!isAuthenticated) {
      return {
        title: "Page Not Found",
        message: "The page you're looking for doesn't exist.",
        subMessage: "Please login to access your dashboard.",
        icon: <FaExclamationTriangle className="text-yellow-500 text-5xl" />,
        action: (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#5f6fff] text-white rounded-xl font-semibold hover:bg-blue-600 transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
          >
            <FaSignInAlt />
            Go to Login
          </button>
        ),
      };
    } else if (isAdmin) {
      return {
        title: "Admin Page Not Found",
        message: "The admin page you're looking for doesn't exist.",
        subMessage: "Here are some valid admin pages you can access:",
        icon: <FaUserShield className="text-[#5f6fff] text-5xl" />,
        menuItems: adminMenuItems,
        role: "Admin",
      };
    } else if (isDoctor) {
      return {
        title: "Doctor Page Not Found",
        message: "The doctor page you're looking for doesn't exist.",
        subMessage: "Here are some valid doctor pages you can access:",
        icon: <FaUserMd className="text-[#5f6fff] text-5xl" />,
        menuItems: doctorMenuItems,
        role: "Doctor",
      };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-[#5f6fff] to-purple-600 p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              {content.icon}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">404</h1>
            <p className="text-white/90 text-lg">{content.title}</p>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">
            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">{content.message}</p>
              <p className="text-sm text-gray-500">{content.subMessage}</p>
            </div>

            {/* Menu Items for Authenticated Users */}
            {content.menuItems && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <FaLock className="text-xs" />
                  Available {content.role} Pages
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-[#f0f2ff] transition group"
                    >
                      <div className="w-8 h-8 bg-[#5f6fff]/10 rounded-lg flex items-center justify-center group-hover:bg-[#5f6fff] group-hover:text-white transition">
                        <span className="text-[#5f6fff] group-hover:text-white">
                          {item.icon}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#5f6fff]">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
              >
                <FaArrowLeft />
                Go Back
              </button>

              {content.action ? (
                content.action
              ) : (
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-linear-to-r from-[#5f6fff] to-purple-600 text-white rounded-xl font-semibold hover:from-[#4a5ae8] hover:to-purple-700 transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                >
                  <FaHome />
                  Back to Home
                </button>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center text-xs text-gray-400">
              <p>Error Code: 404 | Page Not Found</p>
              <p className="mt-1">
                If you believe this is a mistake, please{" "}
                <button
                  onClick={() =>
                    toast.success("Support team has been notified!")
                  }
                  className="text-[#5f6fff] hover:underline font-medium"
                >
                  contact support
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
