// components/Navbar.jsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  FaHome,
  FaUserMd,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaTimes,
  FaBars,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { token, setToken, userData, setUserData } = useContext(AppContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (to) => {
    setShowMenu(false);
    if (location.pathname !== to) {
      navigate(to);
    }
  };

  const logout = () => {
    setToken(false);
    setUserData(false);
    localStorage.removeItem("token");
    toast.success("Logged out successfully", {
      icon: "👋",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    setDropdownOpen(false);
    setShowMenu(false);
    navigate("/");
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMenu]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg py-2" : "bg-white py-4"
        } px-4 md:px-10`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img
              className="w-32 md:w-44 cursor-pointer"
              src={assets.logo}
              alt="Logo"
            />
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:w-full after:h-0.5 after:bg-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/doctors"
              className={({ isActive }) =>
                `relative font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:w-full after:h-0.5 after:bg-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`
              }
            >
              All Doctors
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:w-full after:h-0.5 after:bg-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:w-full after:h-0.5 after:bg-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-5">
            {token ? (
              <div ref={dropdownRef} className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    className="w-11 h-11 rounded-full border-2 border-blue-500 object-cover"
                    src={userData?.image || "https://via.placeholder.com/150"}
                    alt="Profile"
                  />
                  <span className="font-medium text-gray-700">
                    {userData?.name?.split(" ")[0] || "Profile"}
                  </span>
                  <img
                    className={`w-3 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                    src={assets.dropdown_icon}
                    alt="Dropdown"
                  />
                </div>

                {/* Desktop Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-14 right-0 bg-white shadow-xl rounded-lg w-56 py-2 border border-gray-200 z-50 animate-fadeIn">
                    <NavLink
                      to="/myprofile"
                      onClick={() => setDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 transition ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      <FaUser className="text-blue-500" />
                      <span>My Profile</span>
                    </NavLink>
                    <NavLink
                      to="/myappointment"
                      onClick={() => setDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 transition ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      <FaCalendarAlt className="text-green-500" />
                      <span>My Appointments</span>
                    </NavLink>
                    <hr className="my-2" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 shadow-md"
              >
                Create Account
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaBars className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden animate-fadeIn"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <img
              src={assets.logo}
              alt="Logo"
              className="w-32 cursor-pointer brightness-0 invert"
              onClick={() => {
                navigate("/");
                setShowMenu(false);
              }}
            />
            <button
              onClick={() => setShowMenu(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Mobile User Info (if logged in) */}
          {token && userData && (
            <div
              onClick={() => {
                navigate("/myprofile");
                setShowMenu(false);
              }}
              className="mt-4 flex items-center gap-3 cursor-pointer"
            >
              <img
                className="w-14 h-14 rounded-full border-2 border-white object-cover"
                src={userData?.image || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              <div className="text-white">
                <p className="font-semibold">{userData.name}</p>
                <p className="text-xs opacity-90">{userData.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div className="p-4">
          <ul className="space-y-1">
            <NavLink
              to="/"
              onClick={() => handleLinkClick("/")}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <FaHome
                className={`text-xl ${location.pathname === "/" ? "text-blue-600" : "text-gray-500"}`}
              />
              <span className="font-medium">Home</span>
            </NavLink>

            <NavLink
              to="/doctors"
              onClick={() => handleLinkClick("/doctors")}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <FaUserMd
                className={`text-xl ${location.pathname === "/doctors" ? "text-blue-600" : "text-gray-500"}`}
              />
              <span className="font-medium">All Doctors</span>
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => handleLinkClick("/about")}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <FaInfoCircle
                className={`text-xl ${location.pathname === "/about" ? "text-blue-600" : "text-gray-500"}`}
              />
              <span className="font-medium">About</span>
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => handleLinkClick("/contact")}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <FaEnvelope
                className={`text-xl ${location.pathname === "/contact" ? "text-blue-600" : "text-gray-500"}`}
              />
              <span className="font-medium">Contact</span>
            </NavLink>
          </ul>

          {/* Mobile Auth Section */}
          {token ? (
            <>
              <hr className="my-4" />
              <ul className="space-y-1">
                <NavLink
                  to="/myprofile"
                  onClick={() => handleLinkClick("/myprofile")}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <FaUser
                    className={`text-xl ${location.pathname === "/myprofile" ? "text-blue-600" : "text-gray-500"}`}
                  />
                  <span className="font-medium">My Profile</span>
                </NavLink>

                <NavLink
                  to="/myappointment"
                  onClick={() => handleLinkClick("/myappointment")}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <FaCalendarAlt
                    className={`text-xl ${location.pathname === "/myappointment" ? "text-blue-600" : "text-gray-500"}`}
                  />
                  <span className="font-medium">My Appointments</span>
                </NavLink>

                <button
                  onClick={logout}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span className="font-medium">Logout</span>
                </button>
              </ul>
            </>
          ) : (
            <div className="mt-6">
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold 
                  hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <FaSignInAlt />
                <span>Create Account / Login</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-gray-500 text-sm border-t">
          <p>© 2/20/2026 Prescripto All rights reserved.</p>
        </div>
      </div>

      {/* Add padding top to account for fixed navbar */}
      <div className="pt-20 md:pt-24"></div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
