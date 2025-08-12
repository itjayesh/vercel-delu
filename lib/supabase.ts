import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  college?: string
  profile_photo_url?: string
  college_id_url?: string
  wallet_balance: number
  total_earnings: number
  total_spent: number
  referral_code?: string
  referred_by?: string
  is_verified: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Gig {
  id: string
  title: string
  description: string
  price: number
  pickup_location: string
  delivery_location: string
  pickup_time?: string
  delivery_time?: string
  status: "open" | "accepted" | "in_progress" | "completed" | "cancelled"
  created_by: string
  accepted_by?: string
  acceptance_selfie_url?: string
  completion_photo_url?: string
  created_at: string
  updated_at: string
  creator?: User
  accepter?: User
}

export interface Transaction {
  id: string
  user_id: string
  gig_id?: string
  type: "credit" | "debit" | "refund" | "withdrawal" | "referral_bonus"
  amount: number
  description?: string
  status: "pending" | "completed" | "failed"
  created_at: string
}

export interface WalletLoadRequest {
  id: string
  user_id: string
  amount: number
  screenshot_url: string
  status: "pending" | "approved" | "rejected"
  admin_notes?: string
  created_at: string
  updated_at: string
  user?: User
}

export interface WithdrawalRequest {
  id: string
  user_id: string
  amount: number
  upi_id: string
  status: "pending" | "approved" | "rejected"
  admin_notes?: string
  created_at: string
  updated_at: string
  user?: User
}

export interface Coupon {
  id: string
  code: string
  discount_amount: number
  discount_type: "fixed" | "percentage"
  min_order_amount: number
  max_uses: number
  current_uses: number
  is_active: boolean
  expires_at?: string
  created_at: string
}

// Helper functions
export const uploadFile = async (bucket: string, file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return data.publicUrl
}

export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const deleteFile = async (bucket: string, path: string): Promise<{ data: any; error: any }> => {
  return await supabase.storage.from(bucket).remove([path])
}
