"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, Package, Award } from "lucide-react"

const stats = [
  { icon: Users, label: "Clients Satisfaits", value: 50000, suffix: "+" },
  { icon: Package, label: "Produits Vendus", value: 250000, suffix: "+" },
  { icon: TrendingUp, label: "Croissance Mensuelle", value: 25, suffix: "%" },
  { icon: Award, label: "Note Moyenne", value: 4.9, suffix: "/5" },
]

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats-section" className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4 scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">
                  {isVisible ? <CountUp end={stat.value} suffix={stat.suffix} /> : "0"}
                </div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = end / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [end])

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  )
}
