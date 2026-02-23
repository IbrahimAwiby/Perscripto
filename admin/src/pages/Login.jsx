// pages/Login.jsx
import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaUserMd,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaHospital,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  // Check for saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("loginEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (state === "Admin") {
        // Admin Login
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);

          // Save email if remember me is checked
          if (rememberMe) {
            localStorage.setItem("loginEmail", email);
          } else {
            localStorage.removeItem("loginEmail");
          }

          setAToken(data.token);
          toast.success("Admin login successful 🎉", {
            icon: "👋",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          navigate("/admin-dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        // Doctor Login
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);

          // Save email if remember me is checked
          if (rememberMe) {
            localStorage.setItem("loginEmail", email);
          } else {
            localStorage.removeItem("loginEmail");
          }

          setDToken(data.token);
          toast.success("Doctor login successful 👨‍⚕️", {
            icon: "🩺",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          navigate("/doctor-dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#5f6fff]/10 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="lg:w-1/2 bg-linear-to-br from-[#5f6fff] to-blue-600 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <FaHospital className="text-white text-3xl" />
              <span className="text-white text-2xl font-bold">Prescripto</span>
            </div>

            {/* Main Message */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {state === "Admin" ? "Admin Portal" : "Doctor Portal"}
            </h1>

            <p className="text-blue-100 text-lg mb-8">
              {state === "Admin"
                ? "Secure access to manage doctors, appointments, and platform settings."
                : "Manage your schedule, appointments, and patient communications."}
            </p>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Secure Authentication</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Role-based Access</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Real-time Dashboard</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="relative z-10 mt-8 lg:mt-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5">
              <p className="text-white text-sm italic">
                "Secure and easy access to manage my practice. The dashboard
                provides all the information I need at a glance."
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  {state === "Admin" ? (
                    <FaUserShield className="text-white text-sm" />
                  ) : (
                    <FaUserMd className="text-white text-sm" />
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {state === "Admin" ? "Admin User" : "Dr. Sarah Johnson"}
                  </p>
                  <p className="text-blue-200 text-xs">
                    {state === "Admin"
                      ? "Platform Administrator"
                      : "Cardiologist"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f0f2ff] rounded-full mb-4">
                {state === "Admin" ? (
                  <FaUserShield className="text-[#5f6fff] text-3xl" />
                ) : (
                  <FaUserMd className="text-[#5f6fff] text-3xl" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {state} Login
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Role Toggle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setState("Admin")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  state === "Admin"
                    ? "bg-[#5f6fff] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaUserShield />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setState("Doctor")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  state === "Doctor"
                    ? "bg-[#5f6fff] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaUserMd />
                <span>Doctor</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={onSubmitHandler} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FaEnvelope className="inline mr-2 text-[#5f6fff]" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent transition pr-10"
                    placeholder={
                      state === "Admin"
                        ? "admin@prescripto.com"
                        : "doctor@prescripto.com"
                    }
                    required
                    disabled={loading}
                  />
                  {email && (
                    <FaCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FaLock className="inline mr-2 text-[#5f6fff]" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent transition pr-12"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#5f6fff] transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#5f6fff] rounded border-gray-300 focus:ring-[#5f6fff]"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast.error("Password reset feature coming soon!")
                  }
                  className="text-sm text-[#5f6fff] hover:text-blue-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#5f6fff] to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-[#4a5ae8] hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    <span>Login</span>
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="text-center text-xs text-gray-500">
                <p>🔒 Secured with 256-bit encryption</p>
              </div>
            </form>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Having trouble logging in?{" "}
              <button
                onClick={() =>
                  toast.success("Support team will contact you soon!")
                }
                className="text-[#5f6fff] hover:underline font-medium"
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Login;
