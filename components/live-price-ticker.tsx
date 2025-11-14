"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useRealtime } from "@/hooks/useRealtime"
import { cn } from "@/lib/utils"

const mockSongs = [
  { id: "1", title: "Chill Vibes", ticker: "CHILL", basePrice: 2.5 },
  { id: "2", title: "Electronic Dreams", ticker: "ELEC", basePrice: 1.8 },
  { id: "3", title: "Ocean Waves", ticker: "WAVE", basePrice: 3.2 },
  { id: "4", title: "Desert Mirage", ticker: "DSRT", basePrice: 1.5 },
  { id: "5", title: "Neon Nights", ticker: "NEON", basePrice: 2.9 }
]

export function LivePriceTicker() {
  const { tokenPrices } = useRealtime()

  return (
    <div className="bg-[#001324] border-y border-[#15b9b7]/20 py-2 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {mockSongs.map((song) => {
          const currentPrice = tokenPrices[song.id] || song.basePrice
          const priceChange = ((currentPrice - song.basePrice) / song.basePrice) * 100
          const isPositive = priceChange > 0

          return (
            <div key={song.id} className="flex items-center gap-2 mx-6 text-sm">
              <span className="text-[#15b9b7] font-medium">{song.ticker}</span>
              <span className="text-white font-mono">
                {currentPrice.toFixed(3)} ALGO
              </span>
              <div className={cn(
                "flex items-center gap-1",
                isPositive ? "text-green-400" : "text-red-400"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-mono text-xs">
                  {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
          )
        })}
        {/* Duplicate for seamless loop */}
        {mockSongs.map((song) => {
          const currentPrice = tokenPrices[song.id] || song.basePrice
          const priceChange = ((currentPrice - song.basePrice) / song.basePrice) * 100
          const isPositive = priceChange > 0

          return (
            <div key={`${song.id}-dup`} className="flex items-center gap-2 mx-6 text-sm">
              <span className="text-[#15b9b7] font-medium">{song.ticker}</span>
              <span className="text-white font-mono">
                {currentPrice.toFixed(3)} ALGO
              </span>
              <div className={cn(
                "flex items-center gap-1",
                isPositive ? "text-green-400" : "text-red-400"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-mono text-xs">
                  {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}