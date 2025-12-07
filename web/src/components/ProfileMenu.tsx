import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, ChevronDown, Mail, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, refreshUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await api.post("/api/v1/auth/resend-verification");
      alert("Verification email sent! Please check your inbox.");
      await refreshUser();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to send verification email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-2 min-w-[44px] min-h-[44px] rounded-xl hover:bg-white/10 active:bg-white/20 transition-all duration-200 group touch-manipulation"
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
          <User className="w-5 h-5 text-white" />
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl border border-white/10 shadow-lg overflow-hidden z-50 animate-fade-in">
          <div className="p-4 border-b border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/20 font-medium">
                Level {user.level}
              </Badge>
              <Badge variant="outline" className="text-xs border-white/20 text-gray-300 font-medium bg-white/5">
                {user.total_points || 0} points
              </Badge>
              {user.email_verified ? (
                <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </Badge>
              ) : (
                <Badge className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-400/20 font-medium flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Unverified
                </Badge>
              )}
            </div>
            {user.eco_score !== undefined && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Eco Score</span>
                  <span className="text-sm font-bold text-emerald-400">{user.eco_score}/100</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-2 space-y-2">
            {!user.email_verified && (
              <button
                onClick={handleResendVerification}
                onTouchStart={handleResendVerification}
                disabled={resending}
                className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-lg active:bg-yellow-500/10 text-yellow-400 transition-colors duration-200 group disabled:opacity-50 touch-manipulation"
                type="button"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">
                  {resending ? "Sending..." : "Resend Verification Email"}
                </span>
              </button>
            )}
            <button
              onClick={handleLogout}
              onTouchStart={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-lg active:bg-red-500/10 text-red-400 transition-colors duration-200 group touch-manipulation"
              type="button"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

