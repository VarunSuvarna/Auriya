import { supabase } from './supabase'
import { Song, Activity } from './database.types'

export const songService = {
  async getAllSongs(): Promise<Song[]> {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getSongById(id: string): Promise<Song | null> {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createSong(song: Omit<Song, 'id' | 'created_at' | 'updated_at'>): Promise<Song> {
    const { data, error } = await supabase
      .from('songs')
      .insert(song)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export const activityService = {
  async getRecentActivity(): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data || []
  },

  async addActivity(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}