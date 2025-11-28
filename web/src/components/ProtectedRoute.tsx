import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import VerifyEmailRequired from "@/pages/VerifyEmailRequired";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Require email verification before accessing protected routes
  if (user && !user.email_verified) {
    return <VerifyEmailRequired />;
  }

  return <>{children}</>;
}

