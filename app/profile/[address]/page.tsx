"use client"

import { use, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Music, Users, Globe, Twitter, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { SongCard } from "@/components/song-card"

export default function PublicProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params)
  const [profile, setProfile] = useState<any>(null)
  const [songs, setSongs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Profile
        const profRes = await fetch(`/api/profile?address=${address}`)
        const profData = await profRes.json()
        if (profData.success) setProfile(profData.profile)

        // Fetch Songs
        const songsRes = await fetch(`/api/songs?artistAddress=${address}`)
        const songsData = await songsRes.json()
        if (Array.isArray(songsData)) setSongs(songsData)
      } catch (error) {
        console.error("Failed to load profile data", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [address])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#15b9b7]" />
      </div>
    )
  }

  const displayName = profile?.display_name || profile?.username || `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <div className="container mx-auto px-6 py-8 pb-20">
      <Link href="/">
        <Button variant="ghost" className="mb-8 gap-2 text-[#15b9b7] hover:bg-[#15b9b7]/10">
          <ArrowLeft className="h-4 w-4" />
          Back to Discovery
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-[#15b9b7] to-[#002a4a] overflow-hidden border-2 border-[#15b9b7]/30 shadow-2xl">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} className="w-full h-full object-cover" alt={displayName} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white/20">
              {displayName[0]}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white font-space-grotesk">{displayName}</h1>
              <p className="text-gray-400 font-mono text-sm">{address}</p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-white px-8">Follow</Button>
            </div>
          </div>

          <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">
            {profile?.bio || "This artist hasn't added a bio yet. Stay tuned for more musical drops!"}
          </p>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <Music className="h-4 w-4 text-[#15b9b7]" />
               <span>{songs.length} Tracks</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <Users className="h-4 w-4 text-[#15b9b7]" />
               <span>0 Followers</span>
            </div>
            {profile?.website && (
              <a href={profile.website} target="_blank" className="text-gray-400 hover:text-[#15b9b7]">
                <Globe className="h-4 w-4" />
              </a>
            )}
            {profile?.twitter && (
              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" className="text-gray-400 hover:text-[#15b9b7]">
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white border-b border-[#15b9b7]/20 pb-4">Released Tracks</h2>
        
        {songs.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-gray-500">No tracks released yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {songs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
