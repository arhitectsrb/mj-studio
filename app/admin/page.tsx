"use client"

import { useState } from "react"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setLoggedIn(true)
      setError("")
    } else {
      setError("Pogrešna lozinka")
    }
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 mb-2"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Prijavi se
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <p>Ovde će biti prikaz rezervacija i opcije za potvrdu/odbijanje.</p>
    </div>
  )
}
