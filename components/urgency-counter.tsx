"use client"

import { useState, useEffect } from "react"
import { Clock, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface UrgencyCounterProps {
  endTime: string
  stockQuantity: number
}

export function UrgencyCounter({ endTime, stockQuantity }: UrgencyCounterProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
  }>({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const difference = end - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-800">
      <div className="flex items-center gap-2 mb-2">
        <Flame className="w-4 h-4 text-red-500" />
        <span className="text-sm font-semibold text-red-700 dark:text-red-400">Offre limitée !</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-600 dark:text-red-400">Se termine dans :</span>
        </div>

        <div className="flex gap-1">
          <Badge variant="destructive" className="font-mono">
            {String(timeLeft.hours).padStart(2, "0")}h
          </Badge>
          <Badge variant="destructive" className="font-mono">
            {String(timeLeft.minutes).padStart(2, "0")}m
          </Badge>
          <Badge variant="destructive" className="font-mono">
            {String(timeLeft.seconds).padStart(2, "0")}s
          </Badge>
        </div>
      </div>

      {stockQuantity <= 10 && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">⚡ Plus que {stockQuantity} en stock !</p>
      )}
    </div>
  )
}
