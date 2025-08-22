import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Marie Dubois",
    avatar: "/diverse-woman-avatar.png",
    rating: 5,
    comment:
      "Qualité exceptionnelle et livraison ultra-rapide ! Je recommande vivement minishop pour leur service client irréprochable.",
    product: "Robe d'été fleurie",
  },
  {
    id: 2,
    name: "Thomas Martin",
    avatar: "/man-avatar.png",
    rating: 5,
    comment:
      "Design moderne et matériaux premium. Exactement ce que je cherchais pour renouveler ma garde-robe professionnelle.",
    product: "Costume slim fit",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    avatar: "/woman-avatar-2.png",
    rating: 5,
    comment:
      "Interface intuitive et produits de qualité. L'expérience d'achat est vraiment agréable du début à la fin.",
    product: "Sac à main cuir",
  },
]

export function TestimonialSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6 mb-16 slide-up">
          <h2 className="text-4xl font-serif font-bold">Ce Que Disent Nos Clients</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plus de 50 000 clients nous font confiance pour leur style au quotidien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="card-hover glass-effect border-0 bg-background/50"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-muted-foreground italic leading-relaxed">"{testimonial.comment}"</p>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">A acheté : {testimonial.product}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
