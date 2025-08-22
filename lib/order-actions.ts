"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface OrderData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
}

export async function createOrder(orderData: OrderData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User must be authenticated to create an order")
  }

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: orderData.total,
      status: "pending",
      shipping_address: {
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        address: orderData.address,
        city: orderData.city,
        postalCode: orderData.postalCode,
        country: orderData.country,
        email: orderData.email,
      },
    })
    .select()
    .single()

  if (orderError) {
    throw new Error(orderError.message)
  }

  // Create order items
  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    throw new Error(itemsError.message)
  }

  // Update product stock
  for (const item of orderData.items) {
    await supabase.rpc("decrement_stock", {
      product_id: item.id,
      quantity: item.quantity,
    })
  }

  return order
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/orders")
  revalidatePath("/orders")
}
