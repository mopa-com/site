"use client"

import { useState } from "react"
import { Star, ThumbsUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ProductReviewsProps {
  productId: string
  rating: number
  reviewCount: number
}

const mockReviews = [
  {
    id: 1,
    author: "Marie L.",
    avatar: "/diverse-woman-avatar.png",
    rating: 5,
    date: "Il y a 2 jours",
    verified: true,
    comment: "Qualité exceptionnelle ! Le tissu est doux et la coupe parfaite. Je recommande vivement.",
    helpful: 12,
    images: ["/review-photo-1.png"],
  },
  {
    id: 2,
    author: "Thomas M.",
    avatar: "/man-avatar.png",
    rating: 4,
    date: "Il y a 1 semaine",
    verified: true,
    comment: "Très satisfait de mon achat. Livraison rapide et produit conforme à la description.",
    helpful: 8,
  },
  {
    id: 3,
    author: "Sophie D.",
    avatar: "/woman-avatar-2.png",
    rating: 5,
    date: "Il y a 2 semaines",
    verified: true,
    comment: "Parfait ! Exactement ce que je cherchais. La taille correspond bien au guide des tailles.",
    helpful: 15,
  },
]

const ratingDistribution = [
  { stars: 5, count: 89, percentage: 70 },
  { stars: 4, count: 25, percentage: 20 },
  { stars: 3, count: 8, percentage: 6 },
  { stars: 2, count: 3, percentage: 2 },
  { stars: 1, count: 2, percentage: 2 },
]

export function ProductReviews({ productId, rating, reviewCount }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("recent")

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{rating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">Basé sur {reviewCount} avis</div>
          </div>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm">{item.stars}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
              <Progress value={item.percentage} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        <Button variant={sortBy === "recent" ? "default" : "outline"} size="sm" onClick={() => setSortBy("recent")}>
          Plus récents
        </Button>
        <Button variant={sortBy === "helpful" ? "default" : "outline"} size="sm" onClick={() => setSortBy("helpful")}>
          Plus utiles
        </Button>
        <Button variant={sortBy === "rating" ? "default" : "outline"} size="sm" onClick={() => setSortBy("rating")}>
          Mieux notés
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{review.author}</span>
                  {review.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Achat vérifié
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>

                {review.images && (
                  <div className="flex gap-2">
                    {review.images.map((image, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Photo de ${review.author}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Utile ({review.helpful})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">Voir tous les avis ({reviewCount})</Button>
      </div>
    </div>
  )
}
