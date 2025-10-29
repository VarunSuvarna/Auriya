"use client"

import { use } from "react"
import { ArrowLeft, Share2, Star, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { TradingChart } from "@/components/trading-chart"
import { TradePanel } from "@/components/trade-panel"
import { TopHolders } from "@/components/top-holders"
import { TradesTable } from "@/components/trades-table"

// Mock data
const mockCoinData = {
  "1": {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Wave",
    ticker: "MDNT",
    coverArt: "/abstract-music-album-cover-purple.jpg",
    marketCap: 7000000,
    price: 2.5,
    change24h: 15.3,
    volume24h: 489232,
    holders: 234,
    supply: 1000000,
    description: "A mesmerizing journey through ambient soundscapes and ethereal melodies.",
    bondingCurveProgress: 100,
    ath: 9900000,
  },
}

export default function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const coin = mockCoinData[id as keyof typeof mockCoinData] || mockCoinData["1"]

  const isPositive = coin.change24h > 0

  return (
    <div className="container mx-auto px-4 py-6 pb-32 max-w-[1600px]">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-4 gap-2 text-white hover:text-[#15b9b7]" asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 md:gap-6">
        {/* Main Content */}
        <div className="space-y-4 md:space-y-6 min-w-0">
          {/* Header Card */}
          <Card className="border-[#15b9b7]/20 bg-[#001324]">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-3 md:gap-4">
                <img
                  src={coin.coverArt || "/placeholder.svg"}
                  alt={coin.title}
                  className="h-16 w-16 md:h-20 md:w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div className="flex-1">
                      <h1 className="text-xl md:text-2xl font-bold font-space-grotesk text-white">{coin.title}</h1>
                      <p className="text-white/60">{coin.ticker}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs md:text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          {coin.artist}
                        </span>
                        <span>•</span>
                        <span>20d ago</span>
                        <span>•</span>
                        <span className="text-accent">by BNK_pump</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 md:gap-2 border-accent/50 bg-transparent text-white hover:bg-accent/10 text-xs md:text-sm"
                      >
                        <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Share</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-accent/50 bg-transparent text-white hover:bg-accent/10 h-8 w-8 md:h-10 md:w-10"
                      >
                        <Star className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Stats */}
              <div className="mt-4 md:mt-6 grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm text-white/60">Market Cap</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">${(coin.marketCap / 1000000).toFixed(1)}M</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`text-xs md:text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                      {isPositive ? "+" : ""}${((coin.marketCap * (coin.change24h / 100)) / 1000).toFixed(1)}K (
                      {isPositive ? "+" : ""}
                      {coin.change24h.toFixed(2)}%)
                    </span>
                    <span className="text-xs text-white/60">24hr</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm text-white/60">ATH</p>
                  <p className="text-lg md:text-xl font-semibold text-white">${(coin.ath / 1000000).toFixed(1)}M</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-gradient-to-r from-[#17cac6] to-[#0ea39f] transition-all"
                    style={{ width: `${coin.bondingCurveProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Chart */}
          <TradingChart coin={coin} />

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: "Vol 24h", value: `$${(coin.volume24h / 1000).toFixed(1)}K` },
              { label: "Price", value: `$${coin.price.toFixed(7)}` },
              { label: "5m", value: "-2.24%", negative: true },
              { label: "1h", value: "-22.25%", negative: true },
            ].map((stat, i) => (
              <Card key={i} className="border-[#15b9b7]/20 bg-[#001324]">
                <CardContent className="p-3 md:p-4 text-center">
                  <p className="text-xs text-white/60">{stat.label}</p>
                  <p className={`text-base md:text-lg font-semibold ${stat.negative ? "text-red-400" : "text-white"}`}>
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Description & Tabs */}
          <Card className="border-[#15b9b7]/20 bg-[#001324]">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm text-white/70 mb-4">{coin.description}</p>

              <Tabs defaultValue="comments">
                <TabsList className="bg-[#001324] border border-[#15b9b7]/20">
                  <TabsTrigger value="comments" className="text-white data-[state=active]:bg-[#15b9b7]/20 text-sm">
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="trades" className="text-white data-[state=active]:bg-[#15b9b7]/20 text-sm">
                    Trades
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comments" className="mt-4">
                  <div className="text-center py-6 md:py-8 text-white/60">
                    <MessageCircle className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm md:text-base">No comments yet. Be the first to comment!</p>
                  </div>
                </TabsContent>

                <TabsContent value="trades" className="mt-4">
                  <TradesTable />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-3 md:space-y-4 min-w-0 lg:min-w-[400px]">
          {/* Trade Panel */}
          <TradePanel coin={coin} />

          {/* Bonding Curve Progress */}
          <Card className="border-[#15b9b7]/20 bg-[#001324]">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs md:text-sm font-semibold text-white">Bonding Curve Progress</h3>
                <span className="text-xs md:text-sm font-bold text-[#15b9b7]">{coin.bondingCurveProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#15b9b7]/20 mb-2">
                <div className="h-full bg-[#15b9b7]" style={{ width: `${coin.bondingCurveProgress}%` }} />
              </div>
              <p className="text-xs text-[#15b9b7]">Coin has graduated!</p>
            </CardContent>
          </Card>

          {/* Position & Trades */}
          <Card className="border-[#15b9b7]/20 bg-[#001324]">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">POSITION</span>
                <span className="text-white/60">TRADES COMPLETED</span>
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="border-[#15b9b7]/20 bg-[#001324]">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs md:text-sm font-semibold flex items-center gap-2 text-white">
                  <MessageCircle className="h-3 w-3 md:h-4 md:w-4 text-[#15b9b7]" />
                  {coin.ticker} chat
                </h3>
                <span className="text-xs text-white/60">1.4K members</span>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2 border-[#15b9b7]/50 bg-transparent text-white hover:bg-[#15b9b7]/10 text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                Join chat
              </Button>
            </CardContent>
          </Card>

          {/* Top Holders */}
          <TopHolders />
        </div>
      </div>
    </div>
  )
}
