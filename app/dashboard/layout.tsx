import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#001324]">
      {/* Fixed sidebar on the left */}
      <DashboardSidebar />
      
      {/* Main content area with left margin to accommodate sidebar */}
      <div className="flex-1 ml-64">
        <div className="p-6 pt-20 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
