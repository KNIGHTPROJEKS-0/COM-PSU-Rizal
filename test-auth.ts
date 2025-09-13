import { createClient } from '@/utils/supabase/client'

// Test Supabase connection and authentication
async function testAuth() {
  const supabase = createClient()
  
  // Test sign up
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpassword123',
    options: {
      data: {
        first_name: 'Test',
        last_name: 'User',
        role: 'student'
      }
    }
  })
  
  if (error) {
    console.log('Sign up error:', error)
  } else {
    console.log('Sign up successful:', data)
  }
  
  // Test sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'testpassword123'
  })
  
  if (signInError) {
    console.log('Sign in error:', signInError)
  } else {
    console.log('Sign in successful:', signInData)
  }
}

testAuth()