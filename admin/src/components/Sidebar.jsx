// components/Sidebar.jsx
import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  FaHome,
  FaCalendarAlt,
  FaUserPlus,
  FaUsers,
  FaEnvelope,
  FaHospital,
  FaUserMd,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaClipboardList,
  FaUserCircle,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken, backendUrl } = useContext(DoctorContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = !!aToken;
  const isDoctor = !!dToken;
  const userType = isAdmin ? "admin" : isDoctor ? "doctor" : null;

  // Fetch doctor profile from API
  const fetchDoctorProfile = async () => {
    if (!isDoctor || !dToken) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { token: dToken },
      });

      if (data.success) {
        setDoctorData(data.doctor);
        // Also update localStorage
        localStorage.setItem("doctorData", JSON.stringify(data.doctor));
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
      // Try to get from localStorage as fallback
      try {
        const stored = localStorage.getItem("doctorData");
        if (stored) {
          setDoctorData(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error parsing stored doctor data:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load doctor data
  useEffect(() => {
    if (isDoctor) {
      // First try to get from localStorage
      try {
        const stored = localStorage.getItem("doctorData");
        if (stored) {
          setDoctorData(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error parsing stored doctor data:", e);
      }

      // Then fetch fresh data from API
      fetchDoctorProfile();
    }
  }, [isDoctor, dToken]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const linkStyle = ({ isActive }) =>
    `relative flex items-center ${
      collapsed ? "justify-center px-3" : "gap-3 px-6"
    } py-3.5 rounded-lg mx-2 transition-all duration-200 group
     ${
       isActive
         ? "bg-[#5f6fff]/10 text-[#5f6fff] font-medium"
         : "text-[#515151] hover:bg-[#f4f6ff]"
     }`;

  // Admin menu items
  const adminMenuItems = [
    {
      path: "/admin-dashboard",
      icon: <FaHome size={18} />,
      label: "Dashboard",
    },
    {
      path: "/all-appointments",
      icon: <FaCalendarAlt size={18} />,
      label: "Appointments",
    },
    {
      path: "/add-doctor",
      icon: <FaUserPlus size={18} />,
      label: "Add Doctor",
    },
    {
      path: "/doctors-list",
      icon: <FaUsers size={18} />,
      label: "Doctors List",
    },
    {
      path: "/admin-messages",
      icon: <FaEnvelope size={18} />,
      label: "Messages",
    },
  ];

  // Doctor menu items
  const doctorMenuItems = [
    {
      path: "/doctor-dashboard",
      icon: <FaHome size={18} />,
      label: "Dashboard",
    },
    {
      path: "/doctor-appointments",
      icon: <FaCalendarAlt size={18} />,
      label: "My Appointments",
    },
    {
      path: "/doctor-profile",
      icon: <FaUserCircle size={18} />,
      label: "Profile",
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : isDoctor ? doctorMenuItems : [];
  const panelTitle = isAdmin ? "Admin Panel" : isDoctor ? "Doctor Panel" : "";

  // Get user info based on role
  const getUserInfo = () => {
    if (isAdmin) {
      return {
        name: "Admin User",
        email: "admin@prescripto.com",
        image: null,
        initial: "A",
      };
    } else if (isDoctor) {
      // Use doctorData if available, otherwise show loading or default
      if (loading) {
        return {
          name: "Loading...",
          email: "Please wait",
          image: null,
          initial: "...",
        };
      }

      const name = doctorData?.name || "Doctor";
      return {
        name: `${name}`,
        email: doctorData?.email || "doctor@prescripto.com",
        image: doctorData?.image || null,
        initial: name.charAt(0) || "D",
      };
    }
    return null;
  };

  const userInfo = getUserInfo();

  // Don't render if no user type
  if (!userType) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-19 right-4 z-40 p-2 bg-[#5f6fff] text-white rounded-lg shadow-lg md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Overlay */}
      {mobileOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${
            isMobile
              ? `fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ${
                  mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "fixed top-16 left-0 h-[calc(100vh-4rem)]"
          }
          bg-white border-r shadow-xl
          ${!isMobile && (collapsed ? "w-20" : "w-64")}
          ${isMobile && "w-64"}
          transition-all duration-300
          overflow-y-auto
          overflow-x-hidden
        `}
      >
        {/* Collapse Button - Desktop Only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 bg-white border rounded-full p-1.5 shadow-md hover:shadow-lg transition z-50"
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
            }}
          >
            {collapsed ? (
              <FaChevronRight size={14} className="text-[#515151]" />
            ) : (
              <FaChevronLeft size={14} className="text-[#515151]" />
            )}
          </button>
        )}

        {/* Header */}
        <div
          className={`${
            collapsed ? "py-6" : "p-6"
          } border-b flex items-center ${
            collapsed ? "justify-center" : "gap-2"
          }`}
        >
          <FaHospital className="text-[#5f6fff] text-2xl flex-shrink-0" />
          {!collapsed && (
            <h2 className="text-xl font-bold text-[#5f6fff] truncate">
              {panelTitle}
            </h2>
          )}
        </div>

        {/* Navigation */}
        {(isAdmin || isDoctor) && (
          <>
            <ul className="mt-6 space-y-1 pb-24">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={linkStyle}
                  onClick={() => {
                    isMobile && setMobileOpen(false);
                    window.scrollTo(0, 0);
                  }}
                >
                  <span
                    className={`${collapsed ? "text-xl" : "text-lg"} text-[#5f6fff] shrink-0`}
                  >
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="text-sm md:text-base truncate">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {collapsed && (
                    <span className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </ul>

            {/* User Profile with Image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
              <div
                className={`flex items-center ${
                  collapsed ? "justify-center" : "gap-3"
                }`}
              >
                {/* Profile Image or Initial */}
                {loading ? (
                  <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaSpinner className="animate-spin text-[#5f6fff] text-sm" />
                  </div>
                ) : userInfo.image ? (
                  <img
                    src={userInfo.image}
                    alt={userInfo.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 bg-linear-to-r from-[#5f6fff] to-blue-400 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold">
                    {userInfo.initial}
                  </div>
                )}

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userInfo.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userInfo.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Main Content Spacer */}
      {!isMobile && (
        <style jsx>{`
          main {
            margin-left: ${collapsed ? "5rem" : "16rem"};
            transition: margin-left 0.3s ease-in-out;
          }
        `}</style>
      )}
    </>
  );
};

export default Sidebar;
