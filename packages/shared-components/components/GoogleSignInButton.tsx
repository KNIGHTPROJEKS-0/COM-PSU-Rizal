"use client"

import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function GoogleSignInButton() {
  const { toast } = useToast()
  const router = useRouter()
  const { setIsLoading } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      })
      
      if (error) {
        console.error("Google sign-in error:", error.message)
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
      } else {
        // The OAuth flow will redirect the user, so we don't need to do anything here
        console.log("Redirecting to Google OAuth...")
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error)
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred during Google sign-in.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleGoogleLogin} 
      className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-12 hover:bg-black/30 text-white"
      variant="outline"
    >
      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center mr-2">
        <div className="w-3 h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full"></div>
      </div>
      Google
    </Button>
  )
}