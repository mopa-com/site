import type React from "react"
import { checkAdminAccess } from "@/lib/admin-actions"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await checkAdminAccess()

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
