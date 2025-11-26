import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api.ts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm extends LoginForm {
  name: string;
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: "",
    password: "",
    name: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append("username", loginForm.email);
      formData.append("password", loginForm.password);

      const response = await api.post("/api/v1/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, user } = response.data;
      
      setToken(access_token);
      setUser(user);
      
      navigate("/home");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Invalid email or password. Please try again.";
      setError(errorMsg);
      console.error("Login error:", err, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/v1/auth/register", registerForm);

      const { access_token, user } = response.data;
      
      setToken(access_token);
      setUser(user);
      
      navigate("/home");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Registration failed. Please try again.";
      setError(errorMsg);
      console.error("Registration error:", err, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/5 to-transparent pointer-events-none"></div>
          
          <CardHeader className="space-y-3 border-b border-white/10 bg-white/5 relative z-10">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-center text-white tracking-tight">
              Carbon Tracker
            </CardTitle>
            <CardDescription className="text-center text-gray-300 text-base font-medium">
              {isLogin ? "Welcome back" : "Create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 relative z-10">
            {error && (
              <div className="mb-6 p-5 bg-red-500/10 backdrop-blur-lg border-2 border-red-500/30 rounded-2xl animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-red-400 text-xl">⚠</span>
                  </div>
                  <p className="font-semibold text-red-300 text-sm leading-relaxed">{error}</p>
                </div>
              </div>
            )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-300 mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-gray-300 mb-2 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base"
                  placeholder="••••••••"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] text-base tracking-wide" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-center text-sm text-gray-400 pt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError(null); // Clear error when switching
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline-offset-2 hover:underline transition-colors"
                >
                  Sign up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5" noValidate>
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-300 mb-2 block">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="reg-email" className="text-sm font-semibold text-gray-300 mb-2 block">
                  Email
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="reg-password" className="text-sm font-semibold text-gray-300 mb-2 block">
                  Password
                </Label>
                <Input
                  id="reg-password"
                  type="password"
                  required
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, password: e.target.value })
                  }
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base"
                  placeholder="••••••••"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] text-base tracking-wide" 
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-center text-sm text-gray-400 pt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError(null); // Clear error when switching
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline-offset-2 hover:underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
          </CardContent>
        </div>
      </div>
    </div>
  );
}
