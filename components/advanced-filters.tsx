"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Star, ChevronDown, ChevronUp } from "lucide-react"

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

interface AdvancedFiltersProps {
  filters: Filters
  categories: any[]
  onFiltersChange: (filters: Filters) => void
  productCount: number
}

const colors = [
  { name: "Noir", value: "Noir", color: "#000000" },
  { name: "Blanc", value: "Blanc", color: "#FFFFFF" },
  { name: "Gris", value: "Gris", color: "#6B7280" },
  { name: "Bleu", value: "Bleu", color: "#3B82F6" },
  { name: "Rouge", value: "Rouge", color: "#EF4444" },
  { name: "Vert", value: "Vert", color: "#10B981" },
  { name: "Rose", value: "Rose", color: "#EC4899" },
  { name: "Jaune", value: "Jaune", color: "#F59E0B" },
]

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

export function AdvancedFilters({ filters, categories, onFiltersChange, productCount }: AdvancedFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 500])
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    colors: true,
    sizes: true,
    features: true,
    rating: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onFiltersChange({
      minPrice: value[0],
      maxPrice: value[1],
    })
  }

  const handleColorToggle = (color: string) => {
    const currentColors = filters.colors || []
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color]

    onFiltersChange({ colors: newColors })
  }

  const handleSizeToggle = (size: string) => {
    const currentSizes = filters.sizes || []
    const newSizes = currentSizes.includes(size) ? currentSizes.filter((s) => s !== size) : [...currentSizes, size]

    onFiltersChange({ sizes: newSizes })
  }

  const FilterSection = ({
    title,
    children,
    section,
  }: {
    title: string
    children: React.ReactNode
    section: keyof typeof expandedSections
  }) => (
    <div className="space-y-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-semibold"
      >
        {title}
        {expandedSections[section] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expandedSections[section] && children}
      <Separator />
    </div>
  )

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl border sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtres</h3>
        <Badge variant="secondary">{productCount} résultats</Badge>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Trier par</label>
        <Select value={filters.sort || "newest"} onValueChange={(value) => onFiltersChange({ sort: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récent</SelectItem>
            <SelectItem value="popularity">Popularité</SelectItem>
            <SelectItem value="rating">Mieux notés</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="name">Nom A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Category */}
      <FilterSection title="Catégorie" section="category">
        <div className="space-y-2">
          <button
            onClick={() => onFiltersChange({ category: undefined })}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              !filters.category ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onFiltersChange({ category: category.name })}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                filters.category === category.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Prix" section="price">
        <div className="space-y-4">
          <Slider value={priceRange} onValueChange={handlePriceChange} max={500} min={0} step={5} className="w-full" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]} €</span>
            <span>{priceRange[1]} €</span>
          </div>
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Couleurs" section="colors">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorToggle(color.value)}
              className={`relative w-12 h-12 rounded-lg border-2 transition-all ${
                filters.colors?.includes(color.value)
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name}
            >
              {color.color === "#FFFFFF" && <div className="absolute inset-1 border border-gray-200 rounded-md" />}
              {filters.colors?.includes(color.value) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${color.color === "#FFFFFF" ? "bg-black" : "bg-white"}`} />
                </div>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Tailles" section="sizes">
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                filters.sizes?.includes(size)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Caractéristiques" section="features">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock || false}
              onCheckedChange={(checked) => onFiltersChange({ inStock: checked as boolean })}
            />
            <label htmlFor="inStock" className="text-sm font-medium">
              En stock uniquement
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onSale"
              checked={filters.onSale || false}
              onCheckedChange={(checked) => onFiltersChange({ onSale: checked as boolean })}
            />
            <label htmlFor="onSale" className="text-sm font-medium">
              En promotion
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Note minimum" section="rating">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => onFiltersChange({ rating: filters.rating === rating ? undefined : rating })}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                filters.rating === rating ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm">et plus</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
