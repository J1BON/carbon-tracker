import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api.ts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateEmail, validatePassword, validateName, getPasswordStrength } from "@/lib/validation.ts";
import { Tooltip } from "@/components/ui/tooltip";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
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
      
      // If email not verified, user will be blocked by ProtectedRoute
      if (user.email_verified) {
        navigate("/home");
      } else {
        // Redirect to home, but ProtectedRoute will show verification page
        navigate("/");
      }
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
      
      // If email not verified, user will be blocked by ProtectedRoute
      // They'll see the verification required page
      if (user.email_verified) {
        navigate("/home");
      } else {
        // Still navigate, but ProtectedRoute will show verification page
        navigate("/");
      }
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
              MyCarbonFootprint
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
                  onChange={(e) => {
                    const email = e.target.value;
                    setLoginForm({ ...loginForm, email });
                    if (touched.email) {
                      const validation = validateEmail(email);
                      setFieldErrors(prev => ({
                        ...prev,
                        email: validation.isValid ? "" : validation.error || ""
                      }));
                    }
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, email: true }));
                    const validation = validateEmail(loginForm.email);
                    setFieldErrors(prev => ({
                      ...prev,
                      email: validation.isValid ? "" : validation.error || ""
                    }));
                  }}
                  className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base min-h-[44px] ${
                    fieldErrors.email ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
                    {fieldErrors.email}
                  </p>
                )}
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
                  onChange={(e) => {
                    const password = e.target.value;
                    setLoginForm({ ...loginForm, password });
                    if (touched.password) {
                      const validation = validatePassword(password);
                      setFieldErrors(prev => ({
                        ...prev,
                        password: validation.isValid ? "" : validation.error || ""
                      }));
                    }
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, password: true }));
                    const validation = validatePassword(loginForm.password);
                    setFieldErrors(prev => ({
                      ...prev,
                      password: validation.isValid ? "" : validation.error || ""
                    }));
                  }}
                  className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base min-h-[44px] ${
                    fieldErrors.password ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                />
                {fieldErrors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-400" role="alert">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 min-h-[44px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] text-base tracking-wide" 
                disabled={loading || !!fieldErrors.email || !!fieldErrors.password}
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
                  onChange={(e) => {
                    const name = e.target.value;
                    setRegisterForm({ ...registerForm, name });
                    if (touched.name) {
                      const validation = validateName(name);
                      setFieldErrors(prev => ({
                        ...prev,
                        name: validation.isValid ? "" : validation.error || ""
                      }));
                    }
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, name: true }));
                    const validation = validateName(registerForm.name);
                    setFieldErrors(prev => ({
                      ...prev,
                      name: validation.isValid ? "" : validation.error || ""
                    }));
                  }}
                  className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base min-h-[44px] ${
                    fieldErrors.name ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  placeholder="John Doe"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-400" role="alert">
                    {fieldErrors.name}
                  </p>
                )}
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
                  onChange={(e) => {
                    const email = e.target.value;
                    setRegisterForm({ ...registerForm, email });
                    if (touched.regEmail) {
                      const validation = validateEmail(email);
                      setFieldErrors(prev => ({
                        ...prev,
                        regEmail: validation.isValid ? "" : validation.error || ""
                      }));
                    }
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, regEmail: true }));
                    const validation = validateEmail(registerForm.email);
                    setFieldErrors(prev => ({
                      ...prev,
                      regEmail: validation.isValid ? "" : validation.error || ""
                    }));
                  }}
                  className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base min-h-[44px] ${
                    fieldErrors.regEmail ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={!!fieldErrors.regEmail}
                  aria-describedby={fieldErrors.regEmail ? "reg-email-error" : undefined}
                />
                {fieldErrors.regEmail && (
                  <p id="reg-email-error" className="mt-1 text-sm text-red-400" role="alert">
                    {fieldErrors.regEmail}
                  </p>
                )}
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
                  onChange={(e) => {
                    const password = e.target.value;
                    setRegisterForm({ ...registerForm, password });
                    if (touched.regPassword) {
                      const validation = validatePassword(password, true);
                      setFieldErrors(prev => ({
                        ...prev,
                        regPassword: validation.isValid ? "" : validation.error || ""
                      }));
                    }
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, regPassword: true }));
                    const validation = validatePassword(registerForm.password, true);
                    setFieldErrors(prev => ({
                      ...prev,
                      regPassword: validation.isValid ? "" : validation.error || ""
                    }));
                  }}
                  className={`h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 font-medium text-base min-h-[44px] ${
                    fieldErrors.regPassword ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                  aria-invalid={!!fieldErrors.regPassword}
                  aria-describedby={fieldErrors.regPassword ? "reg-password-error" : undefined}
                />
                {fieldErrors.regPassword && (
                  <p id="reg-password-error" className="mt-1 text-sm text-red-400" role="alert">
                    {fieldErrors.regPassword}
                  </p>
                )}
                {registerForm.password && !fieldErrors.regPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            getPasswordStrength(registerForm.password).strength === "weak"
                              ? "bg-red-500 w-1/3"
                              : getPasswordStrength(registerForm.password).strength === "medium"
                              ? "bg-yellow-500 w-2/3"
                              : "bg-emerald-500 w-full"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-gray-400 capitalize">
                        {getPasswordStrength(registerForm.password).strength}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 min-h-[44px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] text-base tracking-wide" 
                disabled={loading || !!fieldErrors.name || !!fieldErrors.regEmail || !!fieldErrors.regPassword}
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
