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
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'author' | 'reader' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'author' | 'reader' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'author' | 'reader' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author_id: string
          cover_url: string | null
          description: string
          has_audio: boolean
          has_chat_enabled: boolean
          published_at: string | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author_id: string
          cover_url?: string | null
          description: string
          has_audio?: boolean
          has_chat_enabled?: boolean
          published_at?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author_id?: string
          cover_url?: string | null
          description?: string
          has_audio?: boolean
          has_chat_enabled?: boolean
          published_at?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          book_id: string
          title: string
          content: string
          audio_url: string | null
          chat_enabled: boolean
          exclusive_chat: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          title: string
          content: string
          audio_url?: string | null
          chat_enabled?: boolean
          exclusive_chat?: boolean
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          title?: string
          content?: string
          audio_url?: string | null
          chat_enabled?: boolean
          exclusive_chat?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          chapter_id: string
          type: 'text' | 'audio' | 'chat'
          position: number
          content: string | null
          timestamp: number | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chapter_id: string
          type: 'text' | 'audio' | 'chat'
          position: number
          content?: string | null
          timestamp?: number | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chapter_id?: string
          type?: 'text' | 'audio' | 'chat'
          position?: number
          content?: string | null
          timestamp?: number | null
          note?: string | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          chapter_id: string
          type: 'user' | 'bot'
          content: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chapter_id: string
          type: 'user' | 'bot'
          content: string
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chapter_id?: string
          type?: 'user' | 'bot'
          content?: string
          timestamp?: string
          created_at?: string
        }
      }
      reading_sessions: {
        Row: {
          id: string
          user_id: string
          book_id: string
          current_chapter: number
          mode: 'text' | 'audio' | 'chat'
          position: number
          last_accessed: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          current_chapter: number
          mode: 'text' | 'audio' | 'chat'
          position: number
          last_accessed: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          current_chapter?: number
          mode?: 'text' | 'audio' | 'chat'
          position?: number
          last_accessed?: string
          created_at?: string
          updated_at?: string
        }
      }
      book_tags: {
        Row: {
          id: string
          book_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          tag?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
