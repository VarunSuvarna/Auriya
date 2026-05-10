import { useState, useEffect, useCallback } from 'react'

interface RealtimeData {
  tokenPrices: { [key: string]: number }
  playCounts: { [key: string]: number }
  activeListeners: number
  recentActivity: ActivityItem[]
}

interface ActivityItem {
  id: string
  type: 'play' | 'purchase' | 'like' | 'mint' | 'trade'
  song_id?: string
  song_title?: string
  artist?: string
  user?: string
  user_address?: string
  created_at: string
}

export function useRealtime() {
  const [data, setData] = useState<RealtimeData>({
    tokenPrices: {},
    playCounts: {},
    activeListeners: 0,
    recentActivity: []
  })

  // Fetch recent activity on mount and periodically
  const fetchActivity = useCallback(async () => {
    try {
      const response = await fetch('/api/activity')
      const result = await response.json()
      if (result.success && result.activities) {
        setData(prev => ({
          ...prev,
          recentActivity: result.activities
        }))
      }
    } catch (error) {
      console.error("Failed to fetch activity:", error)
    }
  }, [])

  const updateTokenPrice = useCallback((songId: string, newPrice: number) => {
    setData(prev => ({
      ...prev,
      tokenPrices: {
        ...prev.tokenPrices,
        [songId]: newPrice
      }
    }))
  }, [])

  const incrementPlayCount = useCallback(async (songId: string) => {
    setData(prev => ({
      ...prev,
      playCounts: {
        ...prev.playCounts,
        [songId]: (prev.playCounts[songId] || 0) + 1
      }
    }))
    // Record in DB
    try {
      await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'play', song_id: songId })
      })
    } catch (e) { console.error(e) }
  }, [])

  const addActivity = useCallback(async (activity: Omit<ActivityItem, 'id' | 'created_at'>) => {
    // Optimistic UI update
    const newActivity: ActivityItem = {
      ...activity,
      id: "temp-" + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    }
    
    setData(prev => ({
      ...prev,
      recentActivity: [newActivity, ...prev.recentActivity.slice(0, 19)]
    }))

    // Persist to DB
    try {
      await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      })
    } catch (e) {
      console.error("Failed to persist activity:", e)
    }
  }, [])

  useEffect(() => {
    fetchActivity()
    
    // Refresh activity every 30 seconds
    const activityRefreshInterval = setInterval(fetchActivity, 30000)

    // Simulate realtime price updates
    const priceInterval = setInterval(() => {
      const songIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      const randomSongId = songIds[Math.floor(Math.random() * songIds.length)]
      const priceChange = (Math.random() - 0.5) * 0.2
      const basePrice = 2.5
      const newPrice = Math.max(0.1, basePrice + priceChange)
      updateTokenPrice(randomSongId, newPrice)
    }, 5000)

    // Simulate active listeners count
    const listenersInterval = setInterval(() => {
      setData(prev => ({
        ...prev,
        activeListeners: Math.floor(Math.random() * 500) + 100
      }))
    }, 10000)

    return () => {
      clearInterval(activityRefreshInterval)
      clearInterval(priceInterval)
      clearInterval(listenersInterval)
    }
  }, [fetchActivity, updateTokenPrice])

  return {
    ...data,
    updateTokenPrice,
    incrementPlayCount,
    addActivity,
    refreshActivity: fetchActivity
  }
}