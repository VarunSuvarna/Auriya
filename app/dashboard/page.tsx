"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, TrendingUp, DollarSign, Users, Upload, BarChart3, Loader2 } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@txnlab/use-wallet-react"

export default function DashboardPage() {
  const { activeAddress } = useWallet()
  const [userSongs, setUserSongs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchUserSongs() {
      if (!activeAddress) {
        setIsLoading(false)
        return
      }
      try {
        const response = await fetch(`/api/songs?artistAddress=${activeAddress}`)
        const data = await response.json()
        if (Array.isArray(data)) {
          setUserSongs(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (mounted) {
      fetchUserSongs()
    }
  }, [activeAddress, mounted])

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!activeAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
         <Users className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
         <h2 className="text-2xl font-bold mb-2 text-white">Connect Your Wallet</h2>
         <p className="text-gray-400 max-w-md">You need to connect your Algorand wallet to view your personal creator dashboard and track your music performance.</p>
      </div>
    )
  }

  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-space-grotesk mb-2 text-white">Creator Dashboard</h1>
        <p className="text-muted-foreground text-sm md:text-base">Welcome back, {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}</p>
      </div>

      <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Uploads", value: userSongs.length.toString(), icon: Music, color: "text-[#15b9b7]" },
          { label: "Total Earnings", value: `$${(userSongs.length * 12.5).toFixed(2)}`, icon: DollarSign, color: "text-green-400" },
          { label: "Total Streams", value: (userSongs.length * 142).toString(), icon: TrendingUp, color: "text-blue-400" },
          { label: "Followers", value: "24", icon: Users, color: "text-purple-400" },
        ].map((stat, i) => (
          <Card key={i} className="border-[#15b9b7]/10 bg-black/20 backdrop-blur">
            <CardContent className="p-4 md:p-6">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-[#15b9b7]/10 bg-[#15b9b7]/5 hover:bg-[#15b9b7]/10 transition-colors">
            <CardContent className="p-4 md:p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#15b9b7]/20 flex items-center justify-center">
                <Upload className="h-6 w-6 text-[#15b9b7]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Upload Tracks</h3>
                <p className="text-xs text-gray-400 mb-3">Add new musical components</p>
                <Button size="sm" className="bg-[#15b9b7] hover:bg-[#15b9b7]/90" asChild>
                  <Link href="/upload">Upload Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#15b9b7]/10 bg-black/20">
            <CardContent className="p-4 md:p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Kitchen</h3>
                <p className="text-xs text-gray-400 mb-3">Mix your stems</p>
                <Button size="sm" variant="outline" className="border-[#15b9b7]/20 text-white" asChild>
                  <Link href="/recipes">Go to Kitchen</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">Your Uploads</h2>
        
        {userSongs.length === 0 ? (
          <div className="text-center py-12 bg-black/20 rounded-xl border border-dashed border-[#15b9b7]/20">
            <Music className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-semibold mb-2 text-white">No uploads yet</h3>
            <Button className="bg-[#15b9b7]" asChild>
              <Link href="/upload">Upload Your First Song</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSongs.map(song => (
              <div key={song.id} className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5 hover:border-[#15b9b7]/30 transition-all">
                <img src={song.coverArt} className="h-16 w-16 rounded-xl object-cover" alt={song.title} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{song.title}</p>
                  <p className="text-xs text-gray-400">{song.artist}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#15b9b7]">{song.price.toFixed(4)} ALGO</p>
                  <p className="text-[10px] text-gray-500 font-mono">{song.ticker}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
