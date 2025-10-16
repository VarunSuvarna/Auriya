"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <Providers>
      <div className="min-h-screen bg-[#001324] text-white">
        <Header onToggleSidebar={() => {}} />

        <div className="flex">
          {!isDashboard && <Sidebar />}

          <main
            className={cn(
              "flex-1 transition-all duration-300",
              !isDashboard && "ml-16"
            )}
          >
            {children}
          </main>
        </div>

        <MusicPlayer />
      </div>
    </Providers>
  )
}