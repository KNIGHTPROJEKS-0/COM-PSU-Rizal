'use client';

import { useState, useEffect } from 'react';

interface ConnectionTestResult {
  timestamp: string;
  connection: {
    status: string;
    message: string;
  };
  auth: {
    status: string;
    user: any;
    error?: string;
  };
  database: {
    users: {
      status: string;
      error?: string;
      hasData: boolean;
    };
    classes: {
      status: string;
      error?: string;
      hasData: boolean;
    };
  };
}

export default function TestConnectionPage() {
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/test-connection');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Connection test failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Testing Supabase connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Connection Failed</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={testConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            COM-PSU-Rizal Setup Test
          </h1>
          <p className="text-gray-600">
            Testing Supabase connection and database access
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Connection Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                result.connection.status === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <h3 className="text-lg font-semibold">Connection</h3>
            </div>
            <p className="text-gray-600">{result.connection.message}</p>
          </div>

          {/* Authentication Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                result.auth.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <h3 className="text-lg font-semibold">Authentication</h3>
            </div>
            <p className="text-gray-600">
              {result.auth.user ? `Logged in as ${result.auth.user.email}` : 'No user logged in'}
            </p>
            {result.auth.error && (
              <p className="text-sm text-yellow-600 mt-2">{result.auth.error}</p>
            )}
          </div>

          {/* Database Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                result.database.users.status === 'accessible' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <h3 className="text-lg font-semibold">Database</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Users:</span>{' '}
                <span className={result.database.users.status === 'accessible' ? 'text-green-600' : 'text-yellow-600'}>
                  {result.database.users.status}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Classes:</span>{' '}
                <span className={result.database.classes.status === 'accessible' ? 'text-green-600' : 'text-yellow-600'}>
                  {result.database.classes.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Test Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Test Time:</strong> {new Date(result.timestamp).toLocaleString()}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
          </div>

          {(result.database.users.status === 'restricted' || result.database.classes.status === 'restricted') && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Database access appears restricted. This is normal if Row Level Security (RLS)
                policies are enabled. The connection is working correctly, but you may need to authenticate
                or adjust RLS policies for full access.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={testConnection}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4"
          >
            Run Test Again
          </button>
          <a
            href="/"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}