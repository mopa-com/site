import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import { OrderStatusSelect } from "@/components/admin/order-status-select"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "En attente",
  processing: "En cours",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

export default async function AdminOrdersPage() {
  const supabase = createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      user_profiles (first_name, last_name),
      order_items (
        *,
        products (name)
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Gestion des commandes</h1>
        <p className="text-muted-foreground">Gérez toutes les commandes de votre boutique</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold">Commande #{order.id.slice(0, 8)}</h3>
                      <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.user_profiles?.first_name} {order.user_profiles?.last_name} •{" "}
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_items.length} produit{order.order_items.length > 1 ? "s" : ""} •{" "}
                      {order.total_amount.toFixed(2)} €
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
            <p className="text-muted-foreground">Les commandes apparaîtront ici une fois passées</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
