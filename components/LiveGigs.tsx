"use client"

import type React from "react"
import { useState } from "react"
import { useSupabase } from "./SupabaseProvider"
import { useAuthContext } from "./AuthProvider"
import GigCard from "./GigCard"
import AcceptanceFlowModal from "./AcceptanceFlowModal"
import type { Database } from "../lib/supabase"

type Gig = Database["public"]["Tables"]["gigs"]["Row"] & {
  requester: Database["public"]["Tables"]["users"]["Row"]
  deliverer?: Database["public"]["Tables"]["users"]["Row"]
}

const LiveGigs: React.FC = () => {
  const { gigs, loading } = useSupabase()
  const { user, profile } = useAuthContext()
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null)
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "urgent" | "my-block">("all")
  const [sortBy, setSortBy] = useState<"newest" | "price-high" | "price-low" | "deadline">("newest")

  const openGigs = gigs.filter((gig) => gig.status === "OPEN")

  const filteredGigs = openGigs.filter((gig) => {
    if (filter === "urgent") return gig.is_urgent
    if (filter === "my-block" && profile) {
      return gig.pickup_block === profile.block || gig.destination_block === profile.block
    }
    return true
  })

  const sortedGigs = [...filteredGigs].sort((a, b) => {
    switch (sortBy) {
      case "price-high":
        return b.price - a.price
      case "price-low":
        return a.price - b.price
      case "deadline":
        return new Date(a.delivery_deadline).getTime() - new Date(b.delivery_deadline).getTime()
      case "newest":
      default:
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
    }
  })

  const handleAcceptGig = (gig: Gig) => {
    if (!user) {
      return
    }
    setSelectedGig(gig)
    setIsAcceptanceModalOpen(true)
  }

  const handleCloseAcceptanceModal = () => {
    setIsAcceptanceModalOpen(false)
    setSelectedGig(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Live Gigs</h1>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-brand-dark-200 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-brand-dark-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-brand-dark-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-brand-dark-300 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Gigs ({sortedGigs.length})</h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="flex-1 px-4 py-3 bg-brand-dark-200 border border-brand-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">All Gigs</option>
              <option value="urgent">Urgent Only</option>
              {profile && <option value="my-block">My Block</option>}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-4 py-3 bg-brand-dark-200 border border-brand-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="newest">Newest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>

        {sortedGigs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-white mb-2">No gigs available</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {filter === "all"
                ? "Check back later for new delivery opportunities!"
                : "Try adjusting your filters to see more gigs."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedGigs.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                onAction={() => handleAcceptGig(gig)}
                actionLabel="Accept Gig"
                showRequesterInfo={false}
              />
            ))}
          </div>
        )}

        {selectedGig && (
          <AcceptanceFlowModal isOpen={isAcceptanceModalOpen} onClose={handleCloseAcceptanceModal} gig={selectedGig} />
        )}
      </div>
    </div>
  )
}

export default LiveGigs
