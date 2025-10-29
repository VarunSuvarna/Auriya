"use client"

import { Play, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SongCardProps {
  song: {
    id: string
    title: string
    artist: string
    coverArt: string
    price: number
    marketCap: number
    change24h: number
    holders: number
    ticker: string
  }
}

export function SongCard({ song }: SongCardProps) {
  const isPositive = song.change24h > 0

  return (
    <Card className="group overflow-hidden border-[#15b9b7]/10 bg-gradient-to-br from-[#002a4a] to-[#001a2a] transition-all duration-300 hover:border-[#15b9b7]/30 hover:shadow-2xl hover:shadow-[#15b9b7]/10 hover:scale-[1.02] max-w-xs mx-auto backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden max-h-48 md:max-h-none">
          <img
            src={song.coverArt || "/placeholder.svg"}
            alt={song.title}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#15b9b7]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <Button
            size="icon"
            className="absolute left-1/2 top-1/2 h-10 w-10 md:h-14 md:w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 shadow-lg hover:shadow-xl"
          >
            <Play className="h-4 w-4 md:h-6 md:w-6 text-white ml-0.5 fill-white drop-shadow-lg" />
          </Button>

          <div
            className={cn(
              "absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold backdrop-blur",
              isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(song.change24h).toFixed(1)}%
          </div>
        </div>

        <div className="p-3 md:p-4 relative">
          <Link href={`/coin/${song.id}`} className="block group/link">
            <h3 className="font-semibold text-base md:text-lg truncate text-white group-hover:text-[#15b9b7] transition-all duration-200 group-hover:translate-x-1">
              {song.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-200">{song.artist}</p>
          </Link>

          <div className="mt-2 md:mt-3 flex items-center justify-between text-xs md:text-sm">
            <div className="group/stat">
              <p className="text-xs text-gray-400 group-hover/stat:text-gray-300 transition-colors">Market Cap</p>
              <p className="font-semibold text-white group-hover/stat:text-[#15b9b7] transition-colors">${(song.marketCap / 1000).toFixed(1)}K</p>
            </div>
            <div className="text-right group/stat">
              <p className="text-xs text-gray-400 group-hover/stat:text-gray-300 transition-colors">Price</p>
              <p className="font-semibold text-[#15b9b7] group-hover/stat:text-white transition-colors">{song.price} ALGO</p>
            </div>
          </div>

          <div className="mt-2 md:mt-3 flex items-center justify-between text-xs text-gray-400">
            <span className="group-hover:text-gray-300 transition-colors">{song.holders} holders</span>
            <span className="font-mono bg-[#15b9b7]/10 px-2 py-1 rounded-full text-[#15b9b7] group-hover:bg-[#15b9b7]/20 transition-colors">{song.ticker}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
