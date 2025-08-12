"use client"

import type React from "react"
import { useState } from "react"
import { useSupabase } from "./SupabaseProvider"
import { useAuthContext } from "./AuthProvider"
import Modal from "./Modal"
import Button from "./Button"

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { requestWithdrawal } = useSupabase()
  const { user, profile } = useAuthContext()
  const [amount, setAmount] = useState("")
  const [upiId, setUpiId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const maxAmount = profile?.wallet_balance || 0
  const minAmount = 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const withdrawAmount = Number.parseFloat(amount)
    if (withdrawAmount < minAmount) {
      setError(`Minimum withdrawal amount is ₹${minAmount}`)
      return
    }
    if (withdrawAmount > maxAmount) {
      setError(`Insufficient balance. Available: ₹${maxAmount}`)
      return
    }

    setLoading(true)
    setError("")

    try {
      await requestWithdrawal({
        user_id: user.id,
        amount: withdrawAmount,
        upi_id: upiId,
      })

      alert("Withdrawal request submitted successfully! It will be processed within 24-48 hours.")
      onClose()
      setAmount("")
      setUpiId("")
    } catch (err: any) {
      setError(err.message || "Failed to submit withdrawal request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdraw Money">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
          <p className="font-medium">Available Balance: ₹{maxAmount.toFixed(2)}</p>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Withdrawal Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={minAmount}
            max={maxAmount}
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Min: ₹${minAmount}, Max: ₹${maxAmount}`}
          />
        </div>

        <div>
          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
            UPI ID
          </label>
          <input
            type="text"
            id="upiId"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="yourname@paytm"
          />
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md text-sm">
          <p>
            <strong>Note:</strong>
          </p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Minimum withdrawal amount is ₹{minAmount}</li>
            <li>Processing time: 24-48 hours</li>
            <li>Make sure your UPI ID is correct</li>
            <li>No charges for withdrawals</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={!amount || !upiId || Number.parseFloat(amount) < minAmount}
            className="flex-1"
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export { WithdrawModal }
export default WithdrawModal
