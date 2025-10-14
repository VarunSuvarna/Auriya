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
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space-grotesk mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">Manage your music, track earnings, and grow your audience</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border/50 bg-gradient-to-br from-accent/10 to-transparent hover:from-accent/20 transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                  <Upload className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Upload New Song</h3>
                  <p className="text-sm text-muted-foreground mb-3">Upload your music and mint NFTs or tokens</p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#17cac6] to-[#0ea39f] hover:from-[#15b8b4] hover:to-[#0c8f8b]"
                    asChild
                  >
                    <Link href="/upload">Upload Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-accent/50 transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">View Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-3">Track your performance and earnings</p>
                  <Button size="sm" variant="outline" className="border-border/50 bg-transparent">
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Uploads */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-12 text-center">
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No uploads yet</h3>
            <p className="text-muted-foreground mb-6">Start by uploading your first song</p>
            <Button
              className="bg-gradient-to-r from-[#17cac6] to-[#0ea39f] hover:from-[#15b8b4] hover:to-[#0c8f8b]"
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
