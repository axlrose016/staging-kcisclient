"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw } from "lucide-react"

export default function Captcha({verified}:{verified: (isValid: boolean) => void}) {
  const [captchaText, setCaptchaText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateCaptcha = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    let result = ""
    const charactersLength = characters.length
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    setCaptchaText(result)
    setUserInput("")
    setIsValid(null)
    return result
  }

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add noise (dots)
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add lines for distortion
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }

    // Draw text
    const textColors = ["#333333", "#444444", "#555555", "#666666", "#777777"]
    const fonts = ["Arial", "Verdana", "Helvetica", "Tahoma", "Trebuchet MS"]

    // Draw each character with different styles
    for (let i = 0; i < text.length; i++) {
      const x = 20 + i * 25 + Math.random() * 5
      const y = 30 + Math.random() * 10
      const angle = Math.random() * 0.4 - 0.2
      const fontSize = 24 + Math.random() * 8

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.font = `bold ${fontSize}px ${fonts[Math.floor(Math.random() * fonts.length)]}`
      ctx.fillStyle = textColors[Math.floor(Math.random() * textColors.length)]
      ctx.fillText(text[i], 0, 0)
      ctx.restore()
    }
  }

  const verifyCaptcha = () => {
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      setIsValid(true)
      verified(true)
    } else {
      setIsValid(false)
      verified(false)
    }
  }

  useEffect(() => {
    if(userInput.length > 0) {
      verifyCaptcha();
    }
  }, [userInput])

  useEffect(() => {
    const text = generateCaptcha()
    drawCaptcha(text)
  }, [])

  useEffect(() => {
    if (captchaText) {
      drawCaptcha(captchaText)
    }
  }, [captchaText])

  return (
    <div className="max-w-md mx-auto bg-white">
      <p className="text-sm text-gray-500 mb-4">Please enter the characters you see in the image below</p>
      <div className="mb-4 relative">
        <canvas ref={canvasRef} width={200} height={60} className="border border-gray-200 rounded-md w-full" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-8 w-8"
          onClick={() => generateCaptcha()}
          aria-label="Refresh captcha"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter the captcha text"
            className="w-full lowercase"
            maxLength={6}
          />
        </div>
{/* 
        <Button onClick={verifyCaptcha} className="w-full">
          Verify
        </Button> */}

        {isValid !== null && (
          <div
            className={`mt-2 p-2 text-center rounded ${
              isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isValid ? "Correct! Verification successful." : "Incorrect. Please try again."}
          </div>
        )}
      </div>
    </div>
  )
}

