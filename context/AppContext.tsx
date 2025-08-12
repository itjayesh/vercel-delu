"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../hooks/useAuth"

interface Transaction {
  id: string
  user_id: string
  type: "CREDIT" | "DEBIT" | "TOPUP" | "PAYOUT" | "WITHDRAWAL"
  amount: number
  description: string
  timestamp: string
  related_gig_id?: string
  created_at: string
}

interface WalletLoadRequest {
  id: string
  user_id: string
  amount: number
  utr: string
  screenshot_url: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  requested_at: string
  coupon_code?: string
  created_at: string
  updated_at: string
}

interface WithdrawalRequest {
  id: string
  user_id: string
  amount: number
  upi_id: string
  status: "PENDING" | "PROCESSED" | "REJECTED"
  requested_at: string
  created_at: string
  updated_at: string
}

interface Coupon {
  id: string
  code: string
  bonus_percentage: number
  is_active: boolean
  max_uses_per_user: number
  created_at: string
  updated_at: string
}

interface PlatformConfig {
  platform_fee: number
  offer_bar_text: string
  referrer_reward: number
  referee_bonus_percentage: number
}

interface AppContextType {
  // Transactions
  transactions: Transaction[]
  loadingTransactions: boolean
  fetchTransactions: () => Promise<void>
  createTransaction: (transaction: Omit<Transaction, "id" | "timestamp" | "created_at">) => Promise<void>

  // Wallet Load Requests
  walletLoadRequests: WalletLoadRequest[]
  loadingWalletRequests: boolean
  fetchWalletLoadRequests: () => Promise<void>
  createWalletLoadRequest: (
    request: Omit<WalletLoadRequest, "id" | "status" | "requested_at" | "created_at" | "updated_at">,
  ) => Promise<void>
  updateWalletLoadRequest: (id: string, updates: Partial<WalletLoadRequest>) => Promise<void>

  // Withdrawal Requests
  withdrawalRequests: WithdrawalRequest[]
  loadingWithdrawalRequests: boolean
  fetchWithdrawalRequests: () => Promise<void>
  createWithdrawalRequest: (
    request: Omit<WithdrawalRequest, "id" | "status" | "requested_at" | "created_at" | "updated_at">,
  ) => Promise<void>
  updateWithdrawalRequest: (id: string, updates: Partial<WithdrawalRequest>) => Promise<void>

  // Coupons
  coupons: Coupon[]
  loadingCoupons: boolean
  fetchCoupons: () => Promise<void>
  validateCoupon: (code: string) => Promise<Coupon | null>

  // Platform Config
  platformConfig: PlatformConfig | null
  loadingPlatformConfig: boolean
  fetchPlatformConfig: () => Promise<void>

