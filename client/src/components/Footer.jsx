// components/Footer.jsx
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHeart,
  FaLock,
  FaArrowUp,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const Footer = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (path) => {
    navigate(path);
    scrollToTop();
  };

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 pb-8 relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Company Info Section */}
            <div className="space-y-4">
              <img
                src={assets.logo}
                alt="Logo"
                className="mb-4 w-36 cursor-pointer brightness-0 invert hover:scale-105 transition-transform"
                onClick={() => handleNavigation("/")}
              />
              <p className="text-gray-300 text-sm leading-relaxed">
                Your trusted healthcare partner, making quality medical services
                accessible to everyone, everywhere. We connect patients with the
                best doctors for seamless healthcare experiences.
              </p>

              {/* Social Media Links */}
              <div className="flex gap-3 pt-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-lg" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all duration-300 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-lg" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-lg" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-all duration-300 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-lg" />
                </a>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold relative inline-block">
                <span className="relative z-10">Quick Links</span>
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleNavigation("/")}
                    className="flex items-center gap-2 text-gray-300 hover:text-white group"
                  >
                    <FaHome className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="hover:translate-x-2 transition-transform">
                      Home
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/about")}
                    className="flex items-center gap-2 text-gray-300 hover:text-white group"
                  >
                    <FaInfoCircle className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="hover:translate-x-2 transition-transform">
                      About Us
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/contact")}
                    className="flex items-center gap-2 text-gray-300 hover:text-white group"
                  >
                    <FaEnvelope className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="hover:translate-x-2 transition-transform">
                      Contact Us
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/doctors")}
                    className="flex items-center gap-2 text-gray-300 hover:text-white group"
                  >
                    <FaHeart className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="hover:translate-x-2 transition-transform">
                      Find a Doctor
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert("Privacy Policy")}
                    className="flex items-center gap-2 text-gray-300 hover:text-white group"
                  >
                    <FaLock className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="hover:translate-x-2 transition-transform">
                      Privacy Policy
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold relative inline-block">
                <span className="relative z-10">Contact Info</span>
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-300">
                  <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                  <span>
                    Al-Mosaada Island
                    <br />
                    Al-Wasta, Beni Suef
                    <br />
                    Egypt
                  </span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <FaPhone className="text-blue-500 flex-shrink-0" />
                  <a
                    href="tel:+201555825248"
                    className="hover:text-white transition"
                  >
                    +20 155 582 5248
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope className="text-blue-500 flex-shrink-0" />
                  <a
                    href="mailto:awiby.net@gmail.com"
                    className="hover:text-white transition"
                  >
                    awiby.net@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold relative inline-block">
                <span className="relative z-10">Newsletter</span>
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </h3>
              <p className="text-gray-300 text-sm">
                Subscribe to our newsletter for updates on new doctors and
                healthcare tips.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold 
                  hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-gray-400 text-sm text-center md:text-left">
                <p>
                  © {new Date().getFullYear()} Prescripto. All rights reserved.
                </p>
                <p className="text-xs mt-1">
                  Made with{" "}
                  <span className="text-red-500 animate-pulse">❤️</span> for
                  better healthcare
                </p>
              </div>

              {/* Payment Methods (Optional) */}
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                  Visa
                </span>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                  MasterCard
                </span>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                  PayPal
                </span>
              </div>

              {/* Legal Links */}
              <div className="flex gap-4 text-sm text-gray-400">
                <button className="hover:text-white transition">Terms</button>
                <button className="hover:text-white transition">Privacy</button>
                <button className="hover:text-white transition">Cookies</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full 
            flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default Footer;
