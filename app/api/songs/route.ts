import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const artistAddress = searchParams.get('artistAddress')

    let query = supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (artistAddress) {
      query = query.eq('creator_address', artistAddress)
    }

    const { data: songs, error } = await query

    // Transform data for frontend
    const transformedSongs = songs?.map(song => {
      const virtualAlgo = Number(song.virtual_algo_reserve || 30)
      const virtualToken = Number(song.virtual_token_reserve || 1000000)
      const currentPrice = song.current_price || (virtualAlgo / virtualToken)

      return {
        id: song.id,
        title: song.title,
        artist: song.artist,
        coverArt: song.cover_art?.startsWith('/') || song.cover_art?.startsWith('http') ? song.cover_art : `/${song.cover_art}`,
        audioUrl: song.audio_url,
        price: currentPrice || song.initial_price || 0.001,
        marketCap: song.market_cap || (currentPrice * 1000000),
        change24h: song.change_24h || 0,
        holders: song.holders || 1,
        ticker: song.ticker,
        duration: song.duration || "3:30",
        genre: song.genre || "Electronic",
        description: song.description,
        creatorId: song.creator_id,
        creatorAddress: song.creator_address,
        onChainAssetId: song.on_chain_asset_id,
        virtualAlgoReserve: virtualAlgo,
        virtualTokenReserve: virtualToken,
        realAlgoRaised: song.real_algo_raised,
        graduated: song.graduated || false,
        createdAt: song.created_at
      }
    })

    return NextResponse.json(transformedSongs || [])
  } catch (error: any) {
    if (!error.message?.includes('fetch failed')) {
      console.error('Error fetching songs:', error)
    }
    return NextResponse.json([])
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
        description: songData.description,
        cover_art: songData.coverArt || songData.cover_art,
        audio_url: songData.audioUrl || songData.audio_url,
        duration: songData.duration,
        genre: songData.genre,
        initial_price: songData.price || songData.initial_price,
        current_price: songData.price || songData.current_price,
        total_supply: songData.supply || songData.total_supply,
        royalty_percentage: songData.royalties || songData.royalty_percentage,
        creator_id: songData.creatorId,
        creator_address: songData.creatorAddress,
        on_chain_asset_id: songData.onChainAssetId,
        virtual_algo_reserve: songData.virtualAlgoReserve || 30,
        virtual_token_reserve: songData.virtualTokenReserve || 1000000,
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