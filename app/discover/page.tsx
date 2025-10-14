"use client"

import { SongCard } from "@/components/song-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const genres = ["All", "Electronic", "Hip Hop", "Rock", "Pop", "Jazz", "Classical", "Ambient"]

export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space-grotesk mb-2">Discover Music</h1>
        <p className="text-muted-foreground">Explore new songs and emerging artists</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by song, artist, or ticker..." className="pl-10 bg-secondary/20" />
        </div>
        <Button variant="outline" className="gap-2 border-border/50 bg-transparent">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Genre Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={genre === "All" ? "default" : "outline"}
            size="sm"
            className={
              genre === "All"
                ? "bg-accent hover:bg-accent/90 text-primary"
                : "border-border/50 bg-transparent hover:border-accent/50"
            }
          >
            {genre}
          </Button>
        ))}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="songs">
        <TabsList className="bg-secondary/50 mb-6">
          <TabsTrigger value="songs">Songs</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="artists">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {["Luna Wave", "Neon Beats", "Aqua Sound", "Sahara Vibes", "City Lights", "Nature Sounds"].map(
              (artist, i) => (
                <div
                  key={i}
                  className="group cursor-pointer rounded-xl border border-border/50 bg-card/50 p-6 text-center transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
                >
                  <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-accent/50 to-primary/50 transition-transform group-hover:scale-105" />
                  <h3 className="font-semibold">{artist}</h3>
                  <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 10) + 1} songs</p>
                </div>
              ),
            )}
          </div>
        </TabsContent>

        <TabsContent value="playlists">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Top Gainers", "New Releases", "Chill Vibes", "Workout Mix", "Study Focus", "Party Hits"].map(
              (playlist, i) => (
                <div
                  key={i}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card/50 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
                >
                  <div className="aspect-square bg-gradient-to-br from-accent/30 to-primary/30 transition-transform group-hover:scale-105" />
                  <div className="p-4">
                    <h3 className="font-semibold">{playlist}</h3>
                    <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 50) + 10} songs</p>
                  </div>
                </div>
              ),
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
