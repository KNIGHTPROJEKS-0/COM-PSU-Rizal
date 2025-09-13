import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are not set, skip session update
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables not set, skipping session update')
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    // Refresh session if expired - required for Server Components
    // Add a timeout to prevent hanging
    const getSessionWithTimeout = async () => {
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase session timeout')), 5000)
      )
      return await Promise.race([
        supabase.auth.getSession(),
        timeout
      ])
    }

    await getSessionWithTimeout()
  } catch (error) {
    console.warn('Failed to refresh session:', error)
  }

  return supabaseResponse
}