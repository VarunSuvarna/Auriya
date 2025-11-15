import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#001324]">
      {/* Fixed sidebar on the left - hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Main content area with responsive margin */}
      <div className="flex-1 md:ml-64">
        <div className="p-4 md:p-6 pt-20 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
