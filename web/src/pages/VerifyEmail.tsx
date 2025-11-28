import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { refreshUser, isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.get(`/api/v1/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
        
        // Refresh user data to update email_verified status if logged in
        if (isAuthenticated) {
          try {
            await refreshUser();
            // Reload the page to refresh the app state
            setTimeout(() => {
              window.location.href = "/";
            }, 1500);
          } catch (e) {
            console.log("Could not refresh user, redirecting to login");
            setTimeout(() => {
              navigate("/login");
            }, 1500);
          }
        } else {
          // Not logged in - show login button
          // Don't auto-redirect, let user click login button
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.detail || "Failed to verify email. The link may have expired.");
      }
    };

    verifyEmail();
  }, [token, navigate, refreshUser, isAuthenticated]);

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
            {status === "loading" && (
              <Loader2 className="h-16 w-16 text-emerald-500 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            )}
            {status === "error" && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="space-y-4">
              {isAuthenticated ? (
                <>
                  <p className="text-center text-gray-300 text-sm">
                    Reloading page...
                  </p>
                  <Button
                    onClick={() => window.location.href = "/"}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Go to Homepage
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-center text-gray-300 text-sm">
                    Email verified! Please login to continue.
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Go to Login
                  </Button>
                </>
              )}
            </div>
          )}
          {status === "error" && (
            <div className="space-y-4">
              <p className="text-center text-gray-300 text-sm">
                You can request a new verification email from your account settings.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

