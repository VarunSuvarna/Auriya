import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { songId, type, algoAmount, tokenAmount, walletAddress } = await req.json()

    const { data: song } = await supabase
      .from('songs')
      .select('*')
      .eq('id', songId)
      .single()

    if (!song) throw new Error('Song not found')

    const algo = parseFloat(algoAmount)
    const tokens = parseFloat(tokenAmount)
    const royaltyRate = song.royalty_percentage / 100

    if (type === 'buy') {
      const netAlgo = algo * (1 - royaltyRate)
      const newVirtualAlgo = song.virtual_algo_reserve + netAlgo
      const newVirtualTokens = (song.virtual_algo_reserve * song.virtual_token_reserve) / newVirtualAlgo
      const tokensReceived = song.virtual_token_reserve - newVirtualTokens

      await supabase
        .from('songs')
        .update({
          virtual_algo_reserve: newVirtualAlgo,
          virtual_token_reserve: newVirtualTokens,
          real_algo_raised: song.real_algo_raised + netAlgo,
          holders: song.holders + 1,
        })
        .eq('id', songId)

      await supabase.from('transactions').insert({
        song_id: songId,
        wallet_address: walletAddress,
        type: 'buy',
        algo_amount: algo,
        token_amount: tokensReceived,
        price: algo / tokensReceived,
      })

      return NextResponse.json({ success: true, tokensReceived })
    } else {
      const newVirtualTokens = song.virtual_token_reserve + tokens
      const newVirtualAlgo = (song.virtual_algo_reserve * song.virtual_token_reserve) / newVirtualTokens
      const algoReceived = (song.virtual_algo_reserve - newVirtualAlgo) * (1 - royaltyRate)

      await supabase
        .from('songs')
        .update({
          virtual_algo_reserve: newVirtualAlgo,
          virtual_token_reserve: newVirtualTokens,
          real_algo_raised: song.real_algo_raised - algoReceived,
        })
        .eq('id', songId)

      await supabase.from('transactions').insert({
        song_id: songId,
        wallet_address: walletAddress,
        type: 'sell',
        algo_amount: algoReceived,
        token_amount: tokens,
        price: algoReceived / tokens,
      })

      return NextResponse.json({ success: true, algoReceived })
    }
  } catch (error) {
    console.error('Trade error:', error)
    return NextResponse.json({ error: 'Trade failed' }, { status: 500 })
  }
}
