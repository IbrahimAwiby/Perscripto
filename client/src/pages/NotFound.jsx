// pages/NotFound.jsx
import { useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Animated 404 Text */}
        <div className="relative">
          <h1 className="text-9xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="relative z-10 mt-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-semibold text-gray-800 mb-2">
              You might want to:
            </h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Check the URL for errors
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Go back to the previous page
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Visit our homepage
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-semibold text-gray-800 mb-2">Popular Links:</h3>
            <ul className="text-left space-y-2">
              <li>
                <button
                  onClick={() => navigate("/doctors")}
                  className="text-blue-600 hover:underline"
                >
                  Find a Doctor
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/about")}
                  className="text-blue-600 hover:underline"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-blue-600 hover:underline"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition transform hover:scale-105"
          >
            <FaArrowLeft />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
          >
            <FaHome />
            Back to Home
          </button>

          <button
            onClick={() => navigate("/doctors")}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition transform hover:scale-105"
          >
            <FaSearch />
            Browse Doctors
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 text-gray-400 text-sm">
          <p>Error Code: 404 | Page Not Found</p>
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

export default NotFound;
