// pages/Login.jsx
import { useContext, useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaHeartbeat,
} from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { token, setToken, backendUrl } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (state === "Sign Up" && name.length < 2) {
      toast.error("Name must be at least 2 characters long");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      let response;

      if (state === "Sign Up") {
        response = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });
      } else {
        response = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });
      }

      const { data } = response;

      if (data.success) {
        localStorage.setItem("token", data.token);
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        }
        setToken(data.token);

        toast.success(
          state === "Sign Up"
            ? "Account created successfully! 🎉"
            : "Welcome back! 👋",
          {
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          },
        );

        setTimeout(() => {
          navigate("/");
        }, 100);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
    // Load remembered email
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center md:p-4 max-sm:my-4 max-sm:bg-white">
      <div className="max-w-6xl w-full bg-white  shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <FaHeartbeat className="text-white text-3xl" />
              <span className="text-white text-2xl font-bold">Prescripto</span>
            </div>

            {/* Main Message */}
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {state === "Sign Up" ? "Join Us Today" : "Welcome Back!"}
            </h1>

            <p className="text-blue-100 text-lg mb-8">
              {state === "Sign Up"
                ? "Create your account and start booking appointments with top doctors instantly."
                : "Login to manage your appointments and continue your healthcare journey."}
            </p>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>100+ Expert Doctors</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>24/7 Appointment Booking</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Secure & Private Consultations</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="relative z-10 mt-8 lg:mt-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <p className="text-white text-sm italic">
                "The best healthcare platform I've ever used. Easy to book
                appointments and the doctors are amazing!"
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Ibrahim</p>
                  <p className="text-blue-200 text-xs">Happy Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {state === "Sign Up" ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-600">
                {state === "Sign Up"
                  ? "Sign up to book appointments with top doctors"
                  : "Login to manage your appointments"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmitHandler} className="space-y-5">
              {state === "Sign Up" && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FaUser className="inline mr-2 text-blue-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                      disabled:bg-gray-100"
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FaEnvelope className="inline mr-2 text-blue-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    disabled:bg-gray-100"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FaLock className="inline mr-2 text-blue-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    placeholder={
                      state === "Sign Up"
                        ? "Minimum 8 characters"
                        : "Enter your password"
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12
                      disabled:bg-gray-100"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 
                      hover:text-blue-600 transition"
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
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                {state === "Login" && (
                  <button
                    type="button"
                    onClick={() => toast.error("Feature coming soon!")}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 
                  rounded-xl font-semibold flex items-center justify-center gap-2
                  hover:from-blue-700 hover:to-purple-700 transition-all duration-300 
                  transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed
                  shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {state === "Sign Up" ? "Create Account" : "Login"}
                  </span>
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FaShieldAlt className="text-green-500" />
                <span>Your data is protected with 256-bit encryption</span>
              </div>
            </form>

            {/* Toggle State */}
            <p className="text-center text-gray-600 mt-6">
              {state === "Sign Up"
                ? "Already have an account?"
                : "Don't have an account?"}
              <button
                type="button"
                className="text-blue-600 ml-1 font-semibold hover:text-blue-700 hover:underline focus:outline-none"
                onClick={() =>
                  !loading &&
                  setState(state === "Sign Up" ? "Login" : "Sign Up")
                }
              >
                {state === "Sign Up" ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
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
