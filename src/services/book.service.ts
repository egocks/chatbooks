import { supabase } from '../lib/supabase';
import { BookRepository } from '../repositories/book.repository';
import { ChapterRepository } from '../repositories/chapter.repository';
import { Database } from '../types/supabase';

type Book = Database['public']['Tables']['books']['Row'];
type Chapter = Database['public']['Tables']['chapters']['Row'];

export interface BookWithChapters extends Book {
  chapters: Chapter[];
  tags: string[];
}

export interface BookFilters {
  authorId?: string;
  hasAudio?: boolean;
  hasChatEnabled?: boolean;
  published?: boolean;
  tags?: string[];
  search?: string;
}

class BookService {
  private bookRepository = new BookRepository();
  private chapterRepository = new ChapterRepository();

  /**
   * Get books with filters and pagination
   */
  async getBooks(filters: BookFilters = {}, limit = 20, offset = 0): Promise<BookWithChapters[]> {
    try {
      let query = supabase
        .from('books')
        .select(`
          *,
          chapters (
            id,
            title,
            content,
            audio_url,
            chat_enabled,
            exclusive_chat,
            order_index,
            created_at,
            updated_at
          ),
          book_tags (
            tag
          )
        `)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.authorId) {
        query = query.eq('author_id', filters.authorId);
      }

      if (filters.hasAudio !== undefined) {
        query = query.eq('has_audio', filters.hasAudio);
      }

      if (filters.hasChatEnabled !== undefined) {
        query = query.eq('has_chat_enabled', filters.hasChatEnabled);
      }

      if (filters.published !== undefined) {
        if (filters.published) {
          query = query.not('published_at', 'is', null);
        } else {
          query = query.is('published_at', null);
        }
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to include tags as array
      return (data || []).map(book => ({
        ...book,
        chapters: (book.chapters || []).sort((a, b) => a.order_index - b.order_index),
        tags: (book.book_tags || []).map(tag => tag.tag),
      }));
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  /**
   * Get a single book with all details
   */
  async getBookById(id: string): Promise<BookWithChapters | null> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          chapters (
            id,
            title,
            content,
            audio_url,
            chat_enabled,
            exclusive_chat,
            order_index,
            created_at,
            updated_at
          ),
          book_tags (
            tag
          ),
          users (
            name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return {
        ...data,
        chapters: (data.chapters || []).sort((a, b) => a.order_index - b.order_index),
        tags: (data.book_tags || []).map(tag => tag.tag),
      };
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  /**
   * Create a new book
   */
  async createBook(bookData: {
    title: string;
    description: string;
    authorId: string;
    coverUrl?: string;
    hasAudio?: boolean;
    hasChatEnabled?: boolean;
    tags?: string[];
  }): Promise<string> {
    try {
      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert({
          title: bookData.title,
          description: bookData.description,
          author_id: bookData.authorId,
          cover_url: bookData.coverUrl,
          has_audio: bookData.hasAudio || false,
          has_chat_enabled: bookData.hasChatEnabled || false,
        })
        .select()
        .single();

      if (bookError) throw bookError;

      // Add tags if provided
      if (bookData.tags && bookData.tags.length > 0) {
        const tagInserts = bookData.tags.map(tag => ({
          book_id: book.id,
          tag: tag.toLowerCase(),
        }));

        const { error: tagsError } = await supabase
          .from('book_tags')
          .insert(tagInserts);

        if (tagsError) console.error('Error creating tags:', tagsError);
      }

      return book.id;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  /**
   * Update a book
   */
  async updateBook(id: string, updates: Partial<Book>): Promise<void> {
    try {
      const { error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  /**
   * Publish a book
   */
  async publishBook(id: string): Promise<void> {
    try {
      await this.updateBook(id, {
        published_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error publishing book:', error);
      throw error;
    }
  }

  /**
   * Delete a book
   */
  async deleteBook(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  /**
   * Get published books for readers
   */
  async getPublishedBooks(limit = 20, offset = 0): Promise<BookWithChapters[]> {
    return this.getBooks({ published: true }, limit, offset);
  }

  /**
   * Search books
   */
  async searchBooks(query: string, limit = 20): Promise<BookWithChapters[]> {
    return this.getBooks({ search: query, published: true }, limit, 0);
  }
}

export const bookService = new BookService();