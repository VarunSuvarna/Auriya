import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import algosdk from 'algosdk'
export const maxDuration = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const STEM_REGISTRY_APP_ID = Number(process.env.NEXT_PUBLIC_STEM_REGISTRY_APP_ID || 0)

async function registerStemOnChain(params: {
  title: string
  contributor: string
  royaltyBps: number
  metadataUri: string
}) {
  const creatorMnemonic = process.env.ALGORAND_CREATOR_MNEMONIC
  if (!creatorMnemonic || !STEM_REGISTRY_APP_ID) {
    return { registered: false as const }
  }

  const algodServer = process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud'
  const algodToken = process.env.ALGOD_TOKEN || ''
  const algodPort = Number(process.env.ALGOD_PORT || 443)

  const creator = algosdk.mnemonicToSecretKey(creatorMnemonic)
  const algod = new algosdk.Algodv2(algodToken, algodServer, algodPort)
  const suggested = await algod.getTransactionParams().do()

  // Construct ABI call for register_stem
  const abi = new algosdk.ABIContract({
    name: 'StemRegistry',
    networks: {},
    methods: [
      {
        name: 'register_stem',
        args: [
          { type: 'string', name: 'metadata_uri' },
          { type: 'address', name: 'contributor' },
          { type: 'uint64', name: 'royalty_bps' }
        ],
        returns: { type: 'uint64' }
      }
    ]
  })

  const composer = new algosdk.AtomicTransactionComposer()
  composer.addMethodCall({
    appID: STEM_REGISTRY_APP_ID,
    method: abi.getMethodByName('register_stem'),
    methodArgs: [params.metadataUri, params.contributor, params.royaltyBps],
    sender: creator.addr,
    suggestedParams: suggested,
    signer: algosdk.makeBasicAccountTransactionSigner(creator)
  })

  const result = await composer.execute(algod, 4)
  const stemId = result.methodResults[0].returnValue as bigint

  return {
    registered: true as const,
    txId: result.txIDs[0],
    stemId: Number(stemId),
    creatorAddress: creator.addr.toString(),
  }
}

async function maybeMintAlgorandAsa(params: {
  title: string
  ticker: string
  description: string
  coverUrl: string
  audioUrl: string
  supply: number
  mintToken: boolean
}) {
  const creatorMnemonic = process.env.ALGORAND_CREATOR_MNEMONIC
  if (!creatorMnemonic) {
    return { minted: false as const }
  }

  const algodServer = process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud'
  const algodToken = process.env.ALGOD_TOKEN || ''
  const algodPort = Number(process.env.ALGOD_PORT || 443)
  const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet'

  const creator = algosdk.mnemonicToSecretKey(creatorMnemonic)
  const algod = new algosdk.Algodv2(algodToken, algodServer, algodPort)
  const suggested = await algod.getTransactionParams().do()
  const metadata = {
    name: params.title,
    description: params.description,
    image: params.coverUrl,
    animation_url: params.audioUrl,
    properties: {
      standard: "ARC-3",
      kind: "track",
      network,
    },
  }

  const total = params.mintToken ? Math.max(params.supply, 1) : 1
  const decimals = params.mintToken ? 6 : 0
  const unitName = params.ticker?.slice(0, 8) || (params.mintToken ? 'AURIYA' : 'TRK')
  const assetName = params.title.slice(0, 32)
  const assetUrl = `ipfs://CID_PLACEHOLDER` // In a real app, this would be the IPFS URL

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: creator.addr,
    total,
    decimals,
    assetName,
    unitName,
    assetURL: assetUrl,
    defaultFrozen: false,
    manager: creator.addr,
    reserve: creator.addr,
    freeze: creator.addr,
    clawback: creator.addr,
    suggestedParams: suggested,
  })

  const signed = txn.signTxn(creator.sk)
  const { txId } = await algod.sendRawTransaction(signed).do()
  const confirmation = await algosdk.waitForConfirmation(algod, txId, 4)
  const assetId = confirmation['asset-index'] as number | undefined
  return {
    minted: true as const,
    txId,
    assetId: assetId || null,
    creatorAddress: creator.addr.toString(),
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const artist = formData.get('artist') as string
    const ticker = formData.get('ticker') as string
    const supply = formData.get('supply') as string
    const price = formData.get('price') as string
    const royalties = formData.get('royalties') as string
    const description = formData.get('description') as string
    const mintToken = String(formData.get('mintToken')) === 'true'
    const audioFile = formData.get('audioFile') as File
    const coverArt = formData.get('coverArt') as File

    if (!title || !artist || !audioFile || !coverArt) {
      return NextResponse.json({ error: 'Missing required upload fields' }, { status: 400 })
    }

    // Upload to Supabase Storage
    const audioPath = `audio/${Date.now()}-${audioFile.name}`
    const coverPath = `covers/${Date.now()}-${coverArt.name}`

    const { error: audioError } = await supabase.storage
      .from('music')
      .upload(audioPath, audioFile)

    const { error: coverError } = await supabase.storage
      .from('music')
      .upload(coverPath, coverArt)

    if (audioError) {
      console.error('Audio Storage Error:', audioError)
      throw new Error(`Audio upload failed: ${audioError.message}`)
    }
    if (coverError) {
      console.error('Cover Storage Error:', coverError)
      throw new Error(`Cover art upload failed: ${coverError.message}`)
    }

    // Get public URLs
    const { data: audioUrl } = supabase.storage.from('music').getPublicUrl(audioPath)
    const { data: coverUrl } = supabase.storage.from('music').getPublicUrl(coverPath)

    const parsedSupply = parseInt(supply || '1')
    const safeSupply = Number.isFinite(parsedSupply) && parsedSupply > 0 ? parsedSupply : 1
    const royaltyBps = Math.floor(parseFloat(royalties || '10') * 100)

    const userAddress = formData.get('userAddress') as string

    // Parallel: ASA Minting + Stem Registration
    const [onChain, stemRegistration] = await Promise.all([
      maybeMintAlgorandAsa({
        title,
        ticker,
        description: description || '',
        coverUrl: coverUrl.publicUrl,
        audioUrl: audioUrl.publicUrl,
        supply: safeSupply,
        mintToken,
      }),
      registerStemOnChain({
        title,
        contributor: userAddress || "CREATOR_ADDR_PLACEHOLDER", // Use user address from frontend
        royaltyBps,
        metadataUri: audioUrl.publicUrl // Use audio URL as metadata placeholder
      })
    ])

    const { data: song, error: dbError } = await supabase
      .from('songs')
      .insert({
        title,
        artist,
        ticker,
        audio_url: audioUrl.publicUrl,
        cover_art: coverUrl.publicUrl,
        total_supply: safeSupply,
        initial_price: parseFloat(price),
        royalty_percentage: parseFloat(royalties),
        virtual_algo_reserve: 30,
        virtual_token_reserve: safeSupply,
        real_algo_raised: 0,
        holders: 0,
        description: description || null,
        on_chain_asset_id: onChain.minted ? onChain.assetId : null,
        stem_id: stemRegistration.registered ? stemRegistration.stemId : null,
        creator_address: userAddress
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database Error:', dbError)
      throw new Error(`Database save failed: ${dbError.message}`)
    }

    return NextResponse.json({ success: true, song, onChain, stemRegistration })
  } catch (error: any) {
    console.error('CRITICAL UPLOAD ERROR:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
