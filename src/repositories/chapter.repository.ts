import { supabase } from '../lib/supabase';
import { BaseRepository } from './base.repository';
import { Database } from '../types/supabase';

type Chapter = Database['public']['Tables']['chapters']['Row'];
type ChapterInsert = Database['public']['Tables']['chapters']['Insert'];
type ChapterUpdate = Database['public']['Tables']['chapters']['Update'];

export class ChapterRepository extends BaseRepository<Chapter, ChapterInsert, ChapterUpdate> {
  constructor() {
    super('chapters');
  }

  /**
   * Get chapters by book ID
   */
  async getByBookId(bookId: string): Promise<Chapter[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('book_id', bookId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching chapters by book ID:', error);
      throw error;
    }

    return data as Chapter[];
  }

  /**
   * Get chapters with chat enabled
   */
  async getWithChatEnabled(bookId: string): Promise<Chapter[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('book_id', bookId)
      .eq('chat_enabled', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching chapters with chat enabled:', error);
      throw error;
    }

    return data as Chapter[];
  }

  /**
   * Get chapters with exclusive chat
   */
  async getWithExclusiveChat(bookId: string): Promise<Chapter[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('book_id', bookId)
      .eq('exclusive_chat', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching chapters with exclusive chat:', error);
      throw error;
    }

    return data as Chapter[];
  }

  /**
   * Get chapters with audio
   */
  async getWithAudio(bookId: string): Promise<Chapter[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('book_id', bookId)
      .not('audio_url', 'is', null)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching chapters with audio:', error);
      throw error;
    }

    return data as Chapter[];
  }
}
