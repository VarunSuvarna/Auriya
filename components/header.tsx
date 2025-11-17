"use client"

import { Search, Upload, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#15b9b7]/20 bg-[#001324]">
      <div className="flex h-16 items-center gap-2 md:gap-4 px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="flex-shrink-0 text-white hover:bg-[#15b9b7]/10 hover:text-[#15b9b7]"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-[#15b9b7]">
            <svg className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <span className="font-space-grotesk text-lg md:text-xl font-bold text-white">AlgoTunes</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search songs, artists, or tokens..."
              className="w-full pl-10 bg-[#001324] border-[#15b9b7]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#15b9b7]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 md:gap-2 border-[#15b9b7]/30 hover:bg-[#15b9b7]/10 hover:text-[#15b9b7] bg-transparent text-white px-2 md:px-3"
            asChild
          >
            <Link href="/upload">
              <Upload className="h-4 w-4" />
              <span className="hidden md:inline">Upload</span>
            </Link>
          </Button>

          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
