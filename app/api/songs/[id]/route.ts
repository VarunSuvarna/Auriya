import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { data: song, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    const virtualAlgo = Number(song.virtual_algo_reserve || 30)
    const virtualToken = Number(song.virtual_token_reserve || 1000000)
    const currentPrice = song.current_price || (virtualAlgo / virtualToken)

    // Map DB fields to frontend expectations
    const transformed = {
      ...song,
      coverArt: song.cover_art?.startsWith('/') || song.cover_art?.startsWith('http') ? song.cover_art : `/${song.cover_art}`,
      audioUrl: song.audio_url,
      marketCap: song.market_cap || (currentPrice * 1000000), // Default to full supply cap
      price: currentPrice || song.initial_price || 0.001,
      holders: song.holders || 1
    }

    return NextResponse.json({ success: true, song: transformed })
  } catch (error: any) {
    console.error('Song fetch error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 404 })
  }
}
