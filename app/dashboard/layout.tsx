import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-64 pt-16">
        <div className="p-6 max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
