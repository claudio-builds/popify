import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          plan: 'free' | 'pro' | 'business'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          plan?: 'free' | 'pro' | 'business'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          plan?: 'free' | 'pro' | 'business'
          created_at?: string
        }
      }
      sites: {
        Row: {
          id: string
          user_id: string
          name: string
          domain: string
          api_key: string
          settings: {
            position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
            theme: 'light' | 'dark'
            showAvatar: boolean
            duration: number
            delay: number
          }
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          domain: string
          api_key?: string
          settings?: object
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          domain?: string
          api_key?: string
          settings?: object
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          site_id: string
          type: 'purchase' | 'signup' | 'review' | 'custom'
          name: string
          location: string | null
          action: string
          item: string
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          type: 'purchase' | 'signup' | 'review' | 'custom'
          name: string
          location?: string | null
          action: string
          item: string
          created_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          type?: 'purchase' | 'signup' | 'review' | 'custom'
          name?: string
          location?: string | null
          action?: string
          item?: string
          created_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          site_id: string
          impressions: number
          clicks: number
          date: string
        }
        Insert: {
          id?: string
          site_id: string
          impressions?: number
          clicks?: number
          date?: string
        }
        Update: {
          id?: string
          site_id?: string
          impressions?: number
          clicks?: number
          date?: string
        }
      }
    }
  }
}
