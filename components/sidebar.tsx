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
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed lg:relative inset-y-0 left-0 z-40 flex flex-col border-r border-[#15b9b7]/20 bg-[#001324] transition-all duration-300 ease-in-out",
        // Use a min-width for collapsed state on large screens
        isOpen
          ? "w-64"
          : "w-0 lg:w-16 min-w-[56px] lg:min-w-[56px] translate-x-0 lg:translate-x-0",
      )}
    >
      <nav className="flex-1 space-y-1 p-4 overflow-hidden">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "bg-[#15b9b7]/20 text-[#15b9b7]"
                  : "text-white hover:bg-[#15b9b7]/10 hover:text-[#15b9b7]",
                !isOpen && "justify-center lg:justify-start"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "transition-opacity ml-2",
                  isOpen ? "opacity-100" : "opacity-0 lg:opacity-0",
                )}
                // Use aria-hidden so collapsed text is not read by screen readers
                aria-hidden={!isOpen}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
 