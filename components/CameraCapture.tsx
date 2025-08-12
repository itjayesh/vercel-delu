"use client"

import React from "react"
import { useRef, useState } from "react"

interface CameraCaptureProps {
  onCapture: (file: File) => void
  trigger: React.ReactElement
  captureText?: string
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, trigger, captureText = "Take Photo" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onCapture(file)
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleTriggerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      {React.cloneElement(trigger, {
        onClick: handleTriggerClick,
        disabled: isCapturing,
      })}
    </>
  )
}

export { CameraCapture }
export default CameraCapture
