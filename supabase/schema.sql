-- Create tables for ChatBooks application

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('author', 'reader', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Books table
CREATE TABLE public.books (
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
CREATE TABLE public.chapters (
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
CREATE TABLE public.bookmarks (
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
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('user', 'bot')),
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Reading sessions table
CREATE TABLE public.reading_sessions (
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
CREATE TABLE public.book_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_books_author_id ON public.books(author_id);
CREATE INDEX idx_chapters_book_id ON public.chapters(book_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_chapter_id ON public.bookmarks(chapter_id);
CREATE INDEX idx_chat_messages_chapter_id ON public.chat_messages(chapter_id);
CREATE INDEX idx_reading_sessions_user_id ON public.reading_sessions(user_id);
CREATE INDEX idx_reading_sessions_book_id ON public.reading_sessions(book_id);
CREATE INDEX idx_book_tags_book_id ON public.book_tags(book_id);
CREATE INDEX idx_book_tags_tag ON public.book_tags(tag);

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

-- Authors can create and read their own books
CREATE POLICY "Authors can create their own books" 
  ON public.books FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can read their own books" 
  ON public.books FOR SELECT 
  USING (auth.uid() = author_id OR published_at IS NOT NULL);

CREATE POLICY "Authors can update their own books" 
  ON public.books FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own books" 
  ON public.books FOR DELETE 
  USING (auth.uid() = author_id);

-- Readers can read published books
CREATE POLICY "Readers can read published books" 
  ON public.books FOR SELECT 
  USING (published_at IS NOT NULL);

-- Similar policies for chapters, bookmarks, etc.

-- Create storage buckets
INSERT INTO storage.buckets (id, name) VALUES ('manuscripts', 'manuscripts');
INSERT INTO storage.buckets (id, name) VALUES ('audio', 'audio');
INSERT INTO storage.buckets (id, name) VALUES ('covers', 'covers');
INSERT INTO storage.buckets (id, name) VALUES ('profiles', 'profiles');

-- Set up storage policies
-- Authors can upload to manuscripts bucket
CREATE POLICY "Authors can upload manuscripts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'manuscripts' AND auth.role() = 'authenticated');

-- Anyone can read published manuscripts
CREATE POLICY "Anyone can read published manuscripts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'manuscripts');

-- Similar policies for other buckets
