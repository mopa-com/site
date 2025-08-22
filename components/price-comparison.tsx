import { Badge } from "@/components/ui/badge"

interface PriceComparisonProps {
  currentPrice: number
  originalPrice?: number
  discountPercentage: number
}

export function PriceComparison({ currentPrice, originalPrice, discountPercentage }: PriceComparisonProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="text-3xl font-bold text-primary">{currentPrice.toFixed(2)} €</div>

      {originalPrice && discountPercentage > 0 && (
        <>
          <div className="text-xl text-muted-foreground line-through">{originalPrice.toFixed(2)} €</div>
          <Badge variant="destructive" className="text-sm font-semibold">
            -{discountPercentage}%
          </Badge>
          <div className="text-sm text-green-600 font-medium">
            Vous économisez {(originalPrice - currentPrice).toFixed(2)} €
          </div>
        </>
      )}
    </div>
  )
}
