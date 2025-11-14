"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Coins, Users, Target, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BondingCurveTraderProps {
  song: {
    id: string
    title: string
    artist: string
    ticker: string
    coverArt: string
  }
}

export function BondingCurveTrader({ song }: BondingCurveTraderProps) {
  const [algoAmount, setAlgoAmount] = useState("")
  const [tokenAmount, setTokenAmount] = useState("")
  const [activeTab, setActiveTab] = useState("buy")
  const [isLoading, setIsLoading] = useState(false)
  
  // Bonding curve state (simulated)
  const [virtualAlgoReserve, setVirtualAlgoReserve] = useState(30) // 30 ALGO
  const [virtualTokenReserve, setVirtualTokenReserve] = useState(1073000000) // 1.073B tokens
  const [realAlgoRaised, setRealAlgoRaised] = useState(2847) // Current raised
  const [holders, setHolders] = useState(234)
  
  const graduationThreshold = 10000 // 10,000 ALGO
  const graduationProgress = (realAlgoRaised / graduationThreshold) * 100
  
  // Calculate current price
  const currentPrice = virtualAlgoReserve / virtualTokenReserve
  const marketCap = realAlgoRaised * currentPrice * 1000000 // Rough estimate
  
  // Calculate tokens for ALGO amount
  const calculateTokensForAlgo = (algo: number) => {
    if (algo <= 0) return 0
    const newVirtualAlgo = virtualAlgoReserve + algo * 0.99 // 1% royalty
    const newVirtualTokens = (virtualAlgoReserve * virtualTokenReserve) / newVirtualAlgo
    return virtualTokenReserve - newVirtualTokens
  }
  
  // Calculate ALGO for token amount
  const calculateAlgoForTokens = (tokens: number) => {
    if (tokens <= 0) return 0
    const newVirtualTokens = virtualTokenReserve + tokens
    const newVirtualAlgo = (virtualAlgoReserve * virtualTokenReserve) / newVirtualTokens
    return (virtualAlgoReserve - newVirtualAlgo) * 0.99 // 1% royalty
  }
  
  useEffect(() => {
    if (activeTab === "buy" && algoAmount) {
      const tokens = calculateTokensForAlgo(parseFloat(algoAmount))
      setTokenAmount(tokens.toFixed(0))
    } else if (activeTab === "sell" && tokenAmount) {
      const algo = calculateAlgoForTokens(parseFloat(tokenAmount))
      setAlgoAmount(algo.toFixed(4))
    }
  }, [algoAmount, tokenAmount, activeTab])
  
  const handleTrade = async () => {
    setIsLoading(true)
    
    // Simulate trade execution
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (activeTab === "buy") {
      const algo = parseFloat(algoAmount)
      const tokens = calculateTokensForAlgo(algo)
      
      // Update reserves
      setVirtualAlgoReserve(prev => prev + algo * 0.99)
      setVirtualTokenReserve(prev => prev - tokens)
      setRealAlgoRaised(prev => prev + algo * 0.99)
      setHolders(prev => prev + 1)
      
      alert(`Successfully bought ${tokens.toFixed(0)} ${song.ticker} tokens!`)
    } else {
      const tokens = parseFloat(tokenAmount)
      const algo = calculateAlgoForTokens(tokens)
      
      // Update reserves
      setVirtualAlgoReserve(prev => prev - algo / 0.99)
      setVirtualTokenReserve(prev => prev + tokens)
      setRealAlgoRaised(prev => prev - algo / 0.99)
      
      alert(`Successfully sold ${tokens} ${song.ticker} tokens for ${algo.toFixed(4)} ALGO!`)
    }
    
    setAlgoAmount("")
    setTokenAmount("")
    setIsLoading(false)
  }
  
  return (
    <div className="space-y-6">
      {/* Bonding Curve Stats */}
      <Card className="border-[#15b9b7]/20 bg-gradient-to-br from-[#002a4a] to-[#001324]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-[#15b9b7]" />
            Bonding Curve Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#15b9b7]">
                {currentPrice.toFixed(8)}
              </div>
              <div className="text-sm text-gray-400">Current Price (ALGO)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {realAlgoRaised.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">ALGO Raised</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                ${(marketCap / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-gray-400">Market Cap</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{holders}</div>
              <div className="text-sm text-gray-400">Holders</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress to DEX</span>
              <span className="text-[#15b9b7]">
                {graduationProgress.toFixed(1)}% ({realAlgoRaised}/{graduationThreshold} ALGO)
              </span>
            </div>
            <Progress 
              value={graduationProgress} 
              className="h-2 bg-[#001324]"
            />
            <div className="text-xs text-gray-500 text-center">
              When 10,000 ALGO is raised, this token graduates to Tinyman DEX
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Trading Interface */}
      <Card className="border-[#15b9b7]/20 bg-[#001324]">
        <CardHeader>
          <CardTitle className="text-white">Trade {song.ticker}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-[#002a4a]">
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  You Pay (ALGO)
                </label>
                <Input
                  type="number"
                  value={algoAmount}
                  onChange={(e) => setAlgoAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-[#002a4a] border-[#15b9b7]/20 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  You Receive ({song.ticker})
                </label>
                <Input
                  type="number"
                  value={tokenAmount}
                  readOnly
                  placeholder="0"
                  className="bg-[#002a4a] border-[#15b9b7]/20 text-white"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {["0.1", "0.5", "1.0", "5.0"].map((amount) => (
                  <Button
                    key={amount}
                    size="sm"
                    variant="outline"
                    className="text-xs border-[#15b9b7]/30 hover:border-[#15b9b7] bg-transparent text-white"
                    onClick={() => setAlgoAmount(amount)}
                  >
                    {amount} ALGO
                  </Button>
                ))}
              </div>
              
              {algoAmount && (
                <div className="space-y-2 text-sm bg-[#15b9b7]/5 p-3 rounded-lg border border-[#15b9b7]/20">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Artist Royalty (1%)</span>
                    <span className="text-white">{(parseFloat(algoAmount) * 0.01).toFixed(4)} ALGO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price Impact</span>
                    <span className="text-green-400">
                      +{((calculateTokensForAlgo(parseFloat(algoAmount)) / virtualTokenReserve) * 100).toFixed(3)}%
                    </span>
                  </div>
                </div>
              )}
              
              <Button
                onClick={handleTrade}
                disabled={!algoAmount || parseFloat(algoAmount) <= 0 || isLoading}
                className="w-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-[#001324] font-semibold"
                size="lg"
              >
                {isLoading ? "Processing..." : `Buy ${song.ticker}`}
              </Button>
            </TabsContent>
            
            <TabsContent value="sell" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  You Sell ({song.ticker})
                </label>
                <Input
                  type="number"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  placeholder="0"
                  className="bg-[#002a4a] border-[#15b9b7]/20 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  You Receive (ALGO)
                </label>
                <Input
                  type="number"
                  value={algoAmount}
                  readOnly
                  placeholder="0.00"
                  className="bg-[#002a4a] border-[#15b9b7]/20 text-white"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {["25%", "50%", "75%", "100%"].map((percent) => (
                  <Button
                    key={percent}
                    size="sm"
                    variant="outline"
                    className="text-xs border-[#15b9b7]/30 hover:border-[#15b9b7] bg-transparent text-white"
                    onClick={() => {
                      // Simulate user balance
                      const userBalance = 1000000
                      const percentage = parseInt(percent) / 100
                      setTokenAmount((userBalance * percentage).toString())
                    }}
                  >
                    {percent}
                  </Button>
                ))}
              </div>
              
              <Button
                onClick={handleTrade}
                disabled={!tokenAmount || parseFloat(tokenAmount) <= 0 || isLoading}
                className="w-full bg-red-500 hover:bg-red-500/90 text-white font-semibold"
                size="lg"
              >
                {isLoading ? "Processing..." : `Sell ${song.ticker}`}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Graduation Notice */}
      {graduationProgress >= 100 && (
        <Card className="border-green-500/20 bg-gradient-to-r from-green-500/10 to-[#15b9b7]/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-green-400" />
              <div>
                <h3 className="font-semibold text-green-400">Graduation Complete!</h3>
                <p className="text-sm text-gray-300">
                  This token has graduated to Tinyman DEX. Trading continues there.
                </p>
              </div>
              <Button size="sm" className="ml-auto bg-green-500 hover:bg-green-500/90">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Trade on DEX
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}