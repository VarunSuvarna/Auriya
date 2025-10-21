"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, ShoppingBag, Library, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "My Library", href: "/library", icon: Library },
  { name: "Creator Dashboard", href: "/dashboard", icon: LayoutDashboard },
]

interface SidebarProps {
  isOpen?: boolean
}

export function Sidebar({ isOpen = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col border-r border-[#15b9b7]/20 bg-[#001324] transition-all duration-300 group",
        // Always show icons on desktop, full sidebar when open
        isOpen ? "w-64" : "w-16 hover:w-64"
      )}
    >
      <nav className="flex-1 flex flex-col gap-1 p-2 mt-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 transition-colors group relative",
                isActive 
                  ? "bg-[#15b9b7]/20 text-[#15b9b7]" 
                  : "text-gray-400 hover:bg-[#15b9b7]/10 hover:text-white"
              )}
              title={!isOpen ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={cn(
                "text-sm font-medium whitespace-nowrap transition-opacity duration-300",
                isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
