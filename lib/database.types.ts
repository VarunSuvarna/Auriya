export interface Song {
  id: string
  title: string
  artist: string
  ticker: string
  audio_url: string
  cover_art: string
  total_supply: number
  initial_price: number
  royalty_percentage: number
  virtual_algo_reserve: number
  virtual_token_reserve: number
  real_algo_raised: number
  holders: number
  description?: string
  genre?: string
  duration?: string
  on_chain_asset_id?: number
  stem_id?: string
  creator_address: string
  created_at: string
}

export interface Activity {
  id: string
  type: 'mint' | 'trade' | 'play' | 'like' | 'purchase'
  song_id?: string
  user_address?: string
  artist?: string
  song_title?: string
  user?: string
  transaction_id?: string
  created_at: string
}

export interface User {
  id: string
  wallet_address: string
  username?: string
  display_name?: string
  avatar_url?: string
  bio?: string
  website?: string
  twitter?: string
  is_artist: boolean
  created_at: string
}

export interface Stem {
  id: string
  title: string
  creator_address: string
  audio_url: string
  type: string
  file_size: number
  on_chain_id?: string
  metadata?: any
  created_at: string
}

export interface Recipe {
  id: string
  title: string
  creator_address: string
  description?: string
  audio_url?: string
  on_chain_id?: string
  created_at: string
}