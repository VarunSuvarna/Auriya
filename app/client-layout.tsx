"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { cn } from "@/lib/utils"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#001324] text-white">
      {/* Header - shows on all pages */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Main Sidebar - ONLY show on non-dashboard pages */}
        {!isDashboard && <Sidebar isOpen={sidebarOpen} />}

        {/* Main content area */}
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            !isDashboard && (sidebarOpen ? "ml-64" : "ml-16")
          )}
        >
          {children}
        </main>
      </div>

      {/* Music Player - shows on all pages */}
      <MusicPlayer />
    </div>
  )
}