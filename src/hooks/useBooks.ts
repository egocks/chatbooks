import { useState, useEffect } from 'react';
import { bookService, BookWithChapters, BookFilters } from '../services/book.service';

export function useBooks(filters: BookFilters = {}) {
  const [books, setBooks] = useState<BookWithChapters[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBooks = await bookService.getBooks(filters);
        setBooks(fetchedBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [JSON.stringify(filters)]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBooks = await bookService.getBooks(filters);
      setBooks(fetchedBooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  return { books, loading, error, refetch };
}

export function useBook(id: string | null) {
  const [book, setBook] = useState<BookWithChapters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setBook(null);
      setLoading(false);
      return;
    }

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBook = await bookService.getBookById(id);
        setBook(fetchedBook);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch book');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
}