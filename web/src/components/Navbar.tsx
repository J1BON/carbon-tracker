import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import ProfileMenu from "@/components/ProfileMenu";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Info,
  BookOpen,
  FileText,
  Mail,
  Trophy,
  Sprout,
} from "lucide-react";

export default function Navbar() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cfcMenuOpen, setCfcMenuOpen] = useState(false);
  const cfcMenuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isCFCActive = location.pathname.startsWith("/cfc");

  const navLinks = [
    { path: "/home", label: "Home", protected: false, icon: Info },
    { path: "/", label: "Dashboard", protected: true, icon: LayoutDashboard },
    { path: "/about", label: "About", protected: false, icon: Info },
    { path: "/resources", label: "Resources", protected: false, icon: BookOpen },
    { path: "/blog", label: "Blog", protected: false, icon: FileText },
    { path: "/contact", label: "Contact", protected: false, icon: Mail },
  ];

  const filteredNavLinks = navLinks.filter(
    (link) => !link.protected || (link.protected && user)
  );

  const cfcMenuItems = [
    { path: "/cfc/report", label: "Report CFC Leak", protected: true },
    { path: "/cfc/learn", label: "Learn About CFC", protected: false },
    { path: "/cfc/my-reports", label: "My Reports", protected: true },
    { path: "/cfc/chatbot", label: "Eco Tips Helper", protected: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cfcMenuRef.current && !cfcMenuRef.current.contains(event.target as Node)) {
        setCfcMenuOpen(false);
      }
    };

    if (cfcMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cfcMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl shadow-lg border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-white font-bold text-lg md:text-xl">C</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Carbon Tracker
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {filteredNavLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <div key={link.path}>
                  <Link to={link.path}>
                    <Button
                      variant="ghost"
                      className={`group relative px-4 py-2 rounded-xl transition-all duration-200 ${
                        isActive(link.path)
                          ? "text-emerald-400 font-semibold bg-white/5"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {link.label}
                    </Button>
                  </Link>
                </div>
              );
            })}

            {user && (
              <>
                {/* CFC Emissions Dropdown */}
                <div className="relative" ref={cfcMenuRef}>
                  <button
                    onClick={() => setCfcMenuOpen(!cfcMenuOpen)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
                      isCFCActive
                        ? "text-emerald-400 bg-white/5 font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    CFC Emissions
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        cfcMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {cfcMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-black/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                      <div className="py-2">
                        {cfcMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setCfcMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-emerald-400 transition-colors duration-150"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/tree-planting">
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200"
                  >
                    <Sprout className="w-4 h-4 mr-2" />
                    Plant Trees
                  </Button>
                </Link>

                <Link to="/leaderboard">
                  <Button
                    variant="outline"
                    className="border-white/20 hover:border-emerald-400/50 hover:bg-white/5 hover:text-emerald-400 text-gray-300 transition-all duration-200"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Leaderboard
                  </Button>
                </Link>

                <ProfileMenu />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && <ProfileMenu />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-black/95 backdrop-blur-xl fixed left-0 right-0 top-16 bottom-0 overflow-y-auto overscroll-contain z-40">
            <div className="py-4 space-y-2 pb-8">
              {filteredNavLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive(link.path)
                        ? "bg-white/5 text-emerald-400 font-semibold"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              {user && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    CFC Emissions
                  </div>
                  {cfcMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive(item.path)
                          ? "bg-white/5 text-emerald-400 font-semibold"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                    Other
                  </div>
                  <Link
                    to="/tree-planting"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-colors"
                  >
                    <Sprout className="w-5 h-5" />
                    Plant Trees
                  </Link>
                  <Link
                    to="/leaderboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <Trophy className="w-5 h-5" />
                    Leaderboard
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
