import { Routes, Route, Navigate } from "react-router-dom"
import { AppProvider } from "./context/AppContext"
import { SupabaseProvider } from "./components/SupabaseProvider"
import { AuthProvider } from "./components/AuthProvider"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AdminProtectedRoute } from "./components/AdminProtectedRoute"
import LiveGigs from "./pages/LiveGigs"
import MyGigs from "./pages/MyGigs"
import CreateGig from "./pages/CreateGig"
import Wallet from "./pages/Wallet"
import ReferAndEarn from "./pages/ReferAndEarn"
import Admin from "./pages/Admin"
import ProjectSetup from "./pages/ProjectSetup"

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Navigate to="/live-gigs" replace />} />
              <Route path="/setup" element={<ProjectSetup />} />
              <Route
                path="/live-gigs"
                element={
                  <ProtectedRoute>
                    <LiveGigs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-gigs"
                element={
                  <ProtectedRoute>
                    <MyGigs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-gig"
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
                path="/refer"
                element={
                  <ProtectedRoute>
                    <ReferAndEarn />
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
          </div>
        </AppProvider>
      </AuthProvider>
    </SupabaseProvider>
  )
}

export default App
