"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"

interface Gig {
  id: string
  parcel_info: string
  pickup_block: string
  destination_block: string
  price: number
  delivery_deadline: string
  size?: string
  is_urgent?: boolean
  status: string
  requester_id: string
  deliverer_id?: string
  created_at: string
  updated_at: string
  requester?: {
    name: string
    rating: number
  }
}

interface Profile {
  id: string
  name: string
  email: string
  phone: string
  college_id: string
  wallet_balance: number
  rating: number
  is_admin: boolean
  profile_photo_url?: string
  created_at: string
  updated_at: string
}

interface Coupon {
  id: string
  code: string
  bonus_percentage: number
  is_active: boolean
  created_at: string
}

interface WalletLoadRequest {
  user_id: string
  amount: number
  utr: string
  screenshot_url: string
  coupon_code?: string | null
}

interface WithdrawalRequest {
  user_id: string
  amount: number
  upi_id: string
}

interface SupabaseContextType {
  user: User | null
  profile: Profile | null
  gigs: Gig[]
  coupons: Coupon[]
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  createGig: (gigData: any) => Promise<any>
  acceptGig: (gigId: string) => Promise<any>
  updateGigStatus: (gigId: string, status: string) => Promise<any>
  requestWalletLoad: (data: WalletLoadRequest) => Promise<any>
  requestWithdrawal: (data: WithdrawalRequest) => Promise<any>
  refreshProfile: () => Promise<void>
  refreshGigs: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [gigs, setGigs] = useState<Gig[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    // Fetch initial data
    fetchGigs()
    fetchCoupons()

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const fetchGigs = async () => {
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select(`
          *,
          requester:profiles!gigs_requester_id_fkey(name, rating)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setGigs(data || [])
    } catch (error) {
      console.error("Error fetching gigs:", error)
    }
  }

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase.from("coupons").select("*").eq("is_active", true)

      if (error) throw error
      setCoupons(data || [])
    } catch (error) {
      console.error("Error fetching coupons:", error)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const createGig = async (gigData: any) => {
    const { data, error } = await supabase.from("gigs").insert([gigData]).select().single()

    if (!error) {
      await fetchGigs()
    }
    return { data, error }
  }

  const acceptGig = async (gigId: string) => {
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("gigs")
      .update({
        deliverer_id: user.id,
        status: "accepted",
      })
      .eq("id", gigId)
      .select()
      .single()

    if (!error) {
      await fetchGigs()
    }
    return { data, error }
  }

  const updateGigStatus = async (gigId: string, status: string) => {
    const { data, error } = await supabase.from("gigs").update({ status }).eq("id", gigId).select().single()

    if (!error) {
      await fetchGigs()
    }
    return { data, error }
  }

  const requestWalletLoad = async (requestData: WalletLoadRequest) => {
    const { data, error } = await supabase.from("wallet_load_requests").insert([requestData]).select().single()

    return { data, error }
  }

  const requestWithdrawal = async (requestData: WithdrawalRequest) => {
    const { data, error } = await supabase.from("withdrawal_requests").insert([requestData]).select().single()

    return { data, error }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const refreshGigs = async () => {
    await fetchGigs()
  }

  const value = {
    user,
    profile,
    gigs,
    coupons,
    loading,
    signUp,
    signIn,
    signOut,
    createGig,
    acceptGig,
    updateGigStatus,
    requestWalletLoad,
    requestWithdrawal,
    refreshProfile,
    refreshGigs,
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}
