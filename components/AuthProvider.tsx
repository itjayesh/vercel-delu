"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useSupabase } from "./SupabaseProvider"
import { AuthModal } from "./AuthModal"

interface AuthContextType {
  user: any
  profile: any
  openAuthModal: () => void
  closeAuthModal: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, signOut } = useSupabase()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  const logout = async () => {
    await signOut()
    closeAuthModal()
  }

  const value = {
    user,
    profile,
    openAuthModal,
    closeAuthModal,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  )
}
