"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSupabase } from "../components/SupabaseProvider"
import { useAuthContext } from "../components/AuthProvider"
import { Button } from "../components/Button"

export const CreateGig: React.FC = () => {
  const navigate = useNavigate()
  const { createGig } = useSupabase()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    parcel_info: "",
    pickup_block: "",
    destination_block: "",
    price: "",
    delivery_deadline: "",
    size: "Medium",
    is_urgent: false,
    special_instructions: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const gigData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        requester_id: user.id,
        status: "open",
      }

      const { error } = await createGig(gigData)
      if (error) throw error

      navigate("/my-gigs")
    } catch (error: any) {
      console.error("Error creating gig:", error)
      alert("Failed to create gig. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Gig</h1>
        <p className="text-gray-600">Post a delivery request for your campus community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="parcel_info" className="block text-sm font-medium text-gray-700 mb-2">
            What needs to be delivered? *
          </label>
          <input
            type="text"
            id="parcel_info"
            name="parcel_info"
            value={formData.parcel_info}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Food from cafeteria, Books from library"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickup_block" className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location *
            </label>
            <input
              type="text"
              id="pickup_block"
              name="pickup_block"
              value={formData.pickup_block}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Block A, Cafeteria"
            />
          </div>

          <div>
            <label htmlFor="destination_block" className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Location *
            </label>
            <input
              type="text"
              id="destination_block"
              name="destination_block"
              value={formData.destination_block}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Block B, Room 201"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Fee (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="20.00"
            />
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
              Package Size
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Small">Small (fits in pocket)</option>
              <option value="Medium">Medium (fits in bag)</option>
              <option value="Large">Large (requires both hands)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="delivery_deadline" className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Deadline *
          </label>
          <input
            type="datetime-local"
            id="delivery_deadline"
            name="delivery_deadline"
            value={formData.delivery_deadline}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="special_instructions" className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            id="special_instructions"
            name="special_instructions"
            value={formData.special_instructions}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any special handling instructions or contact details..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_urgent"
            name="is_urgent"
            checked={formData.is_urgent}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_urgent" className="ml-2 block text-sm text-gray-700">
            Mark as urgent (higher priority)
          </label>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate("/live")} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Create Gig
          </Button>
        </div>
      </form>
    </div>
  )
}
