import { supabase } from '../lib/supabase';
import { BaseRepository } from './base.repository';
import { Database } from '../types/supabase';

type Book = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];
type BookUpdate = Database['public']['Tables']['books']['Update'];

export class BookRepository extends BaseRepository<Book, BookInsert, BookUpdate> {
  constructor() {
    super('books');
  }

  /**
   * Get books by author ID
   */
  async getByAuthorId(authorId: string): Promise<Book[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('author_id', authorId);

    if (error) {
      console.error('Error fetching books by author ID:', error);
      throw error;
    }

    return data as Book[];
  }

  /**
   * Get published books
   */
  async getPublished(): Promise<Book[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .not('published_at', 'is', null);

    if (error) {
      console.error('Error fetching published books:', error);
      throw error;
    }

    return data as Book[];
  }

  /**
   * Get books with chat enabled
   */
  async getWithChatEnabled(): Promise<Book[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('has_chat_enabled', true);

    if (error) {
      console.error('Error fetching books with chat enabled:', error);
      throw error;
    }

    return data as Book[];
  }

  /**
   * Get books with audio
   */
  async getWithAudio(): Promise<Book[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('has_audio', true);

    if (error) {
      console.error('Error fetching books with audio:', error);
      throw error;
    }

    return data as Book[];
  }

  /**
   * Get books by tag
   */
  async getByTag(tag: string): Promise<Book[]> {
    const { data, error } = await supabase
      .from('book_tags')
      .select('book_id')
      .eq('tag', tag);

    if (error) {
      console.error('Error fetching book IDs by tag:', error);
      throw error;
    }

    const bookIds = data.map(item => item.book_id);
    
    if (bookIds.length === 0) {
      return [];
    }

    const { data: books, error: booksError } = await supabase
      .from(this.tableName)
      .select('*')
      .in('id', bookIds);

    if (booksError) {
      console.error('Error fetching books by IDs:', booksError);
      throw booksError;
    }

    return books as Book[];
  }
}
