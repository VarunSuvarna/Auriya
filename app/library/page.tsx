"use client"

import { SongCard } from "@/components/song-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Heart, Clock, TrendingUp } from "lucide-react"

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
]

export default function LibraryPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space-grotesk mb-2">My Library</h1>
        <p className="text-muted-foreground">Your collection of songs and tokens</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Owned Tokens", value: "12", icon: Music },
          { label: "Liked Songs", value: "45", icon: Heart },
          { label: "Recently Played", value: "23", icon: Clock },
          { label: "Portfolio Value", value: "$1,234", icon: TrendingUp },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content */}
      <Tabs defaultValue="owned">
        <TabsList className="bg-secondary/50 mb-6">
          <TabsTrigger value="owned">Owned Tokens</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="recent">Recently Played</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="owned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="liked">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="space-y-4">
            {mockSongs.map((song, i) => (
              <Card key={i} className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={song.coverArt || "/placeholder.svg"}
                      alt={song.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{song.title}</h3>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playlists">
          <div className="text-center py-12">
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No playlists yet. Create your first playlist!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
