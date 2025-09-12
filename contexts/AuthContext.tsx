'use client'

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { authService, AuthUser, AuthState } from '@/lib/authService'
import { User } from '@supabase/supabase-js'

interface AuthContextType extends AuthState {
  signUp: (data: { email: string; password: string; firstName: string; lastName: string; role: 'student' | 'faculty' }) => Promise<{ user: User | null; error: Error | null }>
  signIn: (data: { email: string; password: string }) => Promise<{ user: User | null; error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  forgotPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const user = await authService.getCurrentUser()
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false
      })
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = authService.supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          // User is signed in
          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email,
              role: (session.user.user_metadata?.role || 'student') as 'student' | 'faculty' | 'admin'
            },
            isAuthenticated: true,
            isLoading: false
          })
        } else {
          // User is signed out
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (data: { email: string; password: string; firstName: string; lastName: string; role: 'student' | 'faculty' }) => {
    const result = await authService.signUp(data)
    if (result.user) {
      setAuthState({
        user: {
          id: result.user.id,
          email: result.user.email,
          role: data.role
        },
        isAuthenticated: true,
        isLoading: false
      })
    }
    return result
  }

  const signIn = async (data: { email: string; password: string }) => {
    const result = await authService.signIn(data)
    if (result.user) {
      const userData = await authService.getCurrentUser()
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      })
    }
    return result
  }

  const signOut = async () => {
    const result = await authService.signOut()
    if (!result.error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
    return result
  }

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email)
  }

  const updatePassword = async (newPassword: string) => {
    return await authService.updatePassword(newPassword)
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signUp,
        signIn,
        signOut,
        forgotPassword,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}