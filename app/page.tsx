"use client"

import { useState } from "react"
import { SongCard } from "@/components/song-card"
import { RealtimeActivity } from "@/components/realtime-activity"
import { RealtimeStats } from "@/components/realtime-stats"
import { TrendingUp, Flame, Clock, Play, Shuffle, Heart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Mock data for songs/tokens with working demo audio
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
    genre: "Lo-Fi"
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
    genre: "Electronic"
  },
  {
    id: "3",
    title: "Ocean Waves",
    artist: "Nature Sounds",
    coverArt: "/ocean-waves-music-cover.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg",
    price: 3.2,
    marketCap: 156000,
    change24h: 8.7,
    holders: 312,
    ticker: "WAVE",
    duration: "2:45",
    genre: "Ambient"
  },
  {
    id: "4",
    title: "Desert Mirage",
    artist: "Sahara Beats",
    coverArt: "/desert-music-album-orange.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg",
    price: 1.5,
    marketCap: 67000,
    change24h: 22.1,
    holders: 145,
    ticker: "DSRT",
    duration: "1:00",
    genre: "World"
  },
  {
    id: "5",
    title: "Neon Nights",
    artist: "Cyber City",
    coverArt: "/neon-city-night-music.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    price: 2.9,
    marketCap: 142000,
    change24h: -3.4,
    holders: 267,
    ticker: "NEON",
    duration: "4:15",
    genre: "Synthwave"
  },
  {
    id: "6",
    title: "Forest Whispers",
    artist: "Green Valley",
    coverArt: "/forest-nature-music-green.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg",
    price: 2.1,
    marketCap: 98000,
    change24h: 12.5,
    holders: 201,
    ticker: "FRST",
    duration: "2:45",
    genre: "Nature"
  },
  {
    id: "7",
    title: "Space Odyssey",
    artist: "Cosmic Explorer",
    coverArt: "/abstract-music-album-cover-purple.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg",
    price: 4.1,
    marketCap: 203000,
    change24h: 18.9,
    holders: 456,
    ticker: "SPACE",
    duration: "1:00",
    genre: "Ambient"
  },
  {
    id: "8",
    title: "Urban Flow",
    artist: "City Beats",
    coverArt: "/neon-city-night-music.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race2.ogg",
    price: 1.9,
    marketCap: 95000,
    change24h: -2.1,
    holders: 178,
    ticker: "URBAN",
    duration: "1:15",
    genre: "Hip-Hop"
  },
  {
    id: "9",
    title: "Digital Wave",
    artist: "Tech Sounds",
    coverArt: "/electronic-music-cover-cyan.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/menu.ogg",
    price: 3.7,
    marketCap: 185000,
    change24h: 25.6,
    holders: 389,
    ticker: "DIGI",
    duration: "1:30",
    genre: "Electronic"
  },
  {
    id: "10",
    title: "Golden Hour",
    artist: "Sunset Vibes",
    coverArt: "/desert-music-album-orange.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg",
    price: 2.3,
    marketCap: 115000,
    change24h: 7.8,
    holders: 223,
    ticker: "GOLD",
    duration: "1:45",
    genre: "Chill"
  },
  {
    id: "11",
    title: "Deep Waters",
    artist: "Ocean Sounds",
    coverArt: "/ocean-waves-music-cover.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/thrust.mp3",
    price: 2.8,
    marketCap: 140000,
    change24h: 11.2,
    holders: 298,
    ticker: "DEEP",
    duration: "2:00",
    genre: "Ambient"
  },
  {
    id: "12",
    title: "Jungle Beats",
    artist: "Wild Rhythms",
    coverArt: "/forest-nature-music-green.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/lose.ogg",
    price: 1.7,
    marketCap: 85000,
    change24h: 19.4,
    holders: 167,
    ticker: "WILD",
    duration: "1:20",
    genre: "World"
  }
]

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set())

  const toggleLike = (songId: string) => {
    const newLiked = new Set(likedSongs)
    if (newLiked.has(songId)) {
      newLiked.delete(songId)
    } else {
      newLiked.add(songId)
    }
    setLikedSongs(newLiked)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#002a4a] to-[#001324] border border-[#15b9b7]/20 p-8 relative overflow-hidden group hover:border-[#15b9b7]/40 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-[#15b9b7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h1 className="mb-4 text-4xl font-bold font-space-grotesk text-white group-hover:text-[#15b9b7] transition-colors duration-300">
            Discover Music NFTs
          </h1>
          <p className="text-lg text-gray-300 mb-6">Stream, collect, and trade song tokens on Algorand</p>
          <div className="flex gap-4">
            <Button 
              className="bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-white gap-2 group/btn"
              onClick={() => {
                const firstSong = mockSongs[0]
                window.dispatchEvent(new CustomEvent('playSong', { detail: firstSong }))
              }}
            >
              <Play className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              Start Listening
            </Button>
            <Button 
              variant="outline" 
              className="border-[#15b9b7]/30 text-[#15b9b7] hover:bg-[#15b9b7]/10 gap-2"
              onClick={() => {
                const shuffledSongs = [...mockSongs].sort(() => Math.random() - 0.5)
                const randomSong = shuffledSongs[0]
                window.dispatchEvent(new CustomEvent('playSong', { detail: randomSong }))
                window.dispatchEvent(new CustomEvent('enableShuffle'))
              }}
            >
              <Shuffle className="h-4 w-4" />
              Shuffle Play
            </Button>
          </div>
        </div>
      </div>

      {/* Realtime Stats */}
      <div className="mb-8">
        <RealtimeStats />
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
              <SongCard key={song.id} song={song} onPlay={(selectedSong) => {
                window.dispatchEvent(new CustomEvent('playSong', { detail: selectedSong }))
              }} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hot" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs
              .filter((s) => s.change24h > 10)
              .map((song) => (
                <SongCard key={song.id} song={song} onPlay={(selectedSong) => {
                  window.dispatchEvent(new CustomEvent('playSong', { detail: selectedSong }))
                }} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs.slice(0, 3).map((song) => (
              <SongCard key={song.id} song={song} onPlay={(selectedSong) => {
                window.dispatchEvent(new CustomEvent('playSong', { detail: selectedSong }))
              }} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recently Played & Live Activity */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-space-grotesk text-white">Recently Played</h2>
            <Button variant="ghost" className="text-[#15b9b7] hover:text-white hover:bg-[#15b9b7]/10">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockSongs.slice(6, 12).map((song) => (
              <div
                key={song.id}
                className="group cursor-pointer p-3 rounded-lg hover:bg-[#15b9b7]/5 transition-all duration-300"
                onMouseEnter={() => setHoveredCard(song.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('playSong', { detail: song }))
                }}
              >
                <div className="relative aspect-square mb-3">
                  <img
                    src={song.coverArt}
                    alt={song.title}
                    className="w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
                  />
                  <Button
                    size="icon"
                    className={cn(
                      "absolute bottom-2 right-2 h-10 w-10 rounded-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 transition-all duration-300 shadow-lg",
                      hoveredCard === song.id ? "opacity-100 scale-110" : "opacity-0 scale-100"
                    )}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('playSong', { detail: song }))
                    }}
                  >
                    <Play className="h-4 w-4 text-white ml-0.5 fill-white" />
                  </Button>
                </div>
                <h4 className="font-medium text-white text-sm truncate group-hover:text-[#15b9b7] transition-colors">
                  {song.title}
                </h4>
                <p className="text-xs text-gray-400 truncate">{song.artist}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <RealtimeActivity />
        </div>
      </div>
    </div>
  )
}
