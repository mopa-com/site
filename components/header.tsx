import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { UserMenu } from "@/components/auth/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { SmartSearchBar } from "@/components/smart-search-bar"
import { createClient } from "@/lib/supabase/server"

export async function Header() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold gradient-text">minishop</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
              Catalogue
            </Link>
            <Link
              href="/catalog?category=Vêtements"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Vêtements
            </Link>
            <Link
              href="/catalog?category=Accessoires"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Accessoires
            </Link>
            <Link
              href="/catalog?category=Chaussures"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Chaussures
            </Link>
            <Link href="/catalog?category=Beauté" className="text-sm font-medium hover:text-primary transition-colors">
              Beauté
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-lg mx-8">
            <SmartSearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">S'inscrire</Link>
                </Button>
              </div>
            )}
            <CartDrawer />
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
