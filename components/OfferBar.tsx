"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSupabase } from "./SupabaseProvider"

const OfferBar: React.FC = () => {
  const { platformConfig } = useSupabase()
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)

  const offers = platformConfig.offer_bar_text
    ? platformConfig.offer_bar_text.split(" ;; ")
    : ["Welcome to Delu! Your campus delivery solution."]

  useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % offers.length)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [offers.length])

  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4">
      <div className="container mx-auto text-center">
        <p className="text-sm font-medium animate-pulse">🎉 {offers[currentOfferIndex]} 🎉</p>
      </div>
    </div>
  )
}

export default OfferBar
