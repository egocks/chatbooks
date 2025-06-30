-- Migration: Initial schema for ChatBooks
-- Description: Creates all tables, indexes, policies, and storage buckets for the ChatBooks application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('author', 'reader', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id),
  cover_url TEXT,
  description TEXT NOT NULL,
  has_audio BOOLEAN DEFAULT false NOT NULL,
  has_chat_enabled BOOLEAN DEFAULT false NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  rating NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audio_url TEXT,
  chat_enabled BOOLEAN DEFAULT false NOT NULL,
  exclusive_chat BOOLEAN DEFAULT false NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('text', 'audio', 'chat')),
  position INTEGER NOT NULL,
  content TEXT,
  timestamp INTEGER,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('user', 'bot')),
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Reading sessions table
CREATE TABLE IF NOT EXISTS public.reading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  current_chapter INTEGER NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('text', 'audio', 'chat')),
  position INTEGER NOT NULL,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Book tags table
CREATE TABLE IF NOT EXISTS public.book_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_author_id ON public.books(author_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON public.chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_chapter_id ON public.bookmarks(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chapter_id ON public.chat_messages(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_id ON public.reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON public.reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_tags_book_id ON public.book_tags(book_id);
CREATE INDEX IF NOT EXISTS idx_book_tags_tag ON public.book_tags(tag);

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own profile and all authors' profiles
CREATE POLICY "Users can read their own profile and authors' profiles" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id OR role = 'author');

-- Users can update only their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Authors can create their own books
CREATE POLICY "Authors can create their own books" 
  ON public.books FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

-- Authors can read their own books, readers can read published books
CREATE POLICY "Authors can read their own books" 
  ON public.books FOR SELECT 
  USING (auth.uid() = author_id OR published_at IS NOT NULL);

-- Authors can update their own books
CREATE POLICY "Authors can update their own books" 
  ON public.books FOR UPDATE 
  USING (auth.uid() = author_id);

-- Authors can delete their own books
CREATE POLICY "Authors can delete their own books" 
  ON public.books FOR DELETE 
  USING (auth.uid() = author_id);

-- Authors can create chapters for their own books
CREATE POLICY "Authors can create chapters for their own books" 
  ON public.chapters FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id AND author_id = auth.uid()
  ));

-- Authors can read their own chapters, readers can read published book chapters
CREATE POLICY "Authors can read their own chapters" 
  ON public.chapters FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id AND (author_id = auth.uid() OR published_at IS NOT NULL)
  ));

-- Authors can update their own chapters
CREATE POLICY "Authors can update their own chapters" 
  ON public.chapters FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id AND author_id = auth.uid()
  ));

-- Authors can delete their own chapters
CREATE POLICY "Authors can delete their own chapters" 
  ON public.chapters FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id AND author_id = auth.uid()
  ));

-- Users can create their own bookmarks
CREATE POLICY "Users can create their own bookmarks" 
  ON public.bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own bookmarks
CREATE POLICY "Users can read their own bookmarks" 
  ON public.bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can update their own bookmarks
CREATE POLICY "Users can update their own bookmarks" 
  ON public.bookmarks FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" 
  ON public.bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- Users can create their own chat messages
CREATE POLICY "Users can create their own chat messages" 
  ON public.chat_messages FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own chat messages
CREATE POLICY "Users can read their own chat messages" 
  ON public.chat_messages FOR SELECT 
  USING (auth.uid() = user_id);

-- Authors can read chat messages for their books
CREATE POLICY "Authors can read chat messages for their books" 
  ON public.chat_messages FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.chapters c
    JOIN public.books b ON c.book_id = b.id
    WHERE c.id = chapter_id AND b.author_id = auth.uid()
  ));

-- Users can create their own reading sessions
CREATE POLICY "Users can create their own reading sessions" 
  ON public.reading_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own reading sessions
CREATE POLICY "Users can read their own reading sessions" 
  ON public.reading_sessions FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can update their own reading sessions
CREATE POLICY "Users can update their own reading sessions" 
  ON public.reading_sessions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own reading sessions
CREATE POLICY "Users can delete their own reading sessions" 
  ON public.reading_sessions FOR DELETE 
  USING (auth.uid() = user_id);

-- Authors can read reading sessions for their books (for analytics)
CREATE POLICY "Authors can read reading sessions for their books" 
  ON public.reading_sessions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id AND author_id = auth.uid()
  ));

-- Authors can create tags for their own books
CREATE POLICY "Authors can create tags for their own books" 
  ON public.book_tags FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id AND author_id = auth.uid()
  ));

-- Anyone can read book tags
CREATE POLICY "Anyone can read book tags" 
  ON public.book_tags FOR SELECT 
  USING (true);

-- Authors can update tags for their own books
CREATE POLICY "Authors can update tags for their own books" 
  ON public.book_tags FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id AND author_id = auth.uid()
  ));

-- Authors can delete tags for their own books
CREATE POLICY "Authors can delete tags for their own books" 
  ON public.book_tags FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id AND author_id = auth.uid()
  ));

-- Create storage buckets if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'manuscripts') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('manuscripts', 'manuscripts', false);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'audio') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'covers') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'profiles') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);
  END IF;
END
$$;

-- Set up storage policies
-- Authors can upload to manuscripts bucket
CREATE POLICY "Authors can upload manuscripts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'manuscripts' AND auth.role() = 'authenticated');

-- Authors can update their own manuscripts
CREATE POLICY "Authors can update their own manuscripts"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Authors can delete their own manuscripts
CREATE POLICY "Authors can delete their own manuscripts"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Anyone can read published manuscripts
CREATE POLICY "Anyone can read published manuscripts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'manuscripts' AND EXISTS (
    SELECT 1 FROM public.books b
    WHERE published_at IS NOT NULL AND b.id::text = (storage.foldername(name))[2]
  ));

-- Authors can upload audio files
CREATE POLICY "Authors can upload audio files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio' AND auth.role() = 'authenticated');

-- Authors can update their own audio files
CREATE POLICY "Authors can update their own audio files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Authors can delete their own audio files
CREATE POLICY "Authors can delete their own audio files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Anyone can read audio files
CREATE POLICY "Anyone can read audio files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio');

-- Users can upload cover images
CREATE POLICY "Users can upload cover images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

-- Authors can update their own cover images
CREATE POLICY "Authors can update their own cover images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Authors can delete their own cover images
CREATE POLICY "Authors can delete their own cover images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Anyone can read cover images
CREATE POLICY "Anyone can read cover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

-- Users can upload profile images
CREATE POLICY "Users can upload profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update their own profile images
CREATE POLICY "Users can update their own profile images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own profile images
CREATE POLICY "Users can delete their own profile images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Anyone can read profile images
CREATE POLICY "Anyone can read profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profiles');
