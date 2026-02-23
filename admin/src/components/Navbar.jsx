// components/Navbar.jsx
import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaShieldAlt, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const isAdmin = !!aToken;
  const isDoctor = !!dToken;
  const userType = isAdmin ? "Admin" : isDoctor ? "Doctor" : "Guest";

  const logout = () => {
    if (isAdmin) {
      setAToken("");
      localStorage.removeItem("aToken");
      toast.success("Admin logged out successfully");
    } else if (isDoctor) {
      setDToken("");
      localStorage.removeItem("dToken");
      localStorage.removeItem("doctorData");
      toast.success("Doctor logged out successfully");
    }
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white shadow-sm">
      <div className="flex items-center gap-2 text-xs">
        <img
          src={assets.admin_logo}
          alt="Logo"
          className="w-36 sm:w-40 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-linear-to-r from-[#5f6fff]/10 to-[#5f6fff]/5 border border-[#5f6fff]/20">
          {isAdmin ? (
            <FaShieldAlt className="text-[#5f6fff] text-xs sm:text-sm" />
          ) : isDoctor ? (
            <FaUserMd className="text-[#5f6fff] text-xs sm:text-sm" />
          ) : null}
          <p className="text-xs sm:text-sm font-medium text-[#5f6fff]">
            {userType}
          </p>
        </div>
      </div>

      {(isAdmin || isDoctor) && (
        <button
          onClick={logout}
          className="flex items-center gap-1 sm:gap-2 bg-linear-to-r from-[#5f6fff] to-blue-600 text-white text-sm px-4 sm:px-6 py-2 rounded-full hover:from-[#4a5ae8] hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaSignOutAlt className="text-xs" />
          <span>Logout</span>
        </button>
      )}
    </div>
  );
};

export default Navbar;
