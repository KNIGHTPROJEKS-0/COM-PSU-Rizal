'use client'

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { authService, AuthUser, AuthState } from '../../../lib/authService'
import { User } from '@supabase/supabase-js'

interface AuthContextType extends AuthState {
  signUp: (data: { email: string; password: string; firstName: string; lastName: string; role: 'student' | 'faculty' }) => Promise<{ user: User | null; error: Error | null }>
  signIn: (data: { email: string; password: string }) => Promise<{ user: User | null; error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  forgotPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
  setIsLoading: (loading: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  const setIsLoading = (loading: boolean) => {
    setAuthState(prev => ({
      ...prev,
      isLoading: loading
    }))
  }

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      console.log('Checking if user is already logged in...');
      const user = await authService.getCurrentUser()
      console.log('Current user:', user);
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false
      })
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = authService.supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        if (session?.user) {
          // User is signed in
          // Get user role from database
          const { data: userData, error } = await authService.supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          console.log('User data from database:', userData, error);

          let role = 'student' as 'student' | 'faculty' | 'admin'
          if (!error && userData) {
            role = userData.role as 'student' | 'faculty' | 'admin'
          } else {
            // Fallback to user metadata if database lookup fails
            role = (session.user.user_metadata?.role || 'student') as 'student' | 'faculty' | 'admin'
          }

          console.log('Setting user with role:', role);

          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email,
              role: role
            },
            isAuthenticated: true,
            isLoading: false
          })
        } else {
          // User is signed out
          console.log('User signed out');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      }
    )

    return () => {
      console.log('Unsubscribing from auth state changes');
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
    console.log('AuthContext: Attempting to sign in with:', data.email);
    const result = await authService.signIn(data)
    console.log('AuthContext: Sign in result:', result);
    if (result.user) {
      // Get user role from database
      console.log('AuthContext: Fetching user role from database for user ID:', result.user.id);
      const { data: userData, error } = await authService.supabase
        .from('users')
        .select('role')
        .eq('id', result.user.id)
        .single()

      console.log('AuthContext: User data from database:', userData, error);

      let role = 'student' as 'student' | 'faculty' | 'admin'
      if (!error && userData) {
        role = userData.role as 'student' | 'faculty' | 'admin'
      } else {
        // Fallback to user metadata if database lookup fails
        role = (result.user.user_metadata?.role || 'student') as 'student' | 'faculty' | 'admin'
      }

      console.log('AuthContext: Setting user role to:', role);

      setAuthState({
        user: {
          id: result.user.id,
          email: result.user.email,
          role: role
        },
        isAuthenticated: true,
        isLoading: false
      })
      
      console.log('AuthContext: Auth state updated, user should be redirected to dashboard');
    } else {
      console.log('AuthContext: Sign in failed, no user returned');
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
        updatePassword,
        setIsLoading
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