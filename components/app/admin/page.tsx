import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Fetch statistics
  const [{ count: productsCount }, { count: ordersCount }, { count: usersCount }, { data: recentOrders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("user_profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("*, user_profiles(first_name, last_name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ])

  const stats = [
    {
      title: "Produits",
      value: productsCount || 0,
      icon: Package,
      description: "Produits en catalogue",
    },
    {
      title: "Commandes",
      value: ordersCount || 0,
      icon: ShoppingCart,
      description: "Commandes totales",
    },
    {
      title: "Utilisateurs",
      value: usersCount || 0,
      icon: Users,
      description: "Utilisateurs inscrits",
    },
    {
      title: "Revenus",
      value: "€0",
      icon: TrendingUp,
      description: "Revenus du mois",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre boutique</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Commande #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user_profiles?.first_name} {order.user_profiles?.last_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.total_amount.toFixed(2)} €</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune commande récente</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
