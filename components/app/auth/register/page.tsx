import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/auth/register-form"

export default async function RegisterPage() {
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
          <h1 className="text-3xl font-serif font-bold">Créer un compte</h1>
          <p className="text-muted-foreground">Rejoignez la communauté minishop</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
