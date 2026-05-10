import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

export async function GET(req: NextRequest) {
  try {
    // 1. Try fetching from listings
    try {
      const { data: listings, error } = await supabase
        .from('listings')
        .select('*, songs(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (!error && listings && listings.length > 0) {
        return NextResponse.json({ success: true, listings })
      }
    } catch (e: any) {
      if (!e.message?.includes('fetch failed')) {
        console.warn('Listings fetch failed:', e)
      }
    }

    // 2. Try fetching from songs
    try {
      const { data: songs, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!songsError && songs && songs.length > 0) {
        const fallbackListings = songs.map(song => ({
          id: `fb-${song.id}`,
          price_microalgo: (song.initial_price || 0) * 1_000_000,
          songs: song,
          is_active: true
        }))
        return NextResponse.json({ success: true, listings: fallbackListings })
      }
    } catch (e: any) {
      if (!e.message?.includes('fetch failed')) {
        console.warn('Songs fetch failed:', e)
      }
    }

    // 3. Absolute Fallback: Return Mock Data to prevent 500 HTML
    const mockListings = [
      {
        id: "mock-1",
        price_microalgo: 2500000,
        is_active: true,
        songs: {
          id: "m1",
          title: "Midnight Dreams (Demo)",
          artist: "Luna Wave",
          cover_art: "/abstract-music-album-cover-purple.jpg",
          market_cap: 125000,
          change_24h: 15.3,
          holders: 234,
          ticker: "MDNT",
        }
      },
      {
        id: "mock-2",
        price_microalgo: 1800000,
        is_active: true,
        songs: {
          id: "m2",
          title: "Electric Pulse (Demo)",
          artist: "Neon Beats",
          cover_art: "/electronic-music-cover-cyan.jpg",
          market_cap: 89000,
          change_24h: -5.2,
          holders: 189,
          ticker: "ELEC",
        }
      }
    ]

    return NextResponse.json({ success: true, listings: mockListings, isMock: true })
  } catch (error) {
    console.error('Marketplace critical failure:', error)
    // If even our JSON return fails, Next.js handles it, but this should be safe.
    return NextResponse.json({ 
      success: false, 
      listings: [], 
      error: 'Internal Server Error',
      details: String(error)
    }, { status: 200 }) // Return 200 with error so frontend can parse JSON
  }
}
