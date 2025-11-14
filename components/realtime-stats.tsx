"use client"

import { TrendingUp, TrendingDown, Users, Music, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useRealtime } from "@/hooks/useRealtime"
import { cn } from "@/lib/utils"

export function RealtimeStats() {
  const { activeListeners, playCounts } = useRealtime()

  const totalPlays = Object.values(playCounts).reduce((sum, count) => sum + count, 0)
  const avgPlaysPerSong = totalPlays > 0 ? Math.floor(totalPlays / Object.keys(playCounts).length) : 0

  const stats = [
    {
      label: "Active Listeners",
      value: activeListeners,
      icon: Headphones,
      color: "text-[#15b9b7]",
      bgColor: "bg-[#15b9b7]/10"
    },
    {
      label: "Total Plays Today",
      value: totalPlays + 45231, // Base number + realtime
      icon: Music,
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    {
      label: "Avg Plays/Song",
      value: avgPlaysPerSong + 3769, // Base number + realtime
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}