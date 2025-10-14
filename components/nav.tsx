"use client"

import Link from "next/link"
import { ConnectWalletButton } from "./connect-wallet-button"
import { ThemeToggle } from "./theme-toggle"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Nav() {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <motion.nav
      className="flex justify-between items-center p-4 border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50 w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="relative w-8 h-8 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </div>
        <motion.h1
          className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          AlgoKYC
        </motion.h1>
      </Link>

      {!isDashboard && (
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/about" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            About
          </Link>
        </div>
      )}

      <div className="flex items-center">
        <ThemeToggle />
        {!isDashboard && <ConnectWalletButton />}
      </div>
    </motion.nav>
  )
}
