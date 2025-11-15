"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, TrendingUp, DollarSign, Users, Upload, BarChart3 } from "lucide-react"
import Link from "next/link"

const stats = [ 
  { label: "Total Uploads", value: "0", icon: Music, color: "text-accent" },
  { label: "Total Earnings", value: "$0.00", icon: DollarSign, color: "text-green-400" },
  { label: "Total Streams", value: "0", icon: TrendingUp, color: "text-blue-400" },
  { label: "Followers", value: "0", icon: Users, color: "text-purple-400" },
]

export default function DashboardPage() {
  return (
    <div className="w-full px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl md:text-3xl font-bold font-space-grotesk mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Creator Dashboard</h1>
        <p className="text-muted-foreground text-sm md:text-base animate-in slide-in-from-left-4 duration-500 delay-100">Manage your music, track earnings, and grow your audience</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur hover:shadow-lg hover:shadow-[#15b9b7]/5 transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color} transition-transform duration-300 hover:scale-110`} />
              </div>
              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 animate-in slide-in-from-left-4 duration-500 delay-300">
        <h2 className="text-lg md:text-xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border/50 bg-gradient-to-br from-accent/10 to-transparent hover:from-accent/20 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-accent/10 hover:scale-[1.02] group">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-all duration-300 group-hover:scale-110">
                  <Upload className="h-5 w-5 md:h-6 md:w-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm md:text-base group-hover:text-accent transition-colors">Upload New Song</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 group-hover:text-gray-300 transition-colors">Upload your music and mint NFTs or tokens</p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#17cac6] to-[#0ea39f] hover:from-[#15b8b4] hover:to-[#0c8f8b] hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
                    asChild
                  >
                    <Link href="/upload">Upload Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur hover:border-accent/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-accent/10 hover:scale-[1.02] group">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-secondary group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                  <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-sm md:text-base group-hover:text-accent transition-colors">View Analytics</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 group-hover:text-gray-300 transition-colors">Track your performance and earnings</p>
                  <Button size="sm" variant="outline" className="border-border/50 bg-transparent hover:border-accent/50 hover:bg-accent/10 transition-all duration-300">
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="animate-in slide-in-from-right-4 duration-500 delay-500">
        <h2 className="text-lg md:text-xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Recent Uploads</h2>
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="animate-pulse">
              <Music className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground opacity-50 hover:opacity-70 transition-opacity duration-300" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">No uploads yet</h3>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">Start by uploading your first song</p>
            <Button
              className="bg-gradient-to-r from-[#17cac6] to-[#0ea39f] hover:from-[#15b8b4] hover:to-[#0c8f8b] hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/upload">Upload Your First Song</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
