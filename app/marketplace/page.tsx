"use client"

import { useState, useEffect } from "react"
import { SongCard } from "@/components/song-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, Users, Activity, Loader2 } from "lucide-react"

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
  const [listings, setListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch('/api/marketplace')
        const data = await response.json()
        if (data.success) {
          setListings(data.listings)
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchListings()
  }, [])

  const songsFromListings = listings.map(l => ({
    id: l.songs.id,
    title: l.songs.title,
    artist: l.songs.artist,
    coverArt: l.songs.cover_art,
    price: l.price_microalgo / 1_000_000,
    marketCap: l.songs.market_cap || 0,
    change24h: l.songs.change_24h || 0,
    holders: l.songs.holders || 0,
    ticker: l.songs.ticker,
  }))

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
      <Tabs defaultValue="all-listings">
        <TabsList className="bg-secondary/50 mb-6">
          <TabsTrigger value="all-listings">All Listings</TabsTrigger>
          <TabsTrigger value="top-gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="new-listings">New Listings</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            <TabsContent value="all-listings">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songsFromListings.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
                {songsFromListings.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-12">No active listings found.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="top-gainers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songsFromListings
                  .filter((s) => s.change24h > 0)
                  .map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="new-listings">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songsFromListings.slice(0, 6).map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
