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
    <Card className="group overflow-hidden border-[#15b9b7]/10 bg-[#002a4a] transition-all hover:border-[#15b9b7]/30 hover:shadow-lg hover:shadow-[#15b9b7]/5">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={song.coverArt || "/placeholder.svg"}
            alt={song.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <Button
            size="icon"
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 opacity-0 transition-all group-hover:opacity-100"
          >
            <Play className="h-6 w-6 text-white ml-0.5 fill-white" />
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

        <div className="p-4">
          <Link href={`/coin/${song.id}`} className="block">
            <h3 className="font-semibold text-lg truncate text-white group-hover:text-[#15b9b7] transition-colors">
              {song.title}
            </h3>
            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
          </Link>

          <div className="mt-3 flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-gray-400">Market Cap</p>
              <p className="font-semibold text-white">${(song.marketCap / 1000).toFixed(1)}K</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Price</p>
              <p className="font-semibold text-[#15b9b7]">{song.price} ALGO</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span>{song.holders} holders</span>
            <span className="font-mono">{song.ticker}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
