"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Search } from "lucide-react"

interface SearchResultsProps {
  query: string
  totalResults: number
  onClearSearch: () => void
}

export function SearchResults({ query, totalResults, onClearSearch }: SearchResultsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <span className="text-lg">Résultats pour</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            "{query}"
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearSearch} className="flex items-center gap-1">
          <X className="w-4 h-4" />
          Effacer la recherche
        </Button>
      </div>

      <div className="text-muted-foreground">
        {totalResults} produit{totalResults !== 1 ? "s" : ""} trouvé{totalResults !== 1 ? "s" : ""}
        {totalResults === 0 && (
          <span className="ml-2 text-sm">• Essayez des mots-clés différents ou vérifiez l'orthographe</span>
        )}
      </div>
    </div>
  )
}
