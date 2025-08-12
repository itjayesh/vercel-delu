"use client"

import type React from "react"
import { useState } from "react"
import { useAuthContext } from "../components/AuthProvider"
import { Button } from "../components/Button"
import { LoadWalletModal } from "../components/LoadWalletModal"
import { WithdrawModal } from "../components/WithdrawModal"
import { CreditCardIcon, BanknotesIcon } from "../components/icons"

export const Wallet: React.FC = () => {
  const { profile } = useAuthContext()
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading wallet information...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
        <p className="text-gray-600">Manage your earnings and payments</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Available Balance</p>
            <p className="text-4xl font-bold">₹{profile.wallet_balance.toFixed(2)}</p>
          </div>
          <div className="text-blue-200">
            <BanknotesIcon className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={() => setIsLoadModalOpen(true)} className="flex items-center justify-center gap-2 py-4">
          <CreditCardIcon className="w-5 h-5" />
          Load Money
        </Button>
        <Button
          onClick={() => setIsWithdrawModalOpen(true)}
          variant="secondary"
          className="flex items-center justify-center gap-2 py-4"
          disabled={profile.wallet_balance < 10}
        >
          <BanknotesIcon className="w-5 h-5" />
          Withdraw Money
        </Button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No transactions yet</p>
          <p className="text-sm">Your transaction history will appear here</p>
        </div>
      </div>

      {/* Modals */}
      <LoadWalletModal isOpen={isLoadModalOpen} onClose={() => setIsLoadModalOpen(false)} />
      <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
    </div>
  )
}
