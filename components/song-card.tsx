"use client"

import { useState } from "react"
import { Play, Pause, TrendingUp, TrendingDown, Heart, MoreHorizontal, Share } from "lucide-react"
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
    audioUrl?: string
    price: number
    marketCap: number
    change24h: number
    holders: number
    ticker: string
  }
  onPlay?: (song: any) => void
}

export function SongCard({ song, onPlay }: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const isPositive = song.change24h > 0

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsPlaying(!isPlaying)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <Card 
      className="group overflow-hidden border-[#15b9b7]/10 bg-gradient-to-br from-[#002a4a] to-[#001a2a] transition-all duration-300 hover:border-[#15b9b7]/30 hover:shadow-2xl hover:shadow-[#15b9b7]/10 hover:scale-[1.02] max-w-xs mx-auto backdrop-blur-sm cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden max-h-48 md:max-h-none">
          <img
            src={song.coverArt || "/placeholder.svg"}
            alt={song.title}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              isHovered ? "scale-110 brightness-110" : "scale-100",
              isPlaying && "brightness-75"
            )}
          />
          
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )} />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-[#15b9b7]/20 to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )} />

          <Button
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (onPlay) {
                onPlay(song)
              } else {
                handlePlayPause(e)
              }
            }}
            className={cn(
              "absolute left-1/2 top-1/2 h-12 w-12 md:h-16 md:w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 transition-all duration-300 shadow-lg hover:shadow-xl",
              isHovered || isPlaying ? "opacity-100 scale-110" : "opacity-0 scale-100"
            )}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 md:h-7 md:w-7 text-white fill-white drop-shadow-lg" />
            ) : (
              <Play className="h-5 w-5 md:h-7 md:w-7 text-white ml-0.5 fill-white drop-shadow-lg" />
            )}
          </Button>

          <div className={cn(
            "absolute top-3 left-3 flex gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          )}>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              className={cn(
                "h-8 w-8 p-0 rounded-full backdrop-blur-sm transition-all duration-200",
                isLiked ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-black/20 text-white hover:bg-black/40"
              )}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            </Button>
          </div>

          <div
            className={cn(
              "absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold backdrop-blur transition-all duration-300",
              isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
              isHovered ? "scale-110" : "scale-100"
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(song.change24h).toFixed(1)}%
          </div>

          {isPlaying && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#15b9b7]/20 backdrop-blur rounded-full px-2 py-1">
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-[#15b9b7] rounded-full animate-pulse"
                    style={{
                      height: Math.random() * 8 + 4,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.8s'
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#15b9b7] font-medium">Playing</span>
            </div>
          )}
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
