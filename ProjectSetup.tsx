"use client"

import React, { useState } from "react"
import { Header } from "./components/Header"
import { Button } from "./components/Button"

export function ProjectSetup() {
  const [step, setStep] = useState(1)
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleNext = () => {
    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // In a real app, validate the credentials
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store the credentials (in a real app, use environment variables)
      localStorage.setItem("SUPABASE_URL", supabaseUrl)
      localStorage.setItem("SUPABASE_ANON_KEY", supabaseKey)

      setSuccess("Project setup completed successfully!")
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch (err) {
      setError("Failed to set up project. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Project Setup</h1>

          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= stepNumber ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? "bg-blue-500" : "bg-gray-200"}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs">Supabase Setup</span>
              <span className="text-xs">Configuration</span>
              <span className="text-xs">Finish</span>
            </div>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Supabase Setup</h2>
              <ol className="list-decimal list-inside space-y-4 mb-6">
                <li>
                  Create a new Supabase project at{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    supabase.com
                  </a>
                </li>
                <li>Once your project is created, go to the project dashboard</li>
                <li>Navigate to the "Settings" section and then "API"</li>
                <li>Copy your project URL and anon/public key</li>
              </ol>
              <div className="flex justify-end">
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Configuration</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supabaseUrl">
                    Supabase URL
                  </label>
                  <input
                    id="supabaseUrl"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supabaseKey">
                    Supabase Anon Key
                  </label>
                  <input
                    id="supabaseKey"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Finish Setup</h2>
              <p className="mb-6">
                You're almost done! Click the button below to complete the setup process and initialize your Deluv0
                project with Supabase.
              </p>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading || !supabaseUrl || !supabaseKey}>
                  {isLoading ? "Setting up..." : "Complete Setup"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ProjectSetup
