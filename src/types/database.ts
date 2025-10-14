export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      wedding_tables: {
        Row: {
          id: string
          name: string
          address: string
          unique_code: string
          latitude: number
          longitude: number
          created_at: string
          icon_filename: string | null
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          address: string
          unique_code: string
          latitude: number
          longitude: number
          created_at?: string
          icon_filename?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string
          unique_code?: string
          latitude?: number
          longitude?: number
          created_at?: string
          icon_filename?: string | null
          description?: string | null
        }
      }
      user_preferences: {
        Row: {
          email: string
          meeple_color: string
          meeple_style?: '3d' | 'flat' | 'bride' | 'groom' | string | null
          display_name: string | null
          current_location_id: string | null
          updated_at: string
        }
        Insert: {
          email: string
          meeple_color: string
          meeple_style?: string | null
          display_name?: string | null
          current_location_id?: string | null
          updated_at?: string
        }
        Update: {
          email?: string
          meeple_color?: string
          meeple_style?: string | null
          display_name?: string | null
          current_location_id?: string | null
          updated_at?: string
        }
      }
      guest_checkins: {
        Row: {
          id: string
          table_id: string
          guest_email: string
          guest_name: string
          message: string | null
          checked_in_at: string
        }
        Insert: {
          id?: string
          table_id: string
          guest_email: string
          guest_name: string
          message?: string | null
          checked_in_at?: string
        }
        Update: {
          id?: string
          table_id?: string
          guest_email?: string
          guest_name?: string
          message?: string | null
          checked_in_at?: string
        }
      }
      message_reads: {
        Row: {
          id: string
          reader_email: string
          checkin_id: string
          read_at: string
        }
        Insert: {
          id?: string
          reader_email: string
          checkin_id: string
          read_at?: string
        }
        Update: {
          id?: string
          reader_email?: string
          checkin_id?: string
          read_at?: string
        }
      }
    }
  }
}

// Convenience types
export type WeddingTable = Database['public']['Tables']['wedding_tables']['Row']
export type GuestCheckin = Database['public']['Tables']['guest_checkins']['Row']
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type MessageRead = Database['public']['Tables']['message_reads']['Row']
export type NewWeddingTable = Database['public']['Tables']['wedding_tables']['Insert']
export type NewGuestCheckin = Database['public']['Tables']['guest_checkins']['Insert']
export type NewUserPreferences = Database['public']['Tables']['user_preferences']['Insert']
export type NewMessageRead = Database['public']['Tables']['message_reads']['Insert']
