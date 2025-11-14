import { useState, useEffect, useCallback } from 'react'

// Realtime hook for managing live data

interface RealtimeData {
  tokenPrices: { [key: string]: number }
  playCounts: { [key: string]: number }
  activeListeners: number
  recentActivity: ActivityItem[]
}

interface ActivityItem {
  id: string
  type: 'play' | 'purchase' | 'like'
  song_title: string
  artist: string
  user: string
  created_at: string
}

export function useRealtime() {
  const [data, setData] = useState<RealtimeData>({
    tokenPrices: {},
    playCounts: {},
    activeListeners: 0,
    recentActivity: []
  })

  const updateTokenPrice = useCallback((songId: string, newPrice: number) => {
    setData(prev => ({
      ...prev,
      tokenPrices: {
        ...prev.tokenPrices,
        [songId]: newPrice
      }
    }))
  }, [])

  const incrementPlayCount = useCallback((songId: string) => {
    setData(prev => ({
      ...prev,
      playCounts: {
        ...prev.playCounts,
        [songId]: (prev.playCounts[songId] || 0) + 1
      }
    }))
  }, [])

  const addActivity = useCallback((activity: Omit<ActivityItem, 'id' | 'created_at'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    }
    
    setData(prev => ({
      ...prev,
      recentActivity: [newActivity, ...prev.recentActivity.slice(0, 9)]
    }))
  }, [])

  useEffect(() => {
    // Simulate realtime price updates
    const priceInterval = setInterval(() => {
      const songIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      const randomSongId = songIds[Math.floor(Math.random() * songIds.length)]
      const priceChange = (Math.random() - 0.5) * 0.2 // ±10% change
      const basePrice = 2.5
      const newPrice = Math.max(0.1, basePrice + priceChange)
      updateTokenPrice(randomSongId, newPrice)
    }, 3000)

    // Simulate active listeners count
    const listenersInterval = setInterval(() => {
      setData(prev => ({
        ...prev,
        activeListeners: Math.floor(Math.random() * 500) + 100
      }))
    }, 5000)

    // Simulate random activity
    const activityInterval = setInterval(() => {
      const activities = [
        { type: 'play' as const, song_title: 'Chill Vibes', artist: 'Lo-Fi Dreams', user: 'User' + Math.floor(Math.random() * 1000) },
        { type: 'purchase' as const, song_title: 'Electronic Dreams', artist: 'Synth Master', user: 'User' + Math.floor(Math.random() * 1000) },
        { type: 'like' as const, song_title: 'Ocean Waves', artist: 'Nature Sounds', user: 'User' + Math.floor(Math.random() * 1000) }
      ]
      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      addActivity(randomActivity)
    }, 4000)

    return () => {
      clearInterval(priceInterval)
      clearInterval(listenersInterval)
      clearInterval(activityInterval)
    }
  }, [updateTokenPrice, addActivity])

  return {
    ...data,
    updateTokenPrice,
    incrementPlayCount,
    addActivity
  }
}