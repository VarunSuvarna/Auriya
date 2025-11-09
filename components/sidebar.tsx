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
        "fixed lg:sticky top-0 left-0 min-h-screen z-40 flex flex-col border-r border-[#15b9b7]/20 bg-[#001324] transition-all duration-300 group backdrop-blur-sm",
        "hover:shadow-2xl hover:shadow-[#15b9b7]/5",
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
                "flex items-center gap-3 rounded-lg p-3 transition-all duration-300 group/link relative overflow-hidden",
                isActive 
                  ? "bg-[#15b9b7]/20 text-[#15b9b7] shadow-lg" 
                  : "text-gray-400 hover:bg-[#15b9b7]/10 hover:text-white hover:scale-105 hover:shadow-md"
              )}
              title={!isOpen ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#15b9b7] rounded-r-full" />
              )}
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-all duration-300",
                isActive ? "scale-110" : "group-hover/link:scale-110"
              )} />
              <span className={cn(
                "text-sm font-medium whitespace-nowrap transition-all duration-300",
                isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                "group-hover/link:translate-x-1"
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
