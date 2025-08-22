import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { Package } from "lucide-react" // Import the Package component

export default async function AdminProductsPage() {
  const supabase = createClient()
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold">Gestion des produits</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de produits</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {product.is_featured && <Badge className="absolute top-2 left-2">Tendance</Badge>}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{product.price.toFixed(2)} €</span>
                  <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Link>
                  </Button>
                  <DeleteProductButton productId={product.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!products ||
        (products.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit</h3>
              <p className="text-muted-foreground mb-4">Commencez par ajouter votre premier produit</p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau produit
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
