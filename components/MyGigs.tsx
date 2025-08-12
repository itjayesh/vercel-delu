"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { GigCard } from "./GigCard"
import { useAuth } from "../hooks/useAuth"
import { useGigs } from "../hooks/useGigs"
import { useSupabase } from "./SupabaseProvider"
import { useAuthContext } from "./AuthProvider"
import FeedbackForm from "./FeedbackForm"
import Modal from "./Modal"
import type { Database } from "../lib/supabase"

type MyGig = Database["public"]["Tables"]["gigs"]["Row"] & {
  requester: Database["public"]["Tables"]["users"]["Row"]
  deliverer?: Database["public"]["Tables"]["users"]["Row"]
}

const MyGigs: React.FC = () => {
  const { user } = useAuth()
  const { getUserGigs } = useGigs()
  const { gigs: supabaseGigs, updateGig } = useSupabase()
  const { user: authUser } = useAuthContext()
  const [gigs, setGigs] = useState<MyGig[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"requested" | "delivering">("requested")
  const [selectedGig, setSelectedGig] = useState<MyGig | null>(null)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState<"requester" | "deliverer">("requester")

  useEffect(() => {
    async function fetchMyGigs() {
      if (!user) return

      try {
        const fetchedGigs = await getUserGigs(user.id)
        setGigs(fetchedGigs)
      } catch (error) {
        console.error("Error fetching my gigs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyGigs()
  }, [getUserGigs, user])

  const handleCompleteGig = async (gig: MyGig, otp: string) => {
    if (gig.otp !== otp) {
      alert("Invalid OTP. Please check with the requester.")
      return
    }

    try {
      await updateGig(gig.id, { status: "COMPLETED" })
      alert("Gig completed successfully!")
    } catch (error) {
      console.error("Error completing gig:", error)
      alert("Failed to complete gig. Please try again.")
    }
  }

  const handleProvideFeedback = (gig: MyGig, type: "requester" | "deliverer") => {
    setSelectedGig(gig)
    setFeedbackType(type)
    setIsFeedbackModalOpen(true)
  }

  const handleFeedbackSubmit = async (rating: number, comments: string) => {
    if (!selectedGig) return

    try {
      const updates =
        feedbackType === "requester"
          ? { requester_rating: rating, requester_comments: comments }
          : { deliverer_rating: rating, deliverer_comments: comments }

      await updateGig(selectedGig.id, updates)
      setIsFeedbackModalOpen(false)
      setSelectedGig(null)
      alert("Feedback submitted successfully!")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Failed to submit feedback. Please try again.")
    }
  }

  const myRequestedGigs = supabaseGigs.filter((gig) => gig.requester_id === authUser?.id)
  const myDeliveringGigs = supabaseGigs.filter((gig) => gig.deliverer_id === authUser?.id)

  if (!authUser) return null

  return (
    <div className="min-h-screen bg-brand-dark p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">My Gigs</h1>

        {/* Mobile-friendly tabs */}
        <div className="border-b border-brand-dark-300">
          <nav className="flex space-x-1 sm:space-x-8">
            <button
              onClick={() => setActiveTab("requested")}
              className={`flex-1 sm:flex-none py-3 px-4 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "requested"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-400 hover:text-white hover:border-brand-dark-300"
              }`}
            >
              <span className="block sm:inline">Requested</span>
              <span className="block sm:inline sm:ml-1">({myRequestedGigs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("delivering")}
              className={`flex-1 sm:flex-none py-3 px-4 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "delivering"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-400 hover:text-white hover:border-brand-dark-300"
              }`}
            >
              <span className="block sm:inline">Delivering</span>
              <span className="block sm:inline sm:ml-1">({myDeliveringGigs.length})</span>
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "requested" && (
              <>
                {myRequestedGigs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-medium text-white mb-2">No requested gigs</h3>
                    <p className="text-gray-400 max-w-md mx-auto">You haven't requested any deliveries yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myRequestedGigs.map((gig) => (
                      <GigCard
                        key={gig.id}
                        gig={gig}
                        showRequesterInfo={true}
                        showOtp={gig.status === "ACCEPTED"}
                        onAction={
                          gig.status === "COMPLETED" && !gig.requester_rating
                            ? () => handleProvideFeedback(gig, "deliverer")
                            : undefined
                        }
                        actionLabel="Rate Deliverer"
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "delivering" && (
              <>
                {myDeliveringGigs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🚚</div>
                    <h3 className="text-xl font-medium text-white mb-2">No delivery gigs</h3>
                    <p className="text-gray-400 max-w-md mx-auto">You haven't accepted any deliveries yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myDeliveringGigs.map((gig) => (
                      <GigCard
                        key={gig.id}
                        gig={gig}
                        showRequesterInfo={true}
                        onAction={
                          gig.status === "COMPLETED" && !gig.deliverer_rating
                            ? () => handleProvideFeedback(gig, "requester")
                            : undefined
                        }
                        actionLabel="Rate Requester"
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <Modal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          title={`Rate ${feedbackType === "requester" ? "Requester" : "Deliverer"}`}
        >
          <FeedbackForm onSubmit={handleFeedbackSubmit} onCancel={() => setIsFeedbackModalOpen(false)} />
        </Modal>
      </div>
    </div>
  )
}

export default MyGigs
