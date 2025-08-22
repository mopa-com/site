import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const supabase = createClient()
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Nouveau produit</h1>
        <p className="text-muted-foreground">Ajoutez un nouveau produit à votre catalogue</p>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  )
}
