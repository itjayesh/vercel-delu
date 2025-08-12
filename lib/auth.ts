import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface AuthUser extends User {
  user_metadata?: {
    name?: string
    phone?: string
    block?: string
    profile_photo_url?: string
    college_id_url?: string
    referral_code?: string
    is_admin?: boolean
  }
}

export interface UserProfile {
  id: string
  name: string
  phone: string
  email: string
  block: string
  profile_photo_url?: string
  college_id_url?: string
  rating: number
  deliveries_completed: number
  wallet_balance: number
  is_admin: boolean
  referral_code: string
  referred_by_code?: string
  first_recharge_completed: boolean
  used_coupon_codes: Record<string, any>
  created_at: string
  updated_at: string
}

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string,
  userData: {
    name: string
    phone: string
    block: string
    referral_code?: string
    profile_photo_url?: string
    college_id_url?: string
  },
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...userData,
        is_admin: email === "admin@delu.live",
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return user as AuthUser
}

// Get user profile from database
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    if (error.code === "PGRST116") {
      return null // User not found
    }
    throw error
  }

  return data
}

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    throw error
  }

  return data
}

// Reset password
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    throw error
  }
}

// Update password
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw error
  }
}

// Check if user is admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  const profile = await getUserProfile(userId)
  return profile?.is_admin || false
}
