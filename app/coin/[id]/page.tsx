"use client"

import { use, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, Users, Activity, Loader2, Wallet } from "lucide-react"
import { useWallet } from "@txnlab/use-wallet-react"
import { toast } from "react-toastify"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRealtime } from "@/hooks/useRealtime"

export default function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { activeAddress, activeAccount } = useWallet()
  const { tokenPrices, activeListeners, addActivity, updateTokenPrice } = useRealtime()
  
  const [song, setSong] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTrading, setIsTrading] = useState(false)
  const [amount, setAmount] = useState<string>("10")

  const currentPrice = tokenPrices[id] || song?.price || 2.5
  const initialPrice = song?.price || 2.5
  const priceChange = ((currentPrice - initialPrice) / initialPrice) * 100
  const isPositive = priceChange >= 0

  useEffect(() => {
    async function fetchSong() {
      try {
        const response = await fetch(`/api/songs/${id}`)
        const data = await response.json()
        if (data.success) {
          setSong(data.song)
        }
      } catch (error) {
        console.error("Failed to fetch song:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSong()
  }, [id])

  const handleTrade = async (action: 'buy' | 'sell') => {
    const address = activeAddress || activeAccount?.address
    console.log('Initiating trade:', { action, songId: id, address, amount })

    if (!address) {
      toast.error("Please connect your wallet first.")
      return
    }

    setIsTrading(true)
    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          songId: id,
          amount: parseFloat(amount),
          userAddress: address
        })
      })

      console.log('Trade internal response:', response.status)

      const result = await response.json()
      if (result.success) {
        toast.success(`Successfully ${action === 'buy' ? 'bought' : 'sold'} tokens!`)
        if (result.newPrice) {
          updateTokenPrice(id, result.newPrice)
        }
        addActivity({
          type: 'trade',
          song_title: song?.title || 'Token',
          artist: song?.artist || 'Artist',
          user_address: activeAddress
        })
      } else {
        throw new Error(result.error || "Trade failed")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsTrading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#15b9b7]" />
      </div>
    )
  }

  if (!song) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Song not found</h2>
        <Link href="/">
          <Button variant="ghost">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2 text-[#15b9b7] hover:text-white hover:bg-[#15b9b7]/10">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative h-48 w-48 rounded-2xl overflow-hidden border border-[#15b9b7]/30 shadow-2xl">
              <img src={song.coverArt} alt={song.title} className="object-cover h-full w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold font-space-grotesk text-white">{song.title}</h1>
                <span className="font-mono bg-[#15b9b7]/20 px-3 py-1 rounded-lg text-[#15b9b7] text-lg">
                  ${song.ticker}
                </span>
              </div>
              <p className="text-xl text-gray-400">{song.artist}</p>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Users className="h-4 w-4 text-[#15b9b7]" />
                  <span>{song.holders} holders</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span>{activeListeners} active traders</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#15b9b7]/20 bg-[#15b9b7]/5 p-6 space-y-6">
             <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Market Cap</p>
                  <p className="text-3xl font-bold text-white">${(song.marketCap / 1000).toFixed(1)}K</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">24h Change</p>
                  <div className={cn(
                    "flex items-center gap-1 text-xl font-bold",
                    isPositive ? "text-green-400" : "text-red-400"
                  )}>
                    {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    <span>{isPositive ? '+' : ''}{priceChange.toFixed(2)}%</span>
                  </div>
                </div>
             </div>
             
             <div className="h-64 bg-[#15b9b7]/10 rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-[#15b9b7]/10 to-transparent" />
                
                {/* SVG Curve Chart */}
                <div className="w-full h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#15b9b7" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#15b9b7" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* The Curve Fill */}
                    <path 
                      d="M 0 40 Q 25 38, 50 30 T 100 5 L 100 40 L 0 40 Z" 
                      fill="url(#curveGradient)"
                      className="animate-in fade-in duration-1000"
                    />
                    
                    {/* The Curve Line */}
                    <path 
                      d="M 0 40 Q 25 38, 50 30 T 100 5" 
                      fill="none" 
                      stroke="#15b9b7" 
                      strokeWidth="0.5"
                      className="animate-pulse"
                    />

                    {/* Progress Marker */}
                    <circle cx="50" cy="30" r="1.5" fill="#15b9b7">
                       <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                  
                  <div className="absolute top-0 right-0 text-[10px] text-[#15b9b7]/60 font-mono">
                    MAX PRICE
                  </div>
                  <div className="absolute bottom-0 left-0 text-[10px] text-[#15b9b7]/60 font-mono">
                    MINT PRICE
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Trade Section */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/10 to-[#15b9b7]/5 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Trade Tokens</h2>
            
            <div className="space-y-6">
              <div className="bg-black/40 rounded-xl p-4 border border-[#15b9b7]/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400">Current Price</span>
                  <span className={cn(
                    "text-2xl font-bold text-[#15b9b7]",
                    isTrading && "animate-pulse"
                  )}>
                    {currentPrice.toFixed(5)} ALGO
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Amount to Trade</p>
                  <div className="flex gap-2">
                    {['10', '50', '100', '500'].map(val => (
                       <Button 
                         key={val}
                         variant="outline" 
                         size="sm"
                         className={cn(
                           "flex-1 border-[#15b9b7]/30 hover:border-[#15b9b7] hover:bg-[#15b9b7]/10",
                           amount === val && "bg-[#15b9b7]/20 border-[#15b9b7] text-[#15b9b7]"
                         )}
                         onClick={() => setAmount(val)}
                       >
                         {val}
                       </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="bg-green-500/80 hover:bg-green-500 text-white font-bold py-6 text-lg"
                  onClick={() => handleTrade('buy')}
                  disabled={isTrading}
                >
                  {isTrading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Buy"}
                </Button>
                <Button 
                  variant="outline"
                  className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white font-bold py-6 text-lg"
                  onClick={() => handleTrade('sell')}
                  disabled={isTrading}
                >
                  {isTrading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sell"}
                </Button>
              </div>
              
              {!activeAddress && (
                <p className="text-center text-xs text-yellow-500/80 mt-4 flex items-center justify-center gap-1">
                  <Wallet className="h-3 w-3" />
                  Connect wallet to trade
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#15b9b7]/20 bg-black/20 p-6">
            <h3 className="font-semibold text-white mb-4">Token Info</h3>
            <div className="space-y-3 text-sm">
               <div className="flex justify-between">
                 <span className="text-gray-400">Total Supply</span>
                 <span className="text-white font-mono">1,000,000,000</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-400">Bonding Curve</span>
                 <span className="text-white">Exponential</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-400">Graduation</span>
                 <span className="text-white">N/A</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}