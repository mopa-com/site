import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Mail } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-3xl font-serif font-bold">Commande confirmée !</h1>
          <p className="text-muted-foreground">Merci pour votre achat. Votre commande a été traitée avec succès.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email de confirmation</p>
                <p className="text-sm text-muted-foreground">
                  Vous recevrez un email avec les détails de votre commande
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Préparation et expédition</p>
                <p className="text-sm text-muted-foreground">Votre commande sera expédiée sous 24-48h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/catalog">Continuer mes achats</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
