export interface Song {
  id: string
  title: string
  artist: string
  cover_art: string
  audio_url: string
  price: number
  market_cap: number
  change_24h: number
  holders: number
  ticker?: string
  duration: string
  genre: string
  description?: string
  nft_asset_id?: number
  token_asset_id?: number
  ipfs_hash?: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  type: 'mint' | 'trade' | 'transfer' | 'stake'
  song_id: string
  user_address: string
  amount?: number
  price?: number
  transaction_id: string
  created_at: string
}

export interface User {
  id: string
  wallet_address: string
  username?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface TokenHolder {
  id: string
  song_id: string
  user_address: string
  amount: number
  percentage: number
  created_at: string
  updated_at: string
}

export interface Trade {
  id: string
  song_id: string
  buyer_address: string
  seller_address: string
  amount: number
  price: number
  total_value: number
  transaction_id: string
  created_at: string
}