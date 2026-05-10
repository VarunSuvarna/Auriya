import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { action, songId, amount, userAddress } = await req.json()

    // 1. Get current song state
    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('*')
      .eq('id', songId)
      .single()

    if (fetchError || !song) throw new Error('Song not found')

    const virtualAlgo = Number(song.virtual_algo_reserve)
    const virtualToken = Number(song.virtual_token_reserve)
    
    let newAlgoReserve = virtualAlgo
    let newTokenReserve = virtualToken
    let pricePaid = 0

    if (action === 'buy') {
      // Simple Bonding Curve: k = x * y
      // (algo + dAlgo) * (token - dToken) = k
      // For simplicity, let's assume 'amount' is the number of tokens to buy
      const tokensToBuy = Number(amount)
      if (tokensToBuy >= virtualToken) throw new Error('Not enough tokens in reserve')

      newAlgoReserve = (virtualAlgo * virtualToken) / (virtualToken - tokensToBuy)
      pricePaid = newAlgoReserve - virtualAlgo
      newTokenReserve = virtualToken - tokensToBuy
    } else {
      // Sell logic
      const tokensToSell = Number(amount)
      newAlgoReserve = (virtualAlgo * virtualToken) / (virtualToken + tokensToSell)
      pricePaid = virtualAlgo - newAlgoReserve // This is what the user gets back
      newTokenReserve = virtualToken + tokensToSell
    }

    const newPrice = newAlgoReserve / newTokenReserve

    // 2. Update Database
    const { error: updateError } = await supabase
      .from('songs')
      .update({
        virtual_algo_reserve: newAlgoReserve,
        virtual_token_reserve: newTokenReserve,
        current_price: newPrice,
        holders: song.holders + (action === 'buy' ? 1 : 0) // Simplified
      })
      .eq('id', songId)

    if (updateError) throw updateError

    // 3. Record Activity
    await supabase.from('activities').insert({
      type: action === 'buy' ? 'purchase' : 'trade',
      song_id: songId,
      user_address: userAddress,
      amount: Number(amount),
      price: newPrice,
      song_title: song.title,
      artist: song.artist
    })

    return NextResponse.json({ 
      success: true, 
      newPrice,
      pricePaid
    })

  } catch (error: any) {
    console.error('Trade Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
