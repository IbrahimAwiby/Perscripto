// pages/Contact.jsx
import { assets } from "../assets/assets";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaSpinner,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const { userData, token } = useContext(AppContext);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Auto-fill form with user data when user is logged in
  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
      }));
    } else {
      // Clear form when user logs out
      setFormData((prev) => ({
        ...prev,
        name: "",
        email: "",
      }));
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!token) {
      toast.error("Please login to send a message");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/message/send`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        // Clear only the message field, keep name and email
        setFormData((prev) => ({
          ...prev,
          message: "",
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-3xl" />,
      title: "Visit Us",
      details: ["Al-Mosaada Island", "Al-Wasta, Beni Suef", "Egypt"],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FaPhone className="text-3xl" />,
      title: "Call Us",
      details: ["+20 155 582 5248", "+20 123 456 7890"],
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FaEnvelope className="text-3xl" />,
      title: "Email Us",
      details: ["awiby.net@gmail.com", "support@prescripto.com"],
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Working Hours",
      details: [
        "Mon - Fri: 9:00 AM - 6:00 PM",
        "Sat: 10:00 AM - 4:00 PM",
        "Sun: Closed",
      ],
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Contact <span className="text-yellow-300">Us</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Get in touch with us. We're here to help and answer any questions
            you might have.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition duration-300"
            >
              <div
                className={`inline-block p-4 rounded-xl bg-gradient-to-r ${info.color} text-white mb-4`}
              >
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {info.title}
              </h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600 text-sm">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto  py-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="lg:flex">
            {/* Left Side - Map/Image */}
            <div className="lg:w-1/2 relative">
              <img
                src={assets.contact_image}
                alt="Contact Us"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
                <p className="text-gray-200">
                  We'd love to hear from you. Send us a message and we'll
                  respond as soon as possible.
                </p>
                {token && userData && (
                  <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-green-200 flex items-center gap-2">
                      <FaCheckCircle className="text-green-300" />
                      Logged in as {userData.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Send Us a <span className="text-blue-600">Message</span>
              </h2>

              {!token && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <FaUser className="text-yellow-600" />
                    Please login to send a message. Your name and email will be
                    auto-filled.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                    placeholder="John Doe"
                    disabled={loading || !!token} // Disable if logged in
                    readOnly={!!token} // Make read-only if logged in
                  />
                  {token && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FaCheckCircle className="text-xs" />
                      Auto-filled from your account
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                    placeholder="john@example.com"
                    disabled={loading || !!token} // Disable if logged in
                    readOnly={!!token} // Make read-only if logged in
                  />
                  {token && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FaCheckCircle className="text-xs" />
                      Auto-filled from your account
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                    placeholder="Your message here..."
                    disabled={loading}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold 
                    hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-[1.02] 
                    flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : !token ? (
                    <>
                      <FaUser />
                      Login to Send Message
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* Social Media Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Follow Us
                </h3>
                <div className="flex justify-center gap-4">
                  <a
                    href="#"
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition transform hover:scale-110"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="#"
                    className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition transform hover:scale-110"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="#"
                    className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition transform hover:scale-110"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="#"
                    className="bg-blue-800 text-white p-3 rounded-full hover:bg-blue-900 transition transform hover:scale-110"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <iframe
            title="location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.7890!2d31.123456!3d29.987654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU5JzE1LjYiTiAzMcKwMDcnMjQuNCJF!5e0!3m2!1sen!2seg!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="w-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
