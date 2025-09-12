import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string | undefined
  role: 'student' | 'faculty' | 'admin'
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'student' | 'faculty'
}

export interface SignInData {
  email: string
  password: string
}

class AuthService {
  private static instance: AuthService
  private currentUser: AuthUser | null = null

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signUp(data: SignUpData): Promise<{ user: User | null; error: Error | null }> {
    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role
          }
        }
      })

      if (authError) {
        return { user: null, error: authError }
      }

      // If signup is successful, create a user record in the database
      if (authData.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: data.email,
              first_name: data.firstName,
              last_name: data.lastName,
              role: data.role,
              created_at: new Date().toISOString()
            }
          ])

        if (insertError) {
          // If we can't create the user record, sign out the user
          await supabase.auth.signOut()
          return { user: null, error: insertError }
        }
      }

      return { user: authData.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  async signIn(data: SignInData): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        return { user: null, error }
      }

      // Get additional user data from the database
      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single()

        if (!userError && userData) {
          this.currentUser = {
            id: authData.user.id,
            email: authData.user.email,
            role: userData.role as 'student' | 'faculty' | 'admin'
          }
        }
      }

      return { user: authData.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      this.currentUser = null
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        this.currentUser = null
        return null
      }

      // If we already have the user data, return it
      if (this.currentUser && this.currentUser.id === user.id) {
        return this.currentUser
      }

      // Otherwise, fetch the user data from the database
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, first_name, last_name')
        .eq('id', user.id)
        .single()

      if (error) {
        return null
      }

      this.currentUser = {
        id: user.id,
        email: user.email,
        role: userData.role as 'student' | 'faculty' | 'admin'
      }

      return this.currentUser
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  async forgotPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // Expose the Supabase client instance
  get supabase() {
    return supabase
  }
}

export const authService = AuthService.getInstance()