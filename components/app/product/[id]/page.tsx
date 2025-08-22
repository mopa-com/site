"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/lib/cart-context"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Heart, Share2, Truck, RefreshCw, Star, Flame } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductReviews } from "@/components/product-reviews"
import { UrgencyCounter } from "@/components/urgency-counter"
import { PriceComparison } from "@/components/price-comparison"

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  image_url: string
  category: string
  stock_quantity: number
  is_featured: boolean
  sale_ends_at?: string
  colors?: string[]
  sizes?: string[]
  rating?: number
  review_count?: number
}

export default function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { dispatch } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()

      const { data: productData } = await supabase
        .from("products")
        .select("*, original_price, sale_ends_at, colors, sizes, rating, review_count")
        .eq("id", params.id)
        .single()

      if (!productData) {
        notFound()
      }

      const enhancedProduct = {
        ...productData,
        original_price: productData.original_price || productData.price * 1.3,
        sale_ends_at: productData.sale_ends_at || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        colors: productData.colors || ["Noir", "Blanc", "Gris"],
        sizes: productData.sizes || ["S", "M", "L", "XL"],
        rating: productData.rating || 4.5,
        review_count: productData.review_count || 127,
      }

      setProduct(enhancedProduct)
      setSelectedColor(enhancedProduct.colors[0])
      setSelectedSize(enhancedProduct.sizes[1])

      // Fetch related products
      const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .eq("category", productData.category)
        .neq("id", productData.id)
        .limit(4)

      setRelatedProducts(relatedData || [])

      const { data: recommendedData } = await supabase
        .from("products")
        .select("*")
        .neq("id", productData.id)
        .eq("is_featured", true)
        .limit(6)

      setRecommendedProducts(recommendedData || [])
      setLoading(false)
    }

    fetchProduct()
  }, [params.id])

  const addToCart = () => {
    if (product) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          category: product.category,
          selectedColor,
          selectedSize,
        },
      })
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // TODO: Implement wishlist API call
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="skeleton h-[600px] rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-6 w-1/2" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <ProductImageGallery
            images={[product.image_url, product.image_url, product.image_url, product.image_url]}
            productName={product.name}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{product.category}</Badge>
              {product.is_featured && (
                <Badge className="bg-gradient-to-r from-secondary to-accent">
                  <Flame className="w-3 h-3 mr-1" />
                  Tendance
                </Badge>
              )}
              {discountPercentage > 0 && <Badge variant="destructive">-{discountPercentage}%</Badge>}
            </div>

            <h1 className="text-4xl font-serif font-bold leading-tight">{product.name}</h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.review_count} avis)
              </span>
            </div>

            <PriceComparison
              currentPrice={product.price}
              originalPrice={product.original_price}
              discountPercentage={discountPercentage}
            />
          </div>

          {product.sale_ends_at && discountPercentage > 0 && (
            <UrgencyCounter endTime={product.sale_ends_at} stockQuantity={product.stock_quantity} />
          )}

          <div className="space-y-4">
            {/* Color Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Couleur: {selectedColor}</label>
              <div className="flex gap-2">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all interactive-scale ${
                      selectedColor === color
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Taille: {selectedSize}</label>
              <div className="flex gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 text-sm font-medium transition-all interactive-scale ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-2">
            {product.stock_quantity > 0 ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-sm text-green-600 font-medium">
                  En stock
                  {product.stock_quantity <= 5 && (
                    <span className="text-orange-600 ml-1">
                      (Plus que {product.stock_quantity} disponible{product.stock_quantity > 1 ? "s" : ""} !)
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <p className="text-sm text-red-600 font-medium">Rupture de stock</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 text-lg py-6 interactive-scale pulse-glow"
                disabled={product.stock_quantity === 0}
                onClick={addToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ajouter au panier • {product.price.toFixed(2)} €
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 py-6 interactive-scale bg-transparent"
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="lg" className="px-6 py-6 interactive-scale bg-transparent">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Button variant="outline" size="lg" className="w-full bg-transparent">
              Acheter maintenant
            </Button>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Livraison Express</p>
                  <p className="text-xs text-muted-foreground">Gratuite dès 50€</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Retours Faciles</p>
                  <p className="text-xs text-muted-foreground">30 jours gratuits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Caractéristiques</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({product.review_count})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Matériaux</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 95% Coton biologique</li>
                    <li>• 5% Élasthanne</li>
                    <li>• Certifié OEKO-TEX</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Entretien</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Lavage machine 30°C</li>
                    <li>• Séchage à l'air libre</li>
                    <li>• Repassage doux</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Détails du produit</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Référence:</span>
                    <span>MS-{product.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Catégorie:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Couleurs disponibles:</span>
                    <span>{product.colors?.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tailles disponibles:</span>
                    <span>{product.sizes?.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ProductReviews
              productId={product.id}
              rating={product.rating || 0}
              reviewCount={product.review_count || 0}
            />
          </TabsContent>
        </Tabs>
      </div>

      {recommendedProducts && recommendedProducts.length > 0 && (
        <section className="mt-20">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mb-2">
              Recommandations
            </Badge>
            <h2 className="text-3xl font-serif font-bold">Vous Aimerez Aussi</h2>
            <p className="text-muted-foreground">Sélectionnés spécialement pour vous</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-serif font-bold mb-8">Produits Similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
