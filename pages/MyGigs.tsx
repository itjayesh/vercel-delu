"use client"

import type React from "react"
import { useState } from "react"
import { useSupabase } from "../components/SupabaseProvider"
import { useAuthContext } from "../components/AuthProvider"
import { GigCard } from "../components/GigCard"
import { Button } from "../components/Button"

export const MyGigs: React.FC = () => {
  const { gigs, updateGigStatus } = useSupabase()
  const { user } = useAuthContext()
  const [activeTab, setActiveTab] = useState<"requested" | "accepted">("requested")

  const requestedGigs = gigs.filter((gig) => gig.requester_id === user?.id)
  const acceptedGigs = gigs.filter((gig) => gig.deliverer_id === user?.id)

  const handleStatusUpdate = async (gigId: string, status: string) => {
    try {
      await updateGigStatus(gigId, status)
    } catch (error) {
      console.error("Error updating gig status:", error)
      alert("Failed to update gig status. Please try again.")
    }
  }

  const currentGigs = activeTab === "requested" ? requestedGigs : acceptedGigs

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gigs</h1>
        <p className="text-gray-600">Manage your delivery requests and accepted gigs</p>
      </div>

      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("requested")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "requested" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Requested ({requestedGigs.length})
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "accepted" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Accepted ({acceptedGigs.length})
          </button>
        </div>
      </div>

      {currentGigs.length === 0 ? (
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} gigs</h3>
          <p className="text-gray-500">
            {activeTab === "requested"
              ? "You haven't requested any deliveries yet."
              : "You haven't accepted any gigs yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentGigs.map((gig) => (
            <div key={gig.id} className="space-y-3">
              <GigCard gig={gig} showActions={false} />
              {activeTab === "accepted" && gig.status === "accepted" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleStatusUpdate(gig.id, "picked_up")} className="flex-1">
                    Mark Picked Up
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleStatusUpdate(gig.id, "delivered")}
                    className="flex-1"
                  >
                    Mark Delivered
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
