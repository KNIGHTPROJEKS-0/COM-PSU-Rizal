import { createClient } from '@com-psu-rizal/shared/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function TestPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // This is just a test query - you'll need to adjust based on your actual database schema
  // For now, we'll just check if we can connect to Supabase
  const { data, error } = await supabase.from('users').select('id').limit(1)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
      
      {error ? (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-red-300 mb-2">Connection Error</h2>
          <p className="text-red-200">Failed to connect to Supabase:</p>
          <pre className="mt-2 text-sm bg-black/30 p-3 rounded overflow-x-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Connection Successful</h2>
          <p className="text-green-200">Successfully connected to Supabase!</p>
          <p className="text-green-200 mt-2">
            Found {data?.length || 0} users in the database.
          </p>
        </div>
      )}
      
      <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-300 mb-2">Environment Variables</h2>
        <p className="text-gray-400">
          Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
        </p>
        <p className="text-gray-400">
          Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
        </p>
      </div>
    </div>
  )
}