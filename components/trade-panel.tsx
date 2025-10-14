"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Repeat } from "lucide-react"

interface TradePanelProps {
  coin: {
    ticker: string
    price: number
  }
}

export function TradePanel({ coin }: TradePanelProps) {
  const [amount, setAmount] = useState("0.00")
  const [activeTab, setActiveTab] = useState("buy")

  return (
    <Card className="border-[#15b9b7]/20 bg-[#001324]">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-[#001324] border border-[#15b9b7]/20">
            <TabsTrigger
              value="buy"
              className="text-white data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="text-white data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
            >
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 mt-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Switch to {coin.ticker}</label>
                <Button size="sm" variant="ghost" className="h-6 text-xs text-[#15b9b7] hover:text-[#15b9b7]/80">
                  Set max slippage
                </Button>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-20 bg-[#001324] border-[#15b9b7]/20 text-white"
                  placeholder="0.00"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-sm font-medium text-white">SOL</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-[#15b9b7]">
                    <Repeat className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {["Reset", "0.1 SOL", "0.5 SOL", "Max"].map((label) => (
                <Button
                  key={label}
                  size="sm"
                  variant="outline"
                  className="text-xs border-[#15b9b7]/30 hover:border-[#15b9b7] bg-transparent text-white hover:bg-[#15b9b7]/10"
                  onClick={() => {
                    if (label === "Reset") setAmount("0.00")
                    else if (label === "0.1 SOL") setAmount("0.1")
                    else if (label === "0.5 SOL") setAmount("0.5")
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Trade Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">$0.00 0 {coin.ticker}</span>
                <span className="text-white/60">~</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Position</span>
                <div className="flex items-center gap-1">
                  <span className="text-[#15b9b7]">Trades</span>
                  <span className="text-white/60">Profit/Loss</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-[#001324] font-semibold" size="lg">
              Buy Token
            </Button>

            {/* Profit Indicator */}
            <div className="border-t border-[#15b9b7]/20 pt-3">
              <p className="text-xs text-white/60 mb-2">Profit indicator</p>
              <div className="h-1 w-full bg-[#15b9b7]/20 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-[#15b9b7]" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Switch to SOL</label>
                <Button size="sm" variant="ghost" className="h-6 text-xs text-[#15b9b7] hover:text-[#15b9b7]/80">
                  Set max slippage
                </Button>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-20 bg-[#001324] border-[#15b9b7]/20 text-white"
                  placeholder="0.00"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{coin.ticker}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-[#15b9b7]">
                    <Repeat className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["Reset", "25%", "50%", "75%", "Max"].map((label) => (
                <Button
                  key={label}
                  size="sm"
                  variant="outline"
                  className="text-xs border-[#15b9b7]/30 hover:border-[#15b9b7] bg-transparent text-white hover:bg-[#15b9b7]/10"
                >
                  {label}
                </Button>
              ))}
            </div>

            <Button className="w-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-[#001324] font-semibold" size="lg">
              Sell Token
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
