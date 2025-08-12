"use client"

import type React from "react"
import {
  ReactFrameworkIcon,
  NextjsIcon,
  VueIcon,
  AngularIcon,
  SvelteIcon,
  NuxtIcon,
  JavaScriptIcon,
} from "../components/icons"

export const ProjectSetup: React.FC = () => {
  const frameworks = [
    {
      name: "React",
      icon: ReactFrameworkIcon,
      description: "A JavaScript library for building user interfaces",
      command: "npx create-react-app my-app",
      color: "text-blue-500",
    },
    {
      name: "Next.js",
      icon: NextjsIcon,
      description: "The React framework for production",
      command: "npx create-next-app@latest my-app",
      color: "text-black",
    },
    {
      name: "Vue.js",
      icon: VueIcon,
      description: "The progressive JavaScript framework",
      command: "npm create vue@latest my-app",
      color: "text-green-500",
    },
    {
      name: "Angular",
      icon: AngularIcon,
      description: "Platform for building mobile and desktop web applications",
      command: "ng new my-app",
      color: "text-red-500",
    },
    {
      name: "Svelte",
      icon: SvelteIcon,
      description: "Cybernetically enhanced web apps",
      command: "npm create svelte@latest my-app",
      color: "text-orange-500",
    },
    {
      name: "Nuxt.js",
      icon: NuxtIcon,
      description: "The intuitive Vue framework",
      command: "npx nuxi@latest init my-app",
      color: "text-green-600",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Web Platform Setup</h1>
        <p className="text-gray-600">Choose your preferred framework to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frameworks.map((framework) => {
          const IconComponent = framework.icon
          return (
            <div key={framework.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <IconComponent className={`w-8 h-8 ${framework.color} mr-3`} />
                <h3 className="text-xl font-semibold text-gray-900">{framework.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{framework.description}</p>
              <div className="bg-gray-100 rounded-md p-3">
                <code className="text-sm text-gray-800">{framework.command}</code>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <JavaScriptIcon className="w-8 h-8 text-yellow-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Getting Started</h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">1. Choose Your Framework</h3>
            <p className="text-gray-600">Select the framework that best fits your project needs and team expertise.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">2. Set Up Your Environment</h3>
            <p className="text-gray-600">
              Make sure you have Node.js installed, then run the setup command for your chosen framework.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">3. Start Building</h3>
            <p className="text-gray-600">Follow the framework's documentation to start building your application.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
