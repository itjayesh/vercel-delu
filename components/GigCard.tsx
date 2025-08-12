"use client"

import type React from "react"
import { useState } from "react"
import { useAuthContext } from "./AuthProvider"
import Button from "./Button"
import { ClockIcon, MapPinIcon, CurrencyDollarIcon, UserIcon } from "./icons"

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
  requester?: {
    name: string
    rating: number
  }
}

interface GigCardProps {
  gig: Gig
  onAccept?: (gigId: string) => void
  showActions?: boolean
}

const GigCard: React.FC<GigCardProps> = ({ gig, onAccept, showActions = true }) => {
  const { user } = useAuthContext()
  const [isAccepting, setIsAccepting] = useState(false)

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffInHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than 1 hour"
    if (diffInHours < 24) return `${diffInHours} hours`
    return `${Math.ceil(diffInHours / 24)} days`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "picked_up":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAccept = async () => {
    if (!onAccept) return
    setIsAccepting(true)
    try {
      await onAccept(gig.id)
    } finally {
      setIsAccepting(false)
    }
  }

  const canAccept = user && gig.status === "open" && gig.requester_id !== user.id && showActions

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{gig.parcel_info}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <UserIcon className="w-4 h-4 mr-1" />
            <span>{gig.requester?.name || "Anonymous"}</span>
            {gig.requester?.rating && <span className="ml-2 text-yellow-600">★ {gig.requester.rating.toFixed(1)}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gig.status)}`}>
            {gig.status.replace("_", " ").toUpperCase()}
          </span>
          {gig.is_urgent && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">URGENT</span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            From: <strong>{gig.pickup_block}</strong>
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            To: <strong>{gig.destination_block}</strong>
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            Deliver within: <strong>{formatDeadline(gig.delivery_deadline)}</strong>
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-lg font-bold text-green-600">₹{gig.price}</span>
        </div>
      </div>

      {gig.size && (
        <div className="mb-4">
          <span className="text-xs text-gray-500">Size: </span>
          <span className="text-sm font-medium">{gig.size}</span>
        </div>
      )}

      {canAccept && (
        <Button onClick={handleAccept} loading={isAccepting} fullWidth variant={gig.is_urgent ? "danger" : "primary"}>
          {isAccepting ? "Accepting..." : `Accept for ₹${gig.price}`}
        </Button>
      )}
    </div>
  )
}

export { GigCard }
export default GigCard
