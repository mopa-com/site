import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createProduct } from "@/lib/admin-actions"

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  product?: any
}

export function ProductForm({ categories, product }: ProductFormProps) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{product ? "Modifier le produit" : "Nouveau produit"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createProduct} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input id="name" name="name" required defaultValue={product?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€)</Label>
              <Input id="price" name="price" type="number" step="0.01" required defaultValue={product?.price} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={product?.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select name="category" defaultValue={product?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                required
                defaultValue={product?.stock_quantity || 0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL de l'image</Label>
            <Input id="image_url" name="image_url" type="url" defaultValue={product?.image_url} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="is_featured" name="is_featured" defaultChecked={product?.is_featured} />
            <Label htmlFor="is_featured">Produit en vedette</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit">{product ? "Mettre à jour" : "Créer le produit"}</Button>
            <Button type="button" variant="outline" asChild>
              <a href="/admin/products">Annuler</a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
