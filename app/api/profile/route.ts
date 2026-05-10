import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')
  if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 })

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', address)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return NextResponse.json({ success: true, profile: profile || null })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { wallet_address, username, display_name, bio, avatar_url, twitter, website } = body

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert({
        wallet_address,
        username,
        display_name,
        bio,
        avatar_url,
        twitter,
        website,
        updated_at: new Date().toISOString()
      }, { onConflict: 'wallet_address' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, profile })
  } catch (error: any) {
    console.error('Profile Update Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
