"use client"

import type React from "react"
import { useState } from "react"
import { useSupabase } from "../components/SupabaseProvider"
import { useAuthContext } from "../components/AuthProvider"
import { GigCard } from "../components/GigCard"
import { AcceptanceFlowModal } from "../components/AcceptanceFlowModal"

export const LiveGigs: React.FC = () => {
  const { gigs, acceptGig } = useSupabase()
  const { user } = useAuthContext()
  const [selectedGig, setSelectedGig] = useState<any>(null)
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState(false)

  const availableGigs = gigs.filter((gig) => gig.status === "open" && gig.requester_id !== user?.id)

  const handleAcceptGig = (gigId: string) => {
    const gig = gigs.find((g) => g.id === gigId)
    if (gig) {
      setSelectedGig(gig)
      setIsAcceptanceModalOpen(true)
    }
  }

  const handleConfirmAccept = async () => {
    if (selectedGig) {
      try {
        await acceptGig(selectedGig.id)
        setIsAcceptanceModalOpen(false)
        setSelectedGig(null)
      } catch (error) {
        console.error("Error accepting gig:", error)
        alert("Failed to accept gig. Please try again.")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Gigs</h1>
        <p className="text-gray-600">Find delivery opportunities on your campus</p>
      </div>

      {availableGigs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gigs available</h3>
          <p className="text-gray-500">Check back later for new delivery opportunities!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableGigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} onAccept={handleAcceptGig} showActions={!!user} />
          ))}
        </div>
      )}

      <AcceptanceFlowModal
        isOpen={isAcceptanceModalOpen}
        onClose={() => setIsAcceptanceModalOpen(false)}
        gig={selectedGig}
        onConfirm={handleConfirmAccept}
      />
    </div>
  )
}
