"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  category: string
  is_featured?: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        category: product.category,
      },
    })
  }

  return (
    <Card className="group card-hover border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={`/product/${product.id}`}>
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          {product.is_featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Tendance</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
            <Link href={`/product/${product.id}`}>
              <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{product.price.toFixed(2)} €</span>
            <Button size="sm" className="h-8" onClick={addToCart}>
              <ShoppingBag className="h-3 w-3 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
