import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const artist = formData.get('artist') as string
    const ticker = formData.get('ticker') as string
    const supply = formData.get('supply') as string
    const price = formData.get('price') as string
    const royalties = formData.get('royalties') as string
    const audioFile = formData.get('audioFile') as File
    const coverArt = formData.get('coverArt') as File

    // Upload to Supabase Storage
    const audioPath = `audio/${Date.now()}-${audioFile.name}`
    const coverPath = `covers/${Date.now()}-${coverArt.name}`

    const { error: audioError } = await supabase.storage
      .from('music')
      .upload(audioPath, audioFile)

    const { error: coverError } = await supabase.storage
      .from('music')
      .upload(coverPath, coverArt)

    if (audioError || coverError) {
      throw new Error('Upload failed')
    }

    // Get public URLs
    const { data: audioUrl } = supabase.storage.from('music').getPublicUrl(audioPath)
    const { data: coverUrl } = supabase.storage.from('music').getPublicUrl(coverPath)

    // Create song record
    const { data: song, error: dbError } = await supabase
      .from('songs')
      .insert({
        title,
        artist,
        ticker,
        audio_url: audioUrl.publicUrl,
        cover_art: coverUrl.publicUrl,
        total_supply: parseInt(supply),
        initial_price: parseFloat(price),
        royalty_percentage: parseFloat(royalties),
        virtual_algo_reserve: 30,
        virtual_token_reserve: parseInt(supply),
        real_algo_raised: 0,
        holders: 0,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({ success: true, song })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
