"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Heart, Share, TrendingUp, TrendingDown, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRealtime } from "@/hooks/useRealtime"

const mockSongs = [
  {
    id: "1",
    title: "Chill Vibes",
    artist: "Lo-Fi Dreams",
    coverArt: "/abstract-music-album-cover-purple.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    price: 2.5,
    marketCap: 125000,
    change24h: 15.3,
    holders: 234,
    ticker: "CHILL",
    duration: "4:15",
    genre: "Lo-Fi",
    description: "A smooth lo-fi track perfect for studying or relaxing. Features dreamy synths and laid-back beats."
  },
  {
    id: "2",
    title: "Electronic Dreams",
    artist: "Synth Master",
    coverArt: "/electronic-music-cover-cyan.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3",
    price: 1.8,
    marketCap: 89000,
    change24h: -5.2,
    holders: 189,
    ticker: "ELEC",
    duration: "3:30",
    genre: "Electronic",
    description: "Futuristic electronic soundscape with pulsing basslines and ethereal melodies."
  }
]

export default function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { tokenPrices, playCounts, addActivity } = useRealtime()
  const song = mockSongs.find(s => s.id === id) || mockSongs[0]
  
  const currentPrice = tokenPrices[song.id] || song.price
  const priceChange = ((currentPrice - song.price) / song.price) * 100
  const isPositive = priceChange > 0
  const currentPlayCount = playCounts[song.id] || 0

  const handlePlay = () => {
    window.dispatchEvent(new CustomEvent('playSong', { detail: song }))
    addActivity({
      type: 'play',
      song_title: song.title,
      artist: song.artist,
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img
              src={song.coverArt}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={handlePlay}
              className="flex-1 bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-white gap-2"
            >
              <Play className="h-4 w-4" />
              Play Now
            </Button>
            <Button variant="outline" className="border-[#15b9b7]/30 text-[#15b9b7] hover:bg-[#15b9b7]/10">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="border-[#15b9b7]/30 text-[#15b9b7] hover:bg-[#15b9b7]/10">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold font-space-grotesk text-white mb-2">{song.title}</h1>
            <p className="text-xl text-gray-400 mb-4">{song.artist}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{song.duration}</span>
              <span>•</span>
              <span>{song.genre}</span>
              <span>•</span>
              <span>{currentPlayCount > 0 ? `${currentPlayCount} new plays` : 'No plays yet'}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/10 to-[#15b9b7]/5 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Token Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Current Price</p>
                <p className={cn(
                  "font-bold text-lg",
                  currentPrice !== song.price ? "text-[#15b9b7] animate-pulse" : "text-[#15b9b7]"
                )}>
                  {currentPrice.toFixed(3)} ALGO
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h Change</p>
                <div className={cn(
                  "flex items-center gap-1",
                  isPositive ? "text-green-400" : "text-red-400"
                )}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-bold">{isPositive ? '+' : ''}{priceChange.toFixed(2)}%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="font-bold text-white">${(song.marketCap / 1000).toFixed(1)}K</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Holders</p>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-[#15b9b7]" />
                  <span className="font-bold text-white">{song.holders}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#15b9b7]/20">
              <p className="text-gray-400 text-sm mb-2">Ticker</p>
              <span className="font-mono bg-[#15b9b7]/20 px-3 py-1 rounded-full text-[#15b9b7] font-bold">
                {song.ticker}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent p-6">
            <h3 className="text-xl font-bold text-white mb-4">About</h3>
            <p className="text-gray-300 leading-relaxed">{song.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
