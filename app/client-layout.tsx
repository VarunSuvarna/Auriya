"use client"

import type React from "react"
import { Providers } from "@/components/providers"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { useState } from "react"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Providers>
      <div className="flex h-screen flex-col overflow-hidden bg-[#001324]">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} />
          <main className="flex-1 overflow-y-auto pb-24 bg-[#001324]">{children}</main>
        </div>
        <MusicPlayer />
      </div>
    </Providers>
  )
}
