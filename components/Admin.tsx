"use client"

import { useState, useEffect } from "react"
import { Header } from "./Header"
import { Button } from "./Button"
import { useAuth } from "../hooks/useAuth"
import { ChartBarIcon, UserGroupIcon, PackageIcon, CreditCardIcon, Cog6ToothIcon } from "./icons"

export function Admin() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGigs: 0,
    totalRevenue: 0,
    activeGigs: 0,
  })

  useEffect(() => {
    // In a real app, fetch admin data from API
    // This is a mock implementation
    const fetchAdminData = async () => {
      try {
        // Mock data
        setStats({
          totalUsers: 124,
          totalGigs: 87,
          totalRevenue: 1250.75,
          activeGigs: 42,
        })
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-500 text-sm">Total Users</h3>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <PackageIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-500 text-sm">Total Gigs</h3>
                    <p className="text-2xl font-bold">{stats.totalGigs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <CreditCardIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-500 text-sm">Active Gigs</h3>
                    <p className="text-2xl font-bold">{stats.activeGigs}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                        <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">2023-06-15</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                        <td className="px-6 py-4 whitespace-nowrap">jane@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">2023-06-14</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Mike Johnson</td>
                        <td className="px-6 py-4 whitespace-nowrap">mike@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">2023-06-12</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Gigs</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Coffee Delivery</td>
                        <td className="px-6 py-4 whitespace-nowrap">$5.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Grocery Pickup</td>
                        <td className="px-6 py-4 whitespace-nowrap">$15.50</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            In Progress
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Package Delivery</td>
                        <td className="px-6 py-4 whitespace-nowrap">$12.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      case "users":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <input type="text" placeholder="Search users..." className="px-4 py-2 border rounded-lg w-64" />
                <Button>Add User</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Sample user data */}
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">USR{1000 + index}</td>
                        <td className="px-6 py-4 whitespace-nowrap">User {index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">user{index + 1}@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">{index === 0 ? "Admin" : "User"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                    <span className="font-medium">20</span> results
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded text-sm">Previous</button>
                    <button className="px-3 py-1 border rounded bg-blue-500 text-white text-sm">1</button>
                    <button className="px-3 py-1 border rounded text-sm">2</button>
                    <button className="px-3 py-1 border rounded text-sm">3</button>
                    <button className="px-3 py-1 border rounded text-sm">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "gigs":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Gig Management</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <input type="text" placeholder="Search gigs..." className="px-4 py-2 border rounded-lg w-64" />
                <div>
                  <select className="px-4 py-2 border rounded-lg mr-2">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                  <Button>Add Gig</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Sample gig data */}
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">GIG{1000 + index}</td>
                        <td className="px-6 py-4 whitespace-nowrap">Sample Gig {index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${(5 + index * 2).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">Campus Building {index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              index % 3 === 0
                                ? "bg-green-100 text-green-800"
                                : index % 3 === 1
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {index % 3 === 0 ? "Active" : index % 3 === 1 ? "In Progress" : "Completed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">2023-06-{15 - index}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                    <span className="font-medium">15</span> results
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded text-sm">Previous</button>
                    <button className="px-3 py-1 border rounded bg-blue-500 text-white text-sm">1</button>
                    <button className="px-3 py-1 border rounded text-sm">2</button>
                    <button className="px-3 py-1 border rounded text-sm">3</button>
                    <button className="px-3 py-1 border rounded text-sm">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "settings":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">System Settings</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                    <input type="text" className="px-4 py-2 border rounded-lg w-full" defaultValue="Deluv0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      className="px-4 py-2 border rounded-lg w-full"
                      defaultValue="support@deluv0.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label>
                    <input type="number" className="px-4 py-2 border rounded-lg w-full" defaultValue="10" />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                      Enable email notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="push-notifications"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-700">
                      Enable push notifications
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Button>Save Settings</Button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Admin Menu</h2>
              </div>
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center w-full px-4 py-2 rounded-md text-left mb-1 ${
                    activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  <ChartBarIcon className="w-5 h-5 mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center w-full px-4 py-2 rounded-md text-left mb-1 ${
                    activeTab === "users" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  <UserGroupIcon className="w-5 h-5 mr-3" />
                  Users
                </button>
                <button
                  onClick={() => setActiveTab("gigs")}
                  className={`flex items-center w-full px-4 py-2 rounded-md text-left mb-1 ${
                    activeTab === "gigs" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  <PackageIcon className="w-5 h-5 mr-3" />
                  Gigs
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center w-full px-4 py-2 rounded-md text-left mb-1 ${
                    activeTab === "settings" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">{renderTabContent()}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Admin
