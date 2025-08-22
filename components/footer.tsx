import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold">minishop</h3>
            <p className="text-sm text-muted-foreground">Mode moderne et accessible pour tous les styles.</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Boutique</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/catalog" className="hover:text-foreground transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Vêtements" className="hover:text-foreground transition-colors">
                  Vêtements
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Accessoires" className="hover:text-foreground transition-colors">
                  Accessoires
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Chaussures" className="hover:text-foreground transition-colors">
                  Chaussures
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground transition-colors">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground transition-colors">
                  Retours
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 minishop. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
