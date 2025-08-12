"use client"

import { useState, useEffect } from "react"
import { supabase, type Gig } from "../lib/supabase"
import { useAuth } from "./useAuth"

export const useGigs = () => {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchGigs()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("gigs")
      .on("postgres_changes", { event: "*", schema: "public", table: "gigs" }, (payload) => {
        if (payload.eventType === "INSERT") {
          fetchGigs() // Refetch to get user data
        } else if (payload.eventType === "UPDATE") {
          fetchGigs() // Refetch to get updated data
        } else if (payload.eventType === "DELETE") {
          setGigs((prev) => prev.filter((gig) => gig.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchGigs = async () => {
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select(`
          *,
          creator:created_by(id, full_name, profile_photo_url),
          accepter:accepted_by(id, full_name, profile_photo_url)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching gigs:", error)
        return
      }

      setGigs(data || [])
    } catch (error) {
      console.error("Error fetching gigs:", error)
    } finally {
      setLoading(false)
    }
  }

  const createGig = async (gigData: {
    title: string
    description: string
    price: number
    pickup_location: string
    delivery_location: string
    pickup_time?: string
    delivery_time?: string
  }) => {
    if (!user) return { error: "User not authenticated" }

    try {
      const { data, error } = await supabase
        .from("gigs")
        .insert({
          ...gigData,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) {
        return { error }
      }

      return { data, error: null }
    } catch (error) {
      return { error }
    }
  }

  const acceptGig = async (gigId: string, acceptanceSelfieUrl?: string) => {
    if (!user) return { error: "User not authenticated" }

    try {
      const { data, error } = await supabase
        .from("gigs")
        .update({
          accepted_by: user.id,
          status: "accepted",
          acceptance_selfie_url: acceptanceSelfieUrl,
        })
        .eq("id", gigId)
        .select()
        .single()

      if (error) {
        return { error }
      }

      return { data, error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateGigStatus = async (gigId: string, status: Gig["status"], completionPhotoUrl?: string) => {
    try {
      const updateData: any = { status }
      if (completionPhotoUrl) {
        updateData.completion_photo_url = completionPhotoUrl
      }

      const { data, error } = await supabase.from("gigs").update(updateData).eq("id", gigId).select().single()

      if (error) {
        return { error }
      }

      // If completing the gig, process payment
      if (status === "completed") {
        const { error: paymentError } = await supabase.rpc("complete_gig", {
          gig_uuid: gigId,
          completion_photo: completionPhotoUrl,
        })

        if (paymentError) {
          console.error("Payment processing error:", paymentError)
        }
      }

      return { data, error: null }
    } catch (error) {
      return { error }
    }
  }

  const getUserGigs = (userId?: string) => {
    const targetUserId = userId || user?.id
    if (!targetUserId) return []

    return gigs.filter((gig) => gig.created_by === targetUserId || gig.accepted_by === targetUserId)
  }

  const getOpenGigs = () => {
    return gigs.filter((gig) => gig.status === "open")
  }

  return {
    gigs,
    loading,
    createGig,
    acceptGig,
    updateGigStatus,
    getUserGigs,
    getOpenGigs,
    refetch: fetchGigs,
  }
}
