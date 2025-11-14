"use client"

import { Play, ShoppingCart, Heart, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealtime } from "@/hooks/useRealtime"
import { cn } from "@/lib/utils"

export function RealtimeActivity() {
  const { recentActivity, activeListeners } = useRealtime()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'play':
        return <Play className="h-3 w-3 text-[#15b9b7]" />
      case 'purchase':
        return <ShoppingCart className="h-3 w-3 text-green-400" />
      case 'like':
        return <Heart className="h-3 w-3 text-red-400" />
      default:
        return <TrendingUp className="h-3 w-3 text-gray-400" />
    }
  }

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'play':
        return `played "${activity.song_title}"`
      case 'purchase':
        return `bought "${activity.song_title}" token`
      case 'like':
        return `liked "${activity.song_title}"`
      default:
        return 'unknown activity'
    }
  }

  const formatTime = (createdAt: string) => {
    const seconds = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <Card className="border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-[#15b9b7]" />
          Live Activity
          <div className="ml-auto flex items-center gap-1 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            {activeListeners} listening
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentActivity.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent activity</p>
        ) : (
          recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#15b9b7]/5 transition-colors"
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  <span className="text-[#15b9b7] font-medium">{activity.user}</span>{' '}
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-gray-400">by {activity.artist}</p>
              </div>
              <div className="text-xs text-gray-500 flex-shrink-0">
                {formatTime(activity.created_at)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}