  // UI State
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
  authMode: "login" | "signup"
  setAuthMode: (mode: "login" | "signup") => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  // State
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)

  const [walletLoadRequests, setWalletLoadRequests] = useState<WalletLoadRequest[]>([])
  const [loadingWalletRequests, setLoadingWalletRequests] = useState(false)

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [loadingWithdrawalRequests, setLoadingWithdrawalRequests] = useState(false)

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loadingCoupons, setLoadingCoupons] = useState(false)

  const [platformConfig, setPlatformConfig] = useState<PlatformConfig | null>(null)
  const [loadingPlatformConfig, setLoadingPlatformConfig] = useState(false)

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  // Transactions
  const fetchTransactions = async () => {
    if (!user) return

    try {
      setLoadingTransactions(true)
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const createTransaction = async (transaction: Omit<Transaction, "id" | "timestamp" | "created_at">) => {
    try {
      const { error } = await supabase.from("transactions").insert([transaction])

      if (error) throw error
      await fetchTransactions()
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  }

  // Wallet Load Requests
  const fetchWalletLoadRequests = async () => {
    if (!user) return

    try {
      setLoadingWalletRequests(true)
      const { data, error } = await supabase
        .from("wallet_load_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("requested_at", { ascending: false })

      if (error) throw error
      setWalletLoadRequests(data || [])
    } catch (error) {
      console.error("Error fetching wallet load requests:", error)
    } finally {
      setLoadingWalletRequests(false)
    }
  }

  const createWalletLoadRequest = async (
    request: Omit<WalletLoadRequest, "id" | "status" | "requested_at" | "created_at" | "updated_at">,
  ) => {
    try {
      const { error } = await supabase.from("wallet_load_requests").insert([request])

      if (error) throw error
      await fetchWalletLoadRequests()
    } catch (error) {
      console.error("Error creating wallet load request:", error)
      throw error
    }
  }

  const updateWalletLoadRequest = async (id: string, updates: Partial<WalletLoadRequest>) => {
    try {
      const { error } = await supabase.from("wallet_load_requests").update(updates).eq("id", id)

      if (error) throw error
      await fetchWalletLoadRequests()
    } catch (error) {
      console.error("Error updating wallet load request:", error)
      throw error
    }
  }

  // Withdrawal Requests
  const fetchWithdrawalRequests = async () => {
    if (!user) return

    try {
      setLoadingWithdrawalRequests(true)
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("requested_at", { ascending: false })

      if (error) throw error
      setWithdrawalRequests(data || [])
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error)
    } finally {
      setLoadingWithdrawalRequests(false)
    }
  }

  const createWithdrawalRequest = async (
    request: Omit<WithdrawalRequest, "id" | "status" | "requested_at" | "created_at" | "updated_at">,
  ) => {
    try {
      const { error } = await supabase.from("withdrawal_requests").insert([request])

      if (error) throw error
      await fetchWithdrawalRequests()
    } catch (error) {
      console.error("Error creating withdrawal request:", error)
      throw error
    }
  }

  const updateWithdrawalRequest = async (id: string, updates: Partial<WithdrawalRequest>) => {
    try {
      const { error } = await supabase.from("withdrawal_requests").update(updates).eq("id", id)

      if (error) throw error
      await fetchWithdrawalRequests()
    } catch (error) {
      console.error("Error updating withdrawal request:", error)
      throw error
    }
  }

  // Coupons
  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true)
      const { data, error } = await supabase.from("coupons").select("*").eq("is_active", true)

      if (error) throw error
      setCoupons(data || [])
    } catch (error) {
      console.error("Error fetching coupons:", error)
    } finally {
      setLoadingCoupons(false)
    }
  }

  const validateCoupon = async (code: string): Promise<Coupon | null> => {
    try {
      const { data, error } = await supabase.from("coupons").select("*").eq("code", code).eq("is_active", true).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // Coupon not found
        }
        throw error
      }

      return data
    } catch (error) {
      console.error("Error validating coupon:", error)
      return null
    }
  }

  // Platform Config
  const fetchPlatformConfig = async () => {
    try {
      setLoadingPlatformConfig(true)
      const { data, error } = await supabase.from("platform_config").select("*")

      if (error) throw error

      // Convert array to object
      const config: any = {}
      data?.forEach((item) => {
        config[item.key] = item.value
      })

      // Parse numeric values
      setPlatformConfig({
        platform_fee: Number.parseFloat(config.platform_fee || "0.2"),
        offer_bar_text: config.offer_bar_text || "",
        referrer_reward: Number.parseFloat(config.referrer_reward || "10"),
        referee_bonus_percentage: Number.parseFloat(config.referee_bonus_percentage || "0.05"),
      })
    } catch (error) {
      console.error("Error fetching platform config:", error)
    } finally {
      setLoadingPlatformConfig(false)
    }
  }

  // Effects
  useEffect(() => {
    if (user) {
      fetchTransactions()
      fetchWalletLoadRequests()
      fetchWithdrawalRequests()
    }
  }, [user])

  useEffect(() => {
    fetchCoupons()
    fetchPlatformConfig()
  }, [])

  const value: AppContextType = {
    // Transactions
    transactions,
    loadingTransactions,
    fetchTransactions,
    createTransaction,

    // Wallet Load Requests
    walletLoadRequests,
    loadingWalletRequests,
    fetchWalletLoadRequests,
    createWalletLoadRequest,
    updateWalletLoadRequest,

    // Withdrawal Requests
    withdrawalRequests,
    loadingWithdrawalRequests,
    fetchWithdrawalRequests,
    createWithdrawalRequest,
    updateWithdrawalRequest,

    // Coupons
    coupons,
    loadingCoupons,
    fetchCoupons,
    validateCoupon,

    // Platform Config
    platformConfig,
    loadingPlatformConfig,
    fetchPlatformConfig,

    // UI State
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
