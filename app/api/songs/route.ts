import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET() {
  try {
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform data for frontend
    const transformedSongs = songs?.map(song => ({
      id: song.id.toString(),
      title: song.title,
      artist: song.artist,
      coverArt: song.cover_art,
      audioUrl: song.audio_url,
      price: song.current_price || song.initial_price,
      marketCap: song.market_cap || 0,
      change24h: song.change_24h || 0,
      holders: song.holders || 0,
      ticker: song.ticker,
      duration: song.duration || "3:45",
      genre: song.genre || "Electronic",
      virtualAlgoReserve: song.virtual_algo_reserve,
      virtualTokenReserve: song.virtual_token_reserve,
      realAlgoRaised: song.real_algo_raised,
      graduated: song.graduated || false
    }))

    return NextResponse.json(transformedSongs || [])
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const songData = await req.json()
    
    const { data: song, error } = await supabase
      .from('songs')
      .insert({
        title: songData.title,
        artist: songData.artist,
        ticker: songData.ticker,
        cover_art: songData.cover_art,
        audio_url: songData.audio_url,
        initial_price: songData.price,
        current_price: songData.price,
        market_cap: songData.market_cap,
        change_24h: songData.change_24h,
        holders: songData.holders,
        duration: songData.duration,
        genre: songData.genre,
        description: songData.description,
        virtual_algo_reserve: 30, // 30 ALGO initial
        virtual_token_reserve: 1000000000, // 1B tokens
        real_algo_raised: 0,
        graduated: false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, song })
  } catch (error) {
    console.error('Error creating song:', error)
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 })
  }
}