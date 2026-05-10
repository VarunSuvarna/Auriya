-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    wallet_address TEXT UNIQUE,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    twitter TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create songs table
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    ticker TEXT,
    description TEXT,
    cover_art TEXT,
    audio_url TEXT NOT NULL,
    duration TEXT,
    genre TEXT,
    creator_id UUID REFERENCES public.profiles(id),
    creator_address TEXT,
    on_chain_asset_id BIGINT,
    initial_price DECIMAL,
    current_price DECIMAL,
    total_supply BIGINT,
    royalty_percentage DECIMAL,
    market_cap DECIMAL DEFAULT 0,
    change_24h DECIMAL DEFAULT 0,
    holders INTEGER DEFAULT 0,
    virtual_algo_reserve DECIMAL,
    virtual_token_reserve DECIMAL,
    real_algo_raised DECIMAL DEFAULT 0,
    graduated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on songs
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Create stems table
CREATE TABLE IF NOT EXISTS public.stems (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    song_id UUID REFERENCES public.songs(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    type TEXT, -- e.g., 'drums', 'vocals', 'bass'
    creator_id UUID REFERENCES public.profiles(id),
    creator_address TEXT,
    on_chain_stem_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on stems
ALTER TABLE public.stems ENABLE ROW LEVEL SECURITY;

-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_art TEXT,
    creator_id UUID REFERENCES public.profiles(id),
    on_chain_recipe_id BIGINT,
    metadata_uri TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on recipes
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Create recipe_stems join table
CREATE TABLE IF NOT EXISTS public.recipe_stems (
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    stem_id UUID REFERENCES public.stems(id) ON DELETE CASCADE,
    weight DECIMAL NOT NULL, -- percentage contribution
    PRIMARY KEY (recipe_id, stem_id)
);

-- Enable RLS on recipe_stems
ALTER TABLE public.recipe_stems ENABLE ROW LEVEL SECURITY;

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'mint', 'trade', 'transfer', 'stake'
    song_id UUID REFERENCES public.songs(id) ON DELETE SET NULL,
    user_address TEXT,
    user_id UUID REFERENCES public.profiles(id),
    amount DECIMAL,
    price DECIMAL,
    song_title TEXT,
    artist TEXT,
    user TEXT,
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, song_id)
);

-- Enable RLS on likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create follows table
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- Enable RLS on follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic examples, need to be refined based on auth)

-- Profiles: Anyone can read, only user can update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Songs: Anyone can read, anyone can create (for now, refine later), only creator can update
CREATE POLICY "Songs are viewable by everyone" ON public.songs FOR SELECT USING (true);
CREATE POLICY "Anyone can create songs" ON public.songs FOR INSERT WITH CHECK (true);
CREATE POLICY "Creators can update own songs" ON public.songs FOR UPDATE USING (auth.uid() = creator_id);

-- Stems: Anyone can read, only creator can update
CREATE POLICY "Stems are viewable by everyone" ON public.stems FOR SELECT USING (true);
CREATE POLICY "Creators can update own stems" ON public.stems FOR UPDATE USING (auth.uid() = creator_id);

-- Activities: Anyone can read, system can insert
CREATE POLICY "Activities are viewable by everyone" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Anyone can insert activities" ON public.activities FOR INSERT WITH CHECK (true);
