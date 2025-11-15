"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Library,
  Users,
  Settings,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "My Library", href: "/library", icon: Library },
  { name: "Profile", href: "/dashboard/profile", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a1929] border-r border-[#15b9b7]/20 flex flex-col z-30 overflow-y-auto">
      {/* Logo/Header space */}
      <div className="h-16 flex items-center px-4 border-b border-[#15b9b7]/20">
        <h2 className="text-lg font-semibold text-white">Creator Dashboard</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#15b9b7]/20 text-[#15b9b7]"
                  : "text-gray-300 hover:bg-[#15b9b7]/10 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Disconnect button at bottom */}
      <div className="p-4 border-t border-[#15b9b7]/20 mt-auto">
        <button
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full"
          onClick={() => {
            // Add your disconnect wallet logic here
            console.log("Disconnect wallet")
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Disconnect</span>
        </button>
      </div>
    </aside>
  )
}
