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
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          user_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          user_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          user_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      languages: {
        Row: {
          id: string
          code: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          created_at?: string
        }
      }
      translator_profiles: {
        Row: {
          id: string
          profile_id: string
          bio: string | null
          hourly_rate: number | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          bio?: string | null
          hourly_rate?: number | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          bio?: string | null
          hourly_rate?: number | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      translator_languages: {
        Row: {
          id: string
          translator_id: string
          language_id: string
          proficiency_level: string | null
          created_at: string
        }
        Insert: {
          id?: string
          translator_id: string
          language_id: string
          proficiency_level?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          translator_id?: string
          language_id?: string
          proficiency_level?: string | null
          created_at?: string
        }
      }
      translation_requests: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string | null
          request_type: string
          source_language_id: string
          target_language_id: string
          scheduled_date: string | null
          duration_hours: number | null
          location_type: string | null
          location_details: string | null
          budget: number | null
          status: string
          document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description?: string | null
          request_type: string
          source_language_id: string
          target_language_id: string
          scheduled_date?: string | null
          duration_hours?: number | null
          location_type?: string | null
          location_details?: string | null
          budget?: number | null
          status?: string
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string | null
          request_type?: string
          source_language_id?: string
          target_language_id?: string
          scheduled_date?: string | null
          duration_hours?: number | null
          location_type?: string | null
          location_details?: string | null
          budget?: number | null
          status?: string
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      translation_assignments: {
        Row: {
          id: string
          request_id: string
          translator_id: string
          status: string
          accepted_at: string | null
          completed_at: string | null
          client_rating: number | null
          translator_rating: number | null
          client_review: string | null
          translator_review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          translator_id: string
          status?: string
          accepted_at?: string | null
          completed_at?: string | null
          client_rating?: number | null
          translator_rating?: number | null
          client_review?: string | null
          translator_review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          translator_id?: string
          status?: string
          accepted_at?: string | null
          completed_at?: string | null
          client_rating?: number | null
          translator_rating?: number | null
          client_review?: string | null
          translator_review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}