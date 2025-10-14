"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Pencil, Minus, Activity, Type, Smile, Tag, Search, Home, BarChart3 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TradingChartProps {
  coin: {
    ticker: string
    change24h: number
    volume24h: number
  }
}

export function TradingChart({ coin }: TradingChartProps) {
  const isPositive = coin.change24h > 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="p-0">
        {/* Chart Header */}
        <div className="border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tabs defaultValue="4h">
                <TabsList className="bg-secondary/50 h-8">
                  <TabsTrigger value="4h" className="text-xs">
                    4h
                  </TabsTrigger>
                  <TabsTrigger value="1d" className="text-xs">
                    1D
                  </TabsTrigger>
                  <TabsTrigger value="5d" className="text-xs">
                    5D
                  </TabsTrigger>
                  <TabsTrigger value="1m" className="text-xs">
                    1M
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-1 text-xs">
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <Activity className="h-3.5 w-3.5" />
                </Button>
                <span className="text-muted-foreground">Trade Display</span>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="h-3 w-3" />
                <span className="text-muted-foreground">Hide All Bubbles</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Price/MCap</span>
                <span className="text-xs text-muted-foreground">USD/SOL</span>
              </div>
            </div>
          </div>

          {/* Chart Title */}
          <div className="mt-3 flex items-center gap-2">
            <h3 className="text-sm font-semibold">{coin.ticker}/SOL Market Cap (USD) • 4h • Pump</h3>
            <span className="text-xs">
              O: <span className="text-accent">7M</span>
            </span>
            <span className="text-xs">
              H: <span className="text-green-400">9M</span>
            </span>
            <span className="text-xs">
              L: <span className="text-red-400">6M</span>
            </span>
            <span className="text-xs">
              C:{" "}
              <span className={isPositive ? "text-green-400" : "text-red-400"}>
                OM ({isPositive ? "+" : ""}
                {coin.change24h.toFixed(2)}%)
              </span>
            </span>
            <span className="text-xs text-muted-foreground">Volume: {(coin.volume24h / 1000).toFixed(1)}K</span>
          </div>
        </div>

        {/* Chart Area with Sidebar */}
        <div className="flex">
          {/* Left Toolbar */}
          <div className="flex flex-col gap-2 border-r border-border/50 p-2 bg-card/30">
            {[
              { icon: TrendingUp, active: false },
              { icon: Pencil, active: false },
              { icon: Minus, active: false },
              { icon: Activity, active: false },
              { icon: Type, active: false },
              { icon: Smile, active: false },
              { icon: Tag, active: false },
              { icon: Search, active: false },
              { icon: Home, active: false },
              { icon: BarChart3, active: false },
            ].map((item, i) => (
              <Button key={i} size="icon" variant={item.active ? "default" : "ghost"} className="h-8 w-8">
                <item.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Chart Canvas */}
          <div className="flex-1 relative bg-gradient-to-b from-card/50 to-background/50">
            <div className="aspect-[16/9] relative">
              {/* Mock Chart - Replace with actual chart library */}
              <svg className="w-full h-full" viewBox="0 0 800 450">
                {/* Grid Lines */}
                {[...Array(10)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 45}
                    x2="800"
                    y2={i * 45}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border/30"
                  />
                ))}
                {[...Array(16)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 50}
                    y1="0"
                    x2={i * 50}
                    y2="450"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border/30"
                  />
                ))}

                {/* Mock Candlesticks */}
                {[
                  { x: 100, open: 300, close: 250, high: 320, low: 240, color: "red" },
                  { x: 150, open: 250, close: 280, high: 290, low: 240, color: "green" },
                  { x: 200, open: 280, close: 270, high: 290, low: 260, color: "red" },
                  { x: 250, open: 270, close: 300, high: 310, low: 265, color: "green" },
                  { x: 300, open: 300, close: 290, high: 310, low: 280, color: "red" },
                  { x: 350, open: 290, close: 320, high: 330, low: 285, color: "green" },
                  { x: 400, open: 320, close: 310, high: 330, low: 300, color: "red" },
                  { x: 450, open: 310, close: 340, high: 350, low: 305, color: "green" },
                  { x: 500, open: 340, close: 360, high: 370, low: 335, color: "green" },
                  { x: 550, open: 360, close: 200, high: 370, low: 190, color: "red" },
                  { x: 600, open: 200, close: 220, high: 230, low: 190, color: "green" },
                  { x: 650, open: 220, close: 210, high: 230, low: 200, color: "red" },
                ].map((candle, i) => (
                  <g key={i}>
                    {/* Wick */}
                    <line
                      x1={candle.x}
                      y1={candle.high}
                      x2={candle.x}
                      y2={candle.low}
                      stroke={candle.color === "green" ? "#10b981" : "#ef4444"}
                      strokeWidth="1"
                    />
                    {/* Body */}
                    <rect
                      x={candle.x - 8}
                      y={Math.min(candle.open, candle.close)}
                      width="16"
                      height={Math.abs(candle.open - candle.close) || 2}
                      fill={candle.color === "green" ? "#10b981" : "#ef4444"}
                    />
                  </g>
                ))}

                {/* Volume Bars */}
                {[
                  { x: 100, height: 30 },
                  { x: 150, height: 45 },
                  { x: 200, height: 25 },
                  { x: 250, height: 50 },
                  { x: 300, height: 35 },
                  { x: 350, height: 60 },
                  { x: 400, height: 40 },
                  { x: 450, height: 55 },
                  { x: 500, height: 70 },
                  { x: 550, height: 90 },
                  { x: 600, height: 45 },
                  { x: 650, height: 35 },
                ].map((bar, i) => (
                  <rect
                    key={i}
                    x={bar.x - 8}
                    y={450 - bar.height}
                    width="16"
                    height={bar.height}
                    fill="#17cac6"
                    opacity="0.3"
                  />
                ))}
              </svg>

              {/* Price Labels */}
              <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-4 text-xs text-muted-foreground">
                {["11.0M", "10.0M", "9.0M", "8.0M", "7.0M", "6.0M", "5.0M", "4.0M", "3.0M", "2.0M"].map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Footer */}
        <div className="border-t border-border/50 p-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>tiktok.com</span>
            <span>17:49:41 UTC</span>
            <span>%</span>
            <span>log</span>
            <span>auto</span>
          </div>
          <div className="flex items-center gap-2">
            <span>View on Advanced</span>
            <span>Trade on MEXC</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
