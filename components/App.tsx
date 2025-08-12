"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { SupabaseProvider } from "./SupabaseProvider"
import { AuthProvider } from "./AuthProvider"
import { Header } from "./Header"
import { ProtectedRoute } from "./ProtectedRoute"
import { AdminProtectedRoute } from "./AdminProtectedRoute"
import { LiveGigs } from "../pages/LiveGigs"
import { MyGigs } from "../pages/MyGigs"
import { CreateGig } from "../pages/CreateGig"
import { Wallet } from "../pages/Wallet"
import { ReferAndEarn } from "../pages/ReferAndEarn"
import { ProjectSetup } from "../pages/ProjectSetup"
import { Admin } from "../pages/Admin"

export const App: React.FC = () => {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Navigate to="/live" replace />} />
                <Route path="/live" element={<LiveGigs />} />
                <Route
                  path="/my-gigs"
                  element={
                    <ProtectedRoute>
                      <MyGigs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreateGig />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wallet"
                  element={
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/refer-and-earn"
                  element={
                    <ProtectedRoute>
                      <ReferAndEarn />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/setup"
                  element={
                    <ProtectedRoute>
                      <ProjectSetup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <Admin />
                    </AdminProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </SupabaseProvider>
  )
}
