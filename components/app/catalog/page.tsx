"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ProductCard } from "@/components/product-card"
import { AdvancedFilters } from "@/components/advanced-filters"
import { SearchResults } from "@/components/search-results"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Grid3X3, List } from "lucide-react"

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
  colors?: string[]
  sizes?: string[]
  rating?: number
  review_count?: number
}

interface Filters {
  category?: string
  minPrice?: number
  maxPrice?: number
  colors?: string[]
  sizes?: string[]
  inStock?: boolean
  onSale?: boolean
  rating?: number
  sort?: string
  search?: string
}

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<Filters>({})

  useEffect(() => {
    const initialFilters: Filters = {
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || "newest",
    }
    setFilters(initialFilters)
  }, [searchParams])

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch products
      const { data: productsData } = await supabase.from("products").select("*")

      // Fetch categories
      const { data: categoriesData } = await supabase.from("categories").select("*")

      const enhancedProducts =
        productsData?.map((product) => ({
          ...product,
          original_price: product.price * 1.3,
          colors: ["Noir", "Blanc", "Gris", "Bleu"],
          sizes: ["XS", "S", "M", "L", "XL"],
          rating: 4 + Math.random(),
          review_count: Math.floor(Math.random() * 200) + 10,
        })) || []

      setProducts(enhancedProducts)
      setCategories(categoriesData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm),
      )
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((product) => product.category === filters.category)
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((product) => product.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((product) => product.price <= filters.maxPrice!)
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.stock_quantity > 0)
    }

    // Sale filter
    if (filters.onSale) {
      filtered = filtered.filter((product) => product.original_price && product.original_price > product.price)
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter((product) => (product.rating || 0) >= filters.rating!)
    }

    // Sorting
    switch (filters.sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "popularity":
        filtered.sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    }

    setFilteredProducts(filtered)
  }, [products, filters])

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({ sort: "newest" })
  }

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== undefined && value !== "" && value !== "newest" && (Array.isArray(value) ? value.length > 0 : true),
  ).length

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="skeleton h-64 rounded-lg" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 mb-8">
        {filters.search ? (
          <SearchResults
            query={filters.search}
            totalResults={filteredProducts.length}
            onClearSearch={() => handleFiltersChange({ search: undefined })}
          />
        ) : (
          <>
            <h1 className="text-4xl font-serif font-bold">
              {filters.category && filters.category !== "all" ? filters.category : "Catalogue"}
            </h1>
            <p className="text-xl text-muted-foreground">Découvrez notre sélection de produits de qualité</p>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Effacer les filtres
            </Button>
          )}

          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé
            {filteredProducts.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <AdvancedFilters
              filters={filters}
              categories={categories}
              onFiltersChange={handleFiltersChange}
              productCount={filteredProducts.length}
            />
          </div>
        )}

        <div className="flex-1">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="list" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-6">Essayez de modifier vos filtres ou votre recherche</p>
              <Button variant="outline" onClick={clearFilters}>
                Effacer tous les filtres
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
