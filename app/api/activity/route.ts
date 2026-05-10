import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

export async function GET() {
  try {
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    // Transform to match frontend expectations
    const transformed = activities?.map(act => ({
      ...act,
      song_title: act.song_title || act.songs?.title || 'Unknown Song',
      artist: act.artist || act.songs?.artist || 'Unknown Artist'
    }))

    return NextResponse.json({ success: true, activities: transformed })
  } catch (error) {
    console.error('Activity fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, song_id, user_address, amount, price, transaction_id, song_title, artist, user } = body

    const { data, error } = await supabase
      .from('activities')
      .insert({
        type,
        song_id,
        user_address,
        amount,
        price,
        transaction_id,
        // We can also store snapshots for performance
        song_title,
        artist,
        user: user || user_address 
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, activity: data })
  } catch (error) {
    console.error('Activity post error:', error)
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 })
  }
}
