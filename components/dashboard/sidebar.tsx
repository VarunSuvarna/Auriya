"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, FileText, CheckCircle, Plus, Home, User, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useWallet } from "@txnlab/use-wallet-react"
import { toast } from "react-toastify"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { activeAccount, wallets } = useWallet()

  const disconnectWallets = async () => {
    try {
      for (const wallet of wallets) {
        if (wallet.isConnected) {
          await wallet.disconnect()
        }
      }
      toast.success("Disconnected from all wallets")
    } catch (error) {
      console.error(error)
      toast.error("Failed to disconnect wallets")
    }
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      exact: true,
    },
    {
      title: "KYC Status",
      href: "/dashboard/status",
      icon: Clock,
    },
    {
      title: "Verification History",
      href: "/dashboard/history",
      icon: CheckCircle,
    },
    {
      title: "Fill KYC",
      href: "/dashboard/fill-kyc",
      icon: FileText,
    },
    {
      title: "New KYC",
      href: "/dashboard/fill-kyc?new=true",
      icon: Plus,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <motion.div
      className="h-screen w-64 bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-r fixed left-0 top-0 z-40 pt-16 overflow-y-auto"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-4">
        {activeAccount && (
          <div className="mb-6 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
            <p className="text-sm font-mono truncate">
              {activeAccount.address.slice(0, 10)}...{activeAccount.address.slice(-4)}
            </p>
          </div>
        )}

        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 font-normal",
                    isActive && "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-primary font-medium",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-normal text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-6"
            onClick={disconnectWallets}
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
