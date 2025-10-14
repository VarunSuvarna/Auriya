"use client"

import { SongCard } from "@/components/song-card"
import { TrendingUp, Flame, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for songs/tokens
const mockSongs = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Wave",
    coverArt: "/abstract-music-album-cover-purple.jpg",
    price: 2.5,
    marketCap: 125000,
    change24h: 15.3,
    holders: 234,
    ticker: "MDNT",
  },
  {
    id: "2",
    title: "Electric Pulse",
    artist: "Neon Beats",
    coverArt: "/electronic-music-cover-cyan.jpg",
    price: 1.8,
    marketCap: 89000,
    change24h: -5.2,
    holders: 189,
    ticker: "ELEC",
  },
  {
    id: "3",
    title: "Ocean Waves",
    artist: "Aqua Sound",
    coverArt: "/ocean-waves-music-cover.jpg",
    price: 3.2,
    marketCap: 156000,
    change24h: 8.7,
    holders: 312,
    ticker: "WAVE",
  },
  {
    id: "4",
    title: "Desert Storm",
    artist: "Sahara Vibes",
    coverArt: "/desert-music-album-orange.jpg",
    price: 1.5,
    marketCap: 67000,
    change24h: 22.1,
    holders: 145,
    ticker: "DSRT",
  },
  {
    id: "5",
    title: "Neon Nights",
    artist: "City Lights",
    coverArt: "/neon-city-night-music.jpg",
    price: 2.9,
    marketCap: 142000,
    change24h: -3.4,
    holders: 267,
    ticker: "NEON",
  },
  {
    id: "6",
    title: "Forest Echo",
    artist: "Nature Sounds",
    coverArt: "/forest-nature-music-green.jpg",
    price: 2.1,
    marketCap: 98000,
    change24h: 12.5,
    holders: 201,
    ticker: "FRST",
  },
]

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-2xl bg-[#002a4a] border border-[#15b9b7]/20 p-8">
        <h1 className="mb-2 text-4xl font-bold font-space-grotesk text-white">Discover Music NFTs</h1>
        <p className="text-lg text-gray-300">Stream, collect, and trade song tokens on Algorand</p>
      </div>

      {/* Tabs for filtering */}
      <Tabs defaultValue="trending" className="mb-6">
        <TabsList className="bg-[#002a4a] border border-[#15b9b7]/10">
          <TabsTrigger
            value="trending"
            className="gap-2 data-[state=active]:bg-[#15b9b7] data-[state=active]:text-white"
          >
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="hot" className="gap-2 data-[state=active]:bg-[#15b9b7] data-[state=active]:text-white">
            <Flame className="h-4 w-4" />
            Hot
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2 data-[state=active]:bg-[#15b9b7] data-[state=active]:text-white">
            <Clock className="h-4 w-4" />
            New Releases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hot" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs
              .filter((s) => s.change24h > 10)
              .map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs.slice(0, 3).map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
