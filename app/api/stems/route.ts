import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const songId = searchParams.get('songId')
    const creatorAddress = searchParams.get('creatorAddress')

    let query = supabase.from('stems').select('*')

    if (songId) {
      query = query.eq('song_id', songId)
    } else if (creatorAddress) {
      query = query.eq('creator_address', creatorAddress)
    }

    const { data: stems, error } = await query

    if (error) throw error

    return NextResponse.json(stems || [])
  } catch (error: any) {
    console.error('Error fetching stems:', error)
    return NextResponse.json({ error: 'Failed to fetch stems' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const stemData = await req.json()

    const { data: stem, error } = await supabase
      .from('stems')
      .insert({
        song_id: stemData.songId,
        title: stemData.title,
        audio_url: stemData.audioUrl,
        type: stemData.type,
        creator_id: stemData.creatorId,
        creator_address: stemData.creatorAddress,
        on_chain_stem_id: stemData.onChainStemId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, stem })
  } catch (error: any) {
    console.error('Error creating stem:', error)
    return NextResponse.json({ error: 'Failed to create stem' }, { status: 500 })
  }
}
