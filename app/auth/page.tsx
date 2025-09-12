"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AuthCard } from "@/components/auth/auth-card"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState<"student" | "faculty">("student")
  const { toast } = useToast()
  const { signIn, signUp, forgotPassword } = useAuth()
  const router = useRouter()

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn({ email, password })
      
      if (result.error) {
        toast({
          title: "Sign in failed",
          description: result.error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Signed in successfully!",
          description: "Welcome back to your account.",
        })
        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    if (!firstName || !lastName) {
      toast({
        title: "Missing information",
        description: "Please enter your first and last name.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp({ 
        email, 
        password, 
        firstName, 
        lastName, 
        role 
      })
      
      if (result.error) {
        toast({
          title: "Sign up failed",
          description: result.error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Account created!",
          description: "Your account has been created successfully. Please check your email for verification.",
        })
        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} login`,
      description: `Redirecting to ${provider}...`,
    })
  }

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await forgotPassword(email)
      
      if (result.error) {
        toast({
          title: "Failed to send reset link",
          description: result.error.message || "Failed to send password reset link. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Reset link sent",
          description: "Check your email for password reset instructions.",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to send reset link",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

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
      <AuthCard
        isLoading={isLoading}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        role={role}
        setRole={setRole}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSocialLogin={handleSocialLogin}
        onForgotPassword={handleForgotPassword}
      />
    </div>
  )
}
