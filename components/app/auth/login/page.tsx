import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-serif font-bold">Connexion</h1>
          <p className="text-muted-foreground">Connectez-vous à votre compte minishop</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
