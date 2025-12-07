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
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
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
                  MyCarbonFootprint
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
                  <Link 
                    to={link.path}
                    className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black rounded-xl"
                    tabIndex={0}
                  >
                    <Button
                      variant="ghost"
                      className={`group relative px-4 py-2 rounded-xl transition-all duration-200 min-h-[44px] ${
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setCfcMenuOpen(!cfcMenuOpen);
                      }
                    }}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black ${
                      isCFCActive
                        ? "text-emerald-400 bg-white/5 font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    aria-expanded={cfcMenuOpen}
                    aria-haspopup="true"
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

                <Link 
                  to="/tree-planting"
                  className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black rounded-xl"
                  tabIndex={0}
                >
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 min-h-[44px]"
                  >
                    <Sprout className="w-4 h-4 mr-2" />
                    Plant Trees
                  </Button>
                </Link>

                <Link 
                  to="/leaderboard"
                  className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black rounded-xl"
                  tabIndex={0}
                >
                  <Button
                    variant="outline"
                    className="border-white/20 hover:border-emerald-400/50 hover:bg-white/5 hover:text-emerald-400 text-gray-300 transition-all duration-200 min-h-[44px]"
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
              onClick={() => {
                setMobileMenuOpen(prev => !prev);
              }}
              className="relative z-50 p-3 min-w-[44px] min-h-[44px] rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white pointer-events-none" />
              ) : (
                <Menu className="w-6 h-6 text-white pointer-events-none" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div 
            className="border-t border-white/10 bg-black/95 backdrop-blur-xl fixed left-0 right-0 top-16 bottom-0 overflow-y-auto overscroll-contain z-40"
            onClick={(e) => {
              // Close menu when clicking on backdrop (not on menu items)
              if (e.target === e.currentTarget) {
                setMobileMenuOpen(false);
              }
            }}
          >
            <div 
              className="py-4 space-y-2 pb-8" 
              onClick={(e) => e.stopPropagation()}
            >
              {filteredNavLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Small delay to ensure navigation happens first
                      setTimeout(() => {
                        setMobileMenuOpen(false);
                      }, 100);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl transition-colors touch-manipulation ${
                      isActive(link.path)
                        ? "bg-white/5 text-emerald-400 font-semibold"
                        : "text-gray-300 active:bg-white/10"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <span>{link.label}</span>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        // Small delay to ensure navigation happens first
                        setTimeout(() => {
                          setMobileMenuOpen(false);
                        }, 100);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl transition-colors touch-manipulation ${
                        isActive(item.path)
                          ? "bg-white/5 text-emerald-400 font-semibold"
                          : "text-gray-300 active:bg-white/10"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                    Other
                  </div>
                  <Link
                    to="/tree-planting"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeout(() => {
                        setMobileMenuOpen(false);
                      }, 100);
                    }}
                    className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white active:from-indigo-600 active:to-purple-700 transition-colors touch-manipulation"
                  >
                    <Sprout className="w-5 h-5 flex-shrink-0" />
                    <span>Plant Trees</span>
                  </Link>
                  <Link
                    to="/leaderboard"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeout(() => {
                        setMobileMenuOpen(false);
                      }, 100);
                    }}
                    className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl border border-white/20 text-gray-300 active:bg-white/10 transition-colors touch-manipulation"
                  >
                    <Trophy className="w-5 h-5 flex-shrink-0" />
                    <span>Leaderboard</span>
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
