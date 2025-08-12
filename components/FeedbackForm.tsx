"use client"

import type React from "react"
import { useState } from "react"
import { StarIcon } from "./icons"
import Button from "./Button"

interface FeedbackFormProps {
  onSubmit: (feedback: {
    rating: number
    comments: string
  }) => void
  onCancel: () => void
  title?: string
  submitText?: string
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  onCancel,
  title = "Rate your experience",
  submitText = "Submit Feedback",
}) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comments, setComments] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      alert("Please select a rating")
      return
    }
    onSubmit({ rating, comments })
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isActive = starValue <= (hoveredRating || rating)

      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className={`p-1 transition-colors ${isActive ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
        >
          <StarIcon className="w-8 h-8" />
        </button>
      )
    })
  }

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Rate your experience:</p>
          <div className="flex justify-center space-x-1">{renderStars()}</div>
          {rating > 0 && <p className="text-sm text-gray-500 mt-2">{rating} out of 5 stars</p>}
        </div>

        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
            Comments (optional)
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Share your experience..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={rating === 0}>
            {submitText}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FeedbackForm
