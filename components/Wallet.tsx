"use client"

import { useState, useEffect } from "react"
import { Button } from "./Button"
import { LoadWalletModal } from "./LoadWalletModal"
import { WithdrawModal } from "./WithdrawModal"
import { useAuth } from "../hooks/useAuth"

export function Wallet() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [isLoadWalletModalOpen, setIsLoadWalletModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch wallet balance and transactions from API
    // This is a mock implementation
    const fetchWalletData = async () => {
      try {
        // Mock data
        setBalance(125.5)
        setTransactions([
          { id: "1", type: "deposit", amount: 50, date: "2023-06-15", status: "completed" },
          { id: "2", type: "withdrawal", amount: 25, date: "2023-06-10", status: "completed" },
          { id: "3", type: "earning", amount: 100.5, date: "2023-06-05", status: "completed" },
        ])
      } catch (error) {
        console.error("Error fetching wallet data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [user])

  const handleLoadWallet = (amount: number) => {
    // In a real app, call API to load wallet
    console.log(`Loading wallet with $${amount}`)
    setBalance((prevBalance) => prevBalance + amount)
    setIsLoadWalletModalOpen(false)
  }

  const handleWithdraw = (amount: number) => {
    // In a real app, call API to withdraw
    console.log(`Withdrawing $${amount}`)
    setBalance((prevBalance) => prevBalance - amount)
    setIsWithdrawModalOpen(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Wallet</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm text-gray-500 uppercase">Current Balance</h2>
                <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
              </div>
              <div className="mt-4 md:mt-0 space-x-2">
                <Button onClick={() => setIsLoadWalletModalOpen(true)}>Load Wallet</Button>
                <Button onClick={() => setIsWithdrawModalOpen(true)} disabled={balance <= 0} variant="outline">
                  Withdraw
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h2 className="text-xl font-semibold p-6 border-b">Transaction History</h2>

            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction: any) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize">{transaction.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={transaction.type === "withdrawal" ? "text-red-600" : "text-green-600"}>
                            {transaction.type === "withdrawal" ? "-" : "+"} ${transaction.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions yet.</p>
              </div>
            )}
          </div>
        </>
      )}

      <LoadWalletModal
        isOpen={isLoadWalletModalOpen}
        onClose={() => setIsLoadWalletModalOpen(false)}
        onSubmit={handleLoadWallet}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSubmit={handleWithdraw}
        maxAmount={balance}
      />
    </div>
  )
}

export default Wallet
