"use client";

import type React from "react";
import { useState } from "react";
import { useToast } from "@com-psu-rizal/shared/use-toast";
import { Button } from "@com-psu-rizal/ui/ui/button";
import { Input } from "@com-psu-rizal/ui/ui/input";
import { GraduationCap, School, Mail, Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "@com-psu-rizal/shared/contexts/AuthContext";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@com-psu-rizal/ui/GoogleSignInButton";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp, forgotPassword } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn({ email, password });

      if (result.error) {
        toast({
          title: "Sign in failed",
          description:
            result.error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed in successfully!",
          description: "Welcome back to your account.",
        });
        // Immediate redirect for better UX
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!firstName || !lastName) {
      toast({
        title: "Missing information",
        description: "Please enter your first and last name.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      if (result.error) {
        toast({
          title: "Sign up failed",
          description:
            result.error.message ||
            "Failed to create account. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description:
            "Your account has been created successfully. Please check your email for verification.",
        });
        // Immediate redirect for better UX
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} login`,
      description: `Redirecting to ${provider}...`,
    });
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await forgotPassword(email);

      if (result.error) {
        toast({
          title: "Failed to send reset link",
          description:
            result.error.message ||
            "Failed to send password reset link. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset link sent",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to send reset link",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-6xl mx-auto rounded-[32px] overflow-hidden shadow-2xl transform transition-all duration-100 hover:scale-[1.01]">
        <div className="flex flex-col lg:flex-row bg-black/40 backdrop-blur-xl border border-white/10 glass-enhanced">
          {/* Left Column - Role Selection */}
          <div className="w-full lg:w-2/5 p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex flex-col justify-between">
            <div>
              <div className="relative mb-12">
                <div className="flex flex-col items-center justify-center w-4/5 mx-auto">
                  <img
                    src="/icons/com-psu-rizal-white.svg"
                    alt="COM-PSU-Rizal Logo"
                    className="h-24 w-24 mb-4"
                  />
                  <h2 className="text-6xl font-bold text-white tracking-wider">
                    COM
                  </h2>
                  <p className="text-lg text-white/80 tracking-wide mt-1">
                    PSU-Rizal
                  </p>
                </div>
                <button
                  className="absolute -top-50 -right-1 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:bg-black/40 transition-all duration-100 btn-smooth z-10"
                  onClick={() => router.push("/")}
                  aria-label="Close authentication form"
                >
                  <X className="w-5 h-5 text-white/80" />
                </button>
              </div>

              <h1 className="text-3xl font-bold text-white -mt-2">
                {activeTab === "signup" ? "Join Our Community" : "Welcome Back"}
              </h1>

              <p className="text-white/80 mb-8">
                {activeTab === "signup"
                  ? "Create an account to access our academic video conferencing platform."
                  : "Sign in to continue your learning journey."}
              </p>

              <div className="space-y-4">
                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-100 cursor-pointer ${
                    role === "student"
                      ? "border-white/30 bg-white/10 backdrop-blur-sm"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setRole("student")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <GraduationCap className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Student
                      </h3>
                      <p className="text-white/70 text-sm">
                        Join classes and participate in learning
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-100 cursor-pointer ${
                    role === "faculty"
                      ? "border-white/30 bg-white/10 backdrop-blur-sm"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setRole("faculty")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <School className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Faculty
                      </h3>
                      <p className="text-white/70 text-sm">
                        Create classes and manage students
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10 mb-6">
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-3 rounded-full text-sm font-medium transition-all duration-100 ${
                    activeTab === "signup"
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setActiveTab("signin")}
                  className={`flex-1 py-3 rounded-full text-sm font-medium transition-all duration-100 ${
                    activeTab === "signin"
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
              </div>

              <p className="text-white/60 text-xs text-center">
                {activeTab === "signup"
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  onClick={() =>
                    setActiveTab(activeTab === "signin" ? "signup" : "signin")
                  }
                  className="text-white underline hover:text-white/80"
                >
                  {activeTab === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Right Column - Authentication Form */}
          <div className="w-full lg:w-3/5 p-8">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <img
                  src="/icons/com-psu-rizal-white.svg"
                  alt="COM-PSU-Rizal Logo"
                  className="h-16 w-16"
                />
              </div>

              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                {activeTab === "signup" ? "Create Account" : "Sign In"}
              </h2>

              <div className="space-y-6">
                {activeTab === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        First Name
                      </label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-12 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-12 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-12 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-10"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-12 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {activeTab === "signin" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border border-white/20 bg-black/20 text-white focus:ring-white/20 focus:ring-2"
                      />
                      <span className="text-white/80 text-sm">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-white/80 hover:text-white text-sm"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  onClick={activeTab === "signin" ? handleSignIn : handleSignUp}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl h-12 transition-all duration-100 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                      {activeTab === "signin"
                        ? "Signing in..."
                        : "Creating account..."}
                    </span>
                  ) : activeTab === "signin" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-white/60">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <GoogleSignInButton />
                  <Button
                    onClick={() => handleSocialLogin("Apple")}
                    variant="outline"
                    className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-12 hover:bg-black/30 text-white"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Apple
                  </Button>
                </div>

                <p className="text-center text-white/60 text-xs mt-8">
                  By{" "}
                  {activeTab === "signup"
                    ? "creating an account"
                    : "signing in"}
                  , you agree to our{" "}
                  <button className="text-white underline hover:text-white/80">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="text-white underline hover:text-white/80">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
