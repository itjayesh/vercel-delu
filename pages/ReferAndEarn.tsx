"use client"

import type React from "react"
import { useState } from "react"
import { useAuthContext } from "../components/AuthProvider"
import { Button } from "../components/Button"
import { ShareIcon, GiftIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from "../components/icons"

export const ReferAndEarn: React.FC = () => {
  const { profile } = useAuthContext()
  const [copied, setCopied] = useState(false)

  const referralCode = profile?.id?.slice(0, 8).toUpperCase() || "LOADING"
  const referralLink = `https://delu.live/signup?ref=${referralCode}`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join delu.live",
          text: "Join me on delu.live - the campus delivery platform!",
          url: referralLink,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      copyToClipboard(referralLink)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refer & Earn</h1>
        <p className="text-gray-600">Invite friends and earn rewards together</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-blue-600 mb-2">
            <GiftIcon className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-600">Friends Referred</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-green-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹0</p>
          <p className="text-sm text-gray-600">Total Earned</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-purple-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹50</p>
          <p className="text-sm text-gray-600">Per Referral</p>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Share Your Code</h3>
            <p className="text-sm text-gray-600">Share your referral code with friends</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Friend Signs Up</h3>
            <p className="text-sm text-gray-600">They join using your referral code</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Both Earn</h3>
            <p className="text-sm text-gray-600">You both get ₹50 bonus!</p>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Referral Code</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Referral Code</p>
              <p className="text-2xl font-bold text-gray-900 font-mono">{referralCode}</p>
            </div>
            <Button
              onClick={() => copyToClipboard(referralCode)}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              {copied ? (
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <p className="text-sm text-gray-600 mb-1">Referral Link</p>
              <p className="text-sm text-gray-900 break-all">{referralLink}</p>
            </div>
            <Button
              onClick={() => copyToClipboard(referralLink)}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              {copied ? (
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <Button onClick={shareReferral} className="w-full flex items-center justify-center gap-2">
          <ShareIcon className="w-5 h-5" />
          Share with Friends
        </Button>
      </div>

      {/* Terms */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <h3 className="font-medium text-yellow-900 mb-2">Terms & Conditions</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Both you and your friend receive ₹50 when they sign up using your code</li>
          <li>• Bonus is credited after your friend completes their first delivery</li>
          <li>• Referral rewards are subject to verification</li>
          <li>• Maximum 10 referrals per month</li>
        </ul>
      </div>
    </div>
  )
}
