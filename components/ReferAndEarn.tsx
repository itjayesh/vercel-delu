"use client"

import { useState } from "react"
import { Button } from "./Button"
import { useAuth } from "../hooks/useAuth"
import { ShareIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from "./icons"

export function ReferAndEarn() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  // Generate a referral code based on user ID or use a mock one
  const referralCode = user ? `DELU${user.id.substring(0, 6)}` : "DELUV0123"
  const referralLink = `https://deluv0.vercel.app/signup?ref=${referralCode}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Deluv0",
          text: "Sign up for Deluv0 using my referral link and get $5 credit!",
          url: referralLink,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Refer & Earn</h1>
        <p className="text-lg opacity-90">Invite friends and earn rewards when they join!</p>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-6 h-6 mr-3 mt-0.5 font-semibold text-sm">
                1
              </span>
              <span>Share your unique referral link with friends</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-6 h-6 mr-3 mt-0.5 font-semibold text-sm">
                2
              </span>
              <span>Your friend signs up using your link</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-6 h-6 mr-3 mt-0.5 font-semibold text-sm">
                3
              </span>
              <span>You both get $5 credit when they complete their first delivery!</span>
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-100 rounded-l-lg p-3 truncate">{referralLink}</div>
            <button
              onClick={handleCopyLink}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-lg transition-colors"
              aria-label="Copy referral link"
            >
              {copied ? (
                <ClipboardDocumentCheckIcon className="w-5 h-5" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {copied && <p className="text-green-600 text-sm mt-2">Copied to clipboard!</p>}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Share with Friends</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleShare} className="flex items-center">
              <ShareIcon className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Referral Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Total Referrals</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Earnings</p>
              <p className="text-2xl font-bold">$0.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferAndEarn
