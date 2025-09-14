"use client"

import { useAuth } from "@com-psu-rizal/shared/contexts/AuthContext"
import { useEffect } from "react"

export default function TestAuth() {
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    console.log("Auth state:", { user, isAuthenticated, isLoading })
  }, [user, isAuthenticated, isLoading])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <div className="bg-gray-900 p-6 rounded-lg">
        <p className="mb-2">Loading: {isLoading ? "Yes" : "No"}</p>
        <p className="mb-2">Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
        {user && (
          <div>
            <p className="mb-2">User ID: {user.id}</p>
            <p className="mb-2">User Email: {user.email}</p>
            <p className="mb-2">User Role: {user.role}</p>
          </div>
        )}
        {!user && !isLoading && <p>No user data available</p>}
      </div>
    </div>
  )
}