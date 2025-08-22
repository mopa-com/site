"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, TrendingUp, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchSuggestion {
  id: string
  name: string
  category: string
  price: number
  image_url: string
}

interface SearchHistory {
  query: string
  timestamp: number
}

const trendingSearches = ["Robe d'été", "Sneakers", "Sac à main", "Bijoux", "Parfum"]

export function SmartSearchBar() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("search-history")
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchSuggestions(debouncedQuery)
    } else {
      setSuggestions([])
      setIsLoading(false)
    }
  }, [debouncedQuery])

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchSuggestions = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from("products")
        .select("id, name, category, price, image_url")
        .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(6)

      setSuggestions(data || [])
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to search history
      const newHistory = [
        { query: searchQuery.trim(), timestamp: Date.now() },
        ...searchHistory.filter((h) => h.query !== searchQuery.trim()),
      ].slice(0, 5)

      setSearchHistory(newHistory)
      localStorage.setItem("search-history", JSON.stringify(newHistory))

      // Navigate to search results
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsOpen(false)
      setQuery("")
      inputRef.current?.blur()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    const totalItems = suggestions.length + trendingSearches.length + searchHistory.length

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % totalItems)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems)
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            const product = suggestions[selectedIndex]
            router.push(`/product/${product.id}`)
          } else if (selectedIndex < suggestions.length + searchHistory.length) {
            const historyIndex = selectedIndex - suggestions.length
            handleSearch(searchHistory[historyIndex].query)
          } else {
            const trendingIndex = selectedIndex - suggestions.length - searchHistory.length
            handleSearch(trendingSearches[trendingIndex])
          }
        } else {
          handleSearch(query)
        }
        break
      case "Escape":
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("search-history")
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder="Rechercher des produits, marques, catégories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setQuery("")
              setSuggestions([])
              inputRef.current?.focus()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto glass-effect"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Recherche en cours...
              </div>
            </div>
          )}

          {/* Product Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 flex items-center gap-2">
                <Search className="w-3 h-3" />
                Produits
              </div>
              {suggestions.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left ${
                    selectedIndex === index ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <span className="font-semibold">{product.price.toFixed(2)} €</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && !query && (
            <div className="p-2 border-t">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Recherches récentes
                </div>
                <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs h-6 px-2">
                  Effacer
                </Button>
              </div>
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item.query)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left ${
                    selectedIndex === suggestions.length + index ? "bg-muted/50" : ""
                  }`}
                >
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="flex-1 truncate">{item.query}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          {!query && (
            <div className="p-2 border-t">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Recherches populaires
              </div>
              {trendingSearches.map((trend, index) => (
                <button
                  key={trend}
                  onClick={() => handleSearch(trend)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left ${
                    selectedIndex === suggestions.length + searchHistory.length + index ? "bg-muted/50" : ""
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="flex-1">{trend}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query && !isLoading && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <div className="text-muted-foreground mb-2">Aucun résultat pour "{query}"</div>
              <Button variant="outline" size="sm" onClick={() => handleSearch(query)}>
                Rechercher quand même
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
