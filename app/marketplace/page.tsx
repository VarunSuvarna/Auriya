"use client"

import { SongCard } from "@/components/song-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, Users, Activity } from "lucide-react"

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
]

const stats = [
  {
    label: "Total Volume (24h)",
    value: "$2.4M",
    change: "+12.5%",
    icon: DollarSign,
    positive: true,
  },
  {
    label: "Active Traders",
    value: "1,234",
    change: "+8.3%",
    icon: Users,
    positive: true,
  },
  {
    label: "Total Transactions",
    value: "5,678",
    change: "+15.7%",
    icon: Activity,
    positive: true,
  },
  {
    label: "Market Cap",
    value: "$12.8M",
    change: "+6.2%",
    icon: TrendingUp,
    positive: true,
  },
]

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space-grotesk mb-2">Marketplace</h1>
        <p className="text-muted-foreground">Trade song tokens and NFTs</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-accent" />
                <span className={`text-sm font-semibold ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trading Tabs */}
      <Tabs defaultValue="top-gainers">
        <TabsList className="bg-secondary/50 mb-6">
          <TabsTrigger value="top-gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="top-losers">Top Losers</TabsTrigger>
          <TabsTrigger value="most-traded">Most Traded</TabsTrigger>
          <TabsTrigger value="new-listings">New Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="top-gainers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs
              .filter((s) => s.change24h > 0)
              .map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="top-losers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs
              .filter((s) => s.change24h < 0)
              .map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="most-traded">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new-listings">
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
