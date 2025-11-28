import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function VerifyEmailRequired() {
  const { user, refreshUser } = useAuthStore();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const handleResendVerification = async () => {
    setResending(true);
    setMessage(null);
    try {
      await api.post("/api/v1/auth/resend-verification");
      setMessage("Verification email sent! Please check your inbox.");
      setMessageType("success");
      // Refresh user data to check if they verified
      setTimeout(() => {
        refreshUser();
      }, 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to send verification email. Please try again.");
      setMessageType("error");
    } finally {
      setResending(false);
    }
  };

  const { logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Email Verification Required
          </CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Please verify your email address to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              We've sent a verification email to:
            </p>
            <p className="text-sm font-semibold text-white mt-1">
              {user?.email}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${
              messageType === "success" 
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border border-red-500/20 text-red-300"
            }`}>
              <div className="flex items-center gap-2">
                {messageType === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <p className="text-sm">{message}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={handleResendVerification}
              disabled={resending}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              {resending ? "Sending..." : "Resend Verification Email"}
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Logout
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

