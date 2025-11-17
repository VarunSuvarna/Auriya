"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, Users, Activity } from "lucide-react"
import { useRealtime } from "@/hooks/useRealtime"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function CoinPage() {
  const { tokenPrices, activeListeners, addActivity } = useRealtime()
  const currentPrice = tokenPrices['1'] || 2.5
  const priceChange = ((currentPrice - 2.5) / 2.5) * 100
  const isPositive = priceChange > 0

  const handleBuyToken = () => {
    addActivity({
      type: 'purchase',
      songTitle: 'Music Token',
      artist: 'Various Artists',
      user: 'You'
    })
  }

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
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-[#15b9b7]" />
              <span className="text-white">{activeListeners} active traders</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-white">Live market data</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/10 to-[#15b9b7]/5 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Buy Tokens</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-[#15b9b7]/10">
                <span className="text-white">Current Price</span>
                <div className="text-right">
                  <span className={cn(
                    "font-bold text-lg",
                    currentPrice !== 2.5 ? "text-[#15b9b7] animate-pulse" : "text-[#15b9b7]"
                  )}>
                    {currentPrice.toFixed(3)} ALGO
                  </span>
                  <div className={cn(
                    "flex items-center gap-1 text-sm mt-1",
                    isPositive ? "text-green-400" : "text-red-400"
                  )}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{isPositive ? '+' : ''}{priceChange.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-white py-3"
                onClick={handleBuyToken}
              >
                Buy Now
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Price Chart</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {isPositive ? <TrendingUp className="h-5 w-5 text-green-400" /> : <TrendingDown className="h-5 w-5 text-red-400" />}
                <span className={isPositive ? "text-green-400" : "text-red-400"}>
                  {isPositive ? '+' : ''}{priceChange.toFixed(1)}% (24h)
                </span>
              </div>
              <div className="h-32 bg-[#15b9b7]/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#15b9b7]/20 to-transparent animate-shimmer"></div>
                <span className="text-gray-400 relative z-10">Live Chart Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}