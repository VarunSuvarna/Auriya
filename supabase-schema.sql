-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Songs table
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  cover_art TEXT,
  audio_url TEXT,
  price DECIMAL(10,6) DEFAULT 0,
  market_cap BIGINT DEFAULT 0,
  change_24h DECIMAL(5,2) DEFAULT 0,
  holders INTEGER DEFAULT 0,
  ticker VARCHAR(10),
  duration VARCHAR(10),
  genre VARCHAR(50),
  description TEXT,
  nft_asset_id BIGINT,
  token_asset_id BIGINT,
  ipfs_hash VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address VARCHAR(58) UNIQUE NOT NULL,
  username VARCHAR(50),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('mint', 'trade', 'transfer', 'stake')),
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  user_address VARCHAR(58) NOT NULL,
  amount DECIMAL(20,6),
  price DECIMAL(10,6),
  transaction_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token holders table
CREATE TABLE token_holders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  user_address VARCHAR(58) NOT NULL,
  amount DECIMAL(20,6) NOT NULL,
  percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(song_id, user_address)
);

-- Trades table
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  buyer_address VARCHAR(58) NOT NULL,
  seller_address VARCHAR(58) NOT NULL,
  amount DECIMAL(20,6) NOT NULL,
  price DECIMAL(10,6) NOT NULL,
  total_value DECIMAL(20,6) NOT NULL,
  transaction_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);