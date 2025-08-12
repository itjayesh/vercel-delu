"use client"

import type React from "react"
import { useState } from "react"
import { useSupabase } from "../components/SupabaseProvider"
import { UserGroupIcon, ChartBarIcon, BanknotesIcon, Cog6ToothIcon, TicketIcon, ScaleIcon } from "../components/icons"

export const Admin: React.FC = () => {
  const { gigs, profile } = useSupabase()
  const [activeTab, setActiveTab] = useState<"overview" | "gigs" | "users" | "payments">("overview")

  const stats = {
    totalGigs: gigs.length,
    activeGigs: gigs.filter((g) => g.status === "open").length,
    completedGigs: gigs.filter((g) => g.status === "delivered").length,
    totalRevenue: gigs.reduce((sum, gig) => sum + gig.price * 0.1, 0), // 10% commission
  }

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your platform and monitor performance</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          {[
            { key: "overview", label: "Overview" },
            { key: "gigs", label: "Gigs" },
            { key: "users", label: "Users" },
            { key: "payments", label: "Payments" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Gigs" value={stats.totalGigs} icon={ChartBarIcon} color="bg-blue-500" />
            <StatCard title="Active Gigs" value={stats.activeGigs} icon={ScaleIcon} color="bg-green-500" />
            <StatCard title="Completed Gigs" value={stats.completedGigs} icon={TicketIcon} color="bg-purple-500" />
            <StatCard
              title="Platform Revenue"
              value={`₹${stats.totalRevenue.toFixed(2)}`}
              icon={BanknotesIcon}
              color="bg-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {gigs.slice(0, 5).map((gig) => (
                  <div key={gig.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{gig.parcel_info}</p>
                      <p className="text-xs text-gray-500">
                        {gig.pickup_block} → {gig.destination_block}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        gig.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : gig.status === "accepted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {gig.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <UserGroupIcon className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Manage Users</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <BanknotesIcon className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Process Payments</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Cog6ToothIcon className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Platform Settings</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content */}
      {activeTab !== "overview" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-500">This section is under development</p>
          </div>
        </div>
      )}
    </div>
  )
}
