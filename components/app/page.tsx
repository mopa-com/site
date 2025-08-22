import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Truck, Shield, RefreshCw, Star, Zap, Gift, TrendingUp } from "lucide-react"
import { PromoSlider } from "@/components/promo-slider"
import { TestimonialSection } from "@/components/testimonial-section"
import { StatsSection } from "@/components/stats-section"

export default async function HomePage() {
  const supabase = createClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase.from("products").select("*").eq("is_featured", true).limit(8)

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").limit(6)

  // Fetch new arrivals
  const { data: newArrivals } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen">
      {/* Advanced Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5" />
        <div className="absolute inset-0 bg-[url('/modern-fashion-hero.png')] bg-cover bg-center opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4 slide-up">
              <Badge variant="secondary" className="mb-4 pulse-glow">
                <Zap className="w-3 h-3 mr-1" />
                Nouvelle Collection 2024
              </Badge>
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight gradient-text">
                Mode Ultra-Moderne
                <span className="block text-foreground/80 mt-2">& Style Intemporel</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Découvrez notre collection exclusive de vêtements, accessoires et produits de beauté qui redéfinissent
                l'élégance contemporaine avec des designs avant-gardistes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center scale-in">
              <Button size="lg" className="text-lg px-8 py-4 interactive-scale pulse-glow" asChild>
                <Link href="/catalog">
                  <Gift className="mr-2 h-5 w-5" />
                  Explorer la Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 glass-effect bg-transparent" asChild>
                <Link href="#trending">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Voir les Tendances
                </Link>
              </Button>
            </div>

            <div className="flex justify-center items-center gap-8 mt-12 fade-in">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">50K+</div>
                <div className="text-sm text-muted-foreground">Clients Satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1000+</div>
                <div className="text-sm text-muted-foreground">Produits Exclusifs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">4.9</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  Note Moyenne
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl floating" />
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl floating"
          style={{ animationDelay: "1s" }}
        />
      </section>

      {/* Promotional Slider */}
      <PromoSlider />

      {/* Enhanced Features */}
      <section className="py-20 border-b bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 card-hover p-6 rounded-xl bg-background/50 glass-effect">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto pulse-glow">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Livraison Express</h3>
              <p className="text-muted-foreground">Livraison gratuite dès 50€ • Express 24h disponible</p>
            </div>
            <div className="text-center space-y-4 card-hover p-6 rounded-xl bg-background/50 glass-effect">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto pulse-glow">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Retours Simplifiés</h3>
              <p className="text-muted-foreground">30 jours pour changer d'avis • Retour gratuit</p>
            </div>
            <div className="text-center space-y-4 card-hover p-6 rounded-xl bg-background/50 glass-effect">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto pulse-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Paiement Ultra-Sécurisé</h3>
              <p className="text-muted-foreground">Cryptage SSL • Paiement en 3x sans frais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16 slide-up">
            <Badge variant="outline" className="mb-2">
              Collections
            </Badge>
            <h2 className="text-4xl font-serif font-bold">Nos Univers Mode</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explorez nos collections soigneusement sélectionnées pour chaque style et occasion
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories?.map((category, index) => (
              <Link key={category.id} href={`/catalog?category=${category.name}`} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 aspect-[4/5] card-hover">
                  <div className="absolute inset-0 bg-[url('/fashion-category.png')] bg-cover bg-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-secondary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-80">Découvrir la collection</p>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      Nouveau
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Horizontal Scroll */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                Nouveautés
              </Badge>
              <h2 className="text-4xl font-serif font-bold">Dernières Arrivées</h2>
              <p className="text-muted-foreground">Les pièces qui font sensation cette semaine</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex bg-transparent">
              <Link href="/catalog?sort=newest">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {newArrivals?.map((product) => (
              <div key={product.id} className="flex-none w-72">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="trending" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16 slide-up">
            <Badge variant="outline" className="mb-2">
              Sélection
            </Badge>
            <h2 className="text-4xl font-serif font-bold">Produits Coup de Cœur</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Notre équipe de stylistes a sélectionné ces pièces exceptionnelles pour vous
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Button size="lg" className="px-8 py-4 interactive-scale" asChild>
              <Link href="/catalog">
                Découvrir Toute la Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials */}
      <TestimonialSection />
    </div>
  )
}
