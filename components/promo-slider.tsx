"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, Flame } from "lucide-react"
import Link from "next/link"

const promos = [
  {
    id: 1,
    title: "Flash Sale 48h",
    description: "Jusqu'à -70% sur une sélection mode",
    cta: "J'en profite",
    link: "/catalog?sale=true",
    urgency: "Plus que 2h",
    background: "bg-gradient-to-r from-red-500 to-pink-500",
  },
  {
    id: 2,
    title: "Nouvelle Collection",
    description: "Découvrez les tendances automne-hiver",
    cta: "Découvrir",
    link: "/catalog?collection=new",
    badge: "Nouveau",
    background: "bg-gradient-to-r from-blue-500 to-purple-500",
  },
  {
    id: 3,
    title: "Livraison Gratuite",
    description: "Sur toutes vos commandes dès 30€",
    cta: "Commander",
    link: "/catalog",
    badge: "Offre limitée",
    background: "bg-gradient-to-r from-green-500 to-teal-500",
  },
]

export function PromoSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promos.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % promos.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + promos.length) % promos.length)

  return (
    <section className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {promos.map((promo) => (
          <div key={promo.id} className={`w-full flex-shrink-0 ${promo.background} text-white py-16`}>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                  {promo.urgency && (
                    <Badge variant="destructive" className="bg-white/20 text-white border-white/30 pulse-glow">
                      <Clock className="w-3 h-3 mr-1" />
                      {promo.urgency}
                    </Badge>
                  )}
                  {promo.badge && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <Flame className="w-3 h-3 mr-1" />
                      {promo.badge}
                    </Badge>
                  )}
                </div>

                <h2 className="text-4xl md:text-6xl font-bold mb-4">{promo.title}</h2>
                <p className="text-xl opacity-90 mb-8">{promo.description}</p>

                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-white/90 interactive-scale"
                  asChild
                >
                  <Link href={promo.link}>{promo.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {promos.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? "bg-white w-8" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}
