export interface User {
  id: string;
  name: string;
  email: string;
  role: 'author' | 'reader' | 'admin';
  avatar?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  authorId: string;
  cover: string;
  description: string;
  chapters: Chapter[];
  hasAudio: boolean;
  hasChatEnabled: boolean;
  chatEnabledChapters: string[];
  exclusiveChatChapters: string[];
  publishedAt: string;
  rating: number;
  tags: string[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  chatEnabled: boolean;
  exclusiveChat: boolean;
  bookmarks: Bookmark[];
}

export interface Bookmark {
  id: string;
  userId: string;
  chapterId: string;
  type: 'text' | 'audio' | 'chat';
  position: number;
  content?: string;
  timestamp?: number;
  note?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  chapterId?: string;
}

export interface ReadingSession {
  bookId: string;
  currentChapter: number;
  mode: 'text' | 'audio' | 'chat';
  position: number;
  lastAccessed: string;
}