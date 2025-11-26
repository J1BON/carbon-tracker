import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Carbon Tracker</h3>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering individuals to understand and reduce their carbon footprint through 
              innovative tracking and sustainable practices.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 flex items-center justify-center transition-colors duration-200">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-emerald-400" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 flex items-center justify-center transition-colors duration-200">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-emerald-400" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 flex items-center justify-center transition-colors duration-200">
                <Instagram className="w-5 h-5 text-gray-400 hover:text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Features</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/tree-planting" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Plant Trees
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Leaderboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Carbon Calculator
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Gamification
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Progress Tracking
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  123 Sustainability Street<br />
                  Green City, GC 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">info@carbontracker.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Carbon Tracker. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
