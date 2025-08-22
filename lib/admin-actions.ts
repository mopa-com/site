"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function checkAdminAccess() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return user
}

export async function createProduct(formData: FormData) {
  await checkAdminAccess()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const stock_quantity = Number.parseInt(formData.get("stock_quantity") as string)
  const is_featured = formData.get("is_featured") === "on"
  const image_url = formData.get("image_url") as string

  const supabase = createClient()

  const { error } = await supabase.from("products").insert({
    name,
    description,
    price,
    category,
    stock_quantity,
    is_featured,
    image_url: image_url || "/placeholder.svg?height=400&width=300",
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function updateProduct(id: string, formData: FormData) {
  await checkAdminAccess()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const stock_quantity = Number.parseInt(formData.get("stock_quantity") as string)
  const is_featured = formData.get("is_featured") === "on"
  const image_url = formData.get("image_url") as string

  const supabase = createClient()

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      category,
      stock_quantity,
      is_featured,
      image_url: image_url || "/placeholder.svg?height=400&width=300",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function deleteProduct(id: string) {
  await checkAdminAccess()

  const supabase = createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/products")
}

export async function createCategory(formData: FormData) {
  await checkAdminAccess()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const image_url = formData.get("image_url") as string

  const supabase = createClient()

  const { error } = await supabase.from("categories").insert({
    name,
    description,
    image_url: image_url || "/placeholder.svg?height=200&width=200",
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}
