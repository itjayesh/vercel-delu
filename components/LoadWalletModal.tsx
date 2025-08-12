"use client"

import type React from "react"
import { useState } from "react"
import { useSupabase } from "./SupabaseProvider"
import { useAuthContext } from "./AuthProvider"
import Modal from "./Modal"
import Button from "./Button"
import CameraCapture from "./CameraCapture"
import { CameraIcon } from "./icons"

interface LoadWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoadWalletModal: React.FC<LoadWalletModalProps> = ({ isOpen, onClose }) => {
  const { requestWalletLoad, coupons } = useSupabase()
  const { user } = useAuthContext()
  const [amount, setAmount] = useState("")
  const [utr, setUtr] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleScreenshotCapture = (file: File) => {
    setScreenshot(file)
    const url = URL.createObjectURL(file)
    setScreenshotPreview(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !screenshot) return

    setLoading(true)
    setError("")

    try {
      // In a real app, you'd upload the screenshot to storage first
      const screenshotUrl = URL.createObjectURL(screenshot)

      await requestWalletLoad({
        user_id: user.id,
        amount: Number.parseFloat(amount),
        utr,
        screenshot_url: screenshotUrl,
        coupon_code: couponCode || null,
      })

      alert("Wallet load request submitted successfully! It will be reviewed by admin.")
      onClose()
      setAmount("")
      setUtr("")
      setCouponCode("")
      setScreenshot(null)
      setScreenshotPreview(null)
    } catch (err: any) {
      setError(err.message || "Failed to submit request")
    } finally {
      setLoading(false)
    }
  }

  const selectedCoupon = coupons.find((c) => c.code === couponCode)
  const bonusAmount = selectedCoupon ? (Number.parseFloat(amount) * selectedCoupon.bonus_percentage) / 100 : 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Load Wallet">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount to load"
          />
        </div>

        <div>
          <label htmlFor="utr" className="block text-sm font-medium text-gray-700 mb-1">
            UTR Number
          </label>
          <input
            type="text"
            id="utr"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter UTR from payment"
          />
        </div>

        <div>
          <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
            Coupon Code (Optional)
          </label>
          <select
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a coupon</option>
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.code}>
                {coupon.code} - {coupon.bonus_percentage}% bonus
              </option>
            ))}
          </select>
          {selectedCoupon && (
            <p className="text-sm text-green-600 mt-1">
              Bonus: ₹{bonusAmount.toFixed(2)} ({selectedCoupon.bonus_percentage}%)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Screenshot</label>
          <CameraCapture
            onCapture={handleScreenshotCapture}
            trigger={
              <button
                type="button"
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                {screenshotPreview ? (
                  <img
                    src={screenshotPreview || "/placeholder.svg"}
                    alt="Screenshot preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <CameraIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Tap to capture screenshot</span>
                  </div>
                )}
              </button>
            }
          />
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
          <p>
            <strong>Instructions:</strong>
          </p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Make payment to the provided UPI ID</li>
            <li>Take a screenshot of the successful payment</li>
            <li>Enter the UTR number from your payment</li>
            <li>Your request will be reviewed within 24 hours</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!amount || !utr || !screenshot} className="flex-1">
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export { LoadWalletModal }
export default LoadWalletModal
