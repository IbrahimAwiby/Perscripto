// pages/About.jsx
import { assets } from "../assets/assets";
import {
  FaClock,
  FaMapMarkerAlt,
  FaUserCheck,
  FaHeartbeat,
  FaShieldAlt,
  FaStar,
  FaUsers,
  FaAward,
  FaRocket,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaClock className="text-2xl sm:text-3xl text-blue-500" />,
      title: "Efficiency",
      description:
        "Streamlined appointment scheduling that fits into your busy lifestyle.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl sm:text-3xl text-green-500" />,
      title: "Convenience",
      description:
        "Access to a network of trusted healthcare professionals in your area.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FaUserCheck className="text-2xl sm:text-3xl text-purple-500" />,
      title: "Personalization",
      description:
        "Tailored recommendations and reminders to help you stay on top of your health.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FaHeartbeat className="text-2xl sm:text-3xl text-red-500" />,
      title: "Quality Care",
      description:
        "Connect with verified and experienced healthcare professionals.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <FaShieldAlt className="text-2xl sm:text-3xl text-indigo-500" />,
      title: "Secure & Private",
      description:
        "Your health data is protected with enterprise-grade security.",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: <FaStar className="text-2xl sm:text-3xl text-yellow-500" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your healthcare needs.",
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  const stats = [
    { icon: <FaUsers />, value: "50K+", label: "Happy Patients" },
    { icon: <FaAward />, value: "10+", label: "Years Experience" },
    { icon: <FaRocket />, value: "100+", label: "Expert Doctors" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Mobile Optimized */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-12 sm:py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full opacity-10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full opacity-10"></div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            About <span className="text-yellow-300">Us</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto px-4">
            Your trusted partner in healthcare, making quality medical services
            accessible to everyone, everywhere.
          </p>
        </div>
      </div>

      {/* Stats Section - Mobile Optimized */}
      <div className="container mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 text-center transform hover:scale-105 transition duration-300"
            >
              <div className="text-2xl sm:text-4xl text-blue-600 mb-2 sm:mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image with overlay */}
            <div className="lg:w-1/2 relative h-50 sm:h-64 md:h-80 lg:h-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20"></div>
              <img
                src={assets.about_image}
                alt="About Prescripto"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 sm:p-6 md:p-8">
                <p className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                  Prescripto
                </p>
                <p className="text-gray-200 text-xs sm:text-sm md:text-base">
                  Healthcare at your fingertips
                </p>
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div className="lg:w-1/2 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                Welcome to <span className="text-blue-600">Prescripto</span>
              </h2>

              <div className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-600">
                <p className="text-xs sm:text-sm md:text-base leading-relaxed">
                  Your trusted partner in managing your healthcare needs
                  conveniently and efficiently. We understand the challenges of
                  scheduling doctor appointments and managing health records,
                  which is why we've created a seamless platform to simplify
                  your healthcare journey.
                </p>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed">
                  Our platform integrates the latest advancements in healthcare
                  technology to improve user experience and deliver superior
                  service. Whether you're booking your first appointment or
                  managing ongoing care, Prescripto is here to support you every
                  step of the way.
                </p>

                <div className="bg-blue-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
                    Our Vision
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    To create a seamless healthcare experience for every user,
                    bridging the gap between patients and healthcare providers,
                    making quality healthcare accessible to all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section - Mobile Optimized */}
      <div className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
              Why <span className="text-blue-600">Choose Us</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Experience healthcare differently with our comprehensive features
            </p>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-3 sm:mt-4 rounded-full"></div>
          </div>

          {/* Features Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer"
              >
                <div
                  className={`inline-block p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${feature.color} text-white mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action - Mobile Optimized */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-center text-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
            Ready to Start Your Healthcare Journey?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            Join thousands of satisfied patients who trust Prescripto
          </p>
          <button
            onClick={() => navigate("/doctors")}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition duration-300"
          >
            Get Started Today
            <FaChevronRight className="text-xs sm:text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
