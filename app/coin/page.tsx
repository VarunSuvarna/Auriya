"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function CoinPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2 text-[#15b9b7] hover:text-white hover:bg-[#15b9b7]/10">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-space-grotesk mb-4 text-white">Token Trading</h1>
          <p className="text-gray-400">Buy and trade music tokens on Auriya</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/10 to-[#15b9b7]/5 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Buy Tokens</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-[#15b9b7]/10">
                <span className="text-white">Current Price</span>
                <span className="text-[#15b9b7] font-bold">2.5 ALGO</span>
              </div>
              <Button className="w-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-white py-3">
                Buy Now
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Price Chart</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="text-green-400">+15.3% (24h)</span>
              </div>
              <div className="h-32 bg-[#15b9b7]/10 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Chart Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}