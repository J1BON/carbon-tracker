import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, user, refreshUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Refresh user data to get latest admin status
    if (isAuthenticated) {
      refreshUser().finally(() => {
        setIsChecking(false);
      });
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, refreshUser]);

  if (isChecking) {
    // Show loading state while checking
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

