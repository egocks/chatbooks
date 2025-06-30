-- Seed data for ChatBooks
-- This file is used to populate the database with initial data for development and testing

-- Insert test users
-- Note: In a real scenario, users would be created through auth.users first
-- For testing, we'll insert directly with predefined UUIDs
INSERT INTO public.users (id, name, email, role, avatar_url, created_at, updated_at)
VALUES 
  ('d0e70b5b-19e1-4dfe-8804-a9c606451028', 'Jane Author', 'jane@example.com', 'author', NULL, now(), now()),
  ('15600712-bed1-4db3-a7f2-f9a5c9b8f9b7', 'John Reader', 'john@example.com', 'reader', NULL, now(), now()),
  ('c77e97a1-21eb-4a2c-8f38-65553a59e4e3', 'Admin User', 'admin@example.com', 'admin', NULL, now(), now());

-- Insert test books
INSERT INTO public.books (id, title, author_id, cover_url, description, has_audio, has_chat_enabled, published_at, rating, created_at, updated_at)
VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'The Silent Echo', 'd0e70b5b-19e1-4dfe-8804-a9c606451028', NULL, 'A thrilling mystery novel about a detective who can hear echoes of the past.', true, true, now(), 4.5, now(), now()),
  ('6d3a7b98-9c1e-4b4f-8d3a-c95bf3d3c999', 'Digital Dreams', 'd0e70b5b-19e1-4dfe-8804-a9c606451028', NULL, 'A science fiction story about virtual reality gone wrong.', false, true, now(), 4.2, now(), now()),
  ('a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', 'Unpublished Manuscript', 'd0e70b5b-19e1-4dfe-8804-a9c606451028', NULL, 'This book is still being written and not yet published.', false, false, NULL, NULL, now(), now());

-- Insert test chapters
INSERT INTO public.chapters (id, book_id, title, content, audio_url, chat_enabled, exclusive_chat, order_index, created_at, updated_at)
VALUES
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'The Beginning', 'It was a dark and stormy night when Detective Sarah first heard the whispers...', '/audio/chapter1.mp3', true, false, 1, now(), now()),
  ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'The Discovery', 'The old mansion held more secrets than anyone could have imagined...', '/audio/chapter2.mp3', true, false, 2, now(), now()),
  ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'The Revelation', 'As the truth came to light, Sarah realized she had been hearing more than just echoes...', NULL, true, true, 3, now(), now()),
  ('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', '6d3a7b98-9c1e-4b4f-8d3a-c95bf3d3c999', 'Virtual Reality', 'The new VR system promised to revolutionize entertainment...', NULL, true, false, 1, now(), now()),
  ('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', '6d3a7b98-9c1e-4b4f-8d3a-c95bf3d3c999', 'System Failure', 'When the system crashed, users found themselves unable to disconnect...', NULL, true, false, 2, now(), now()),
  ('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', 'Draft Chapter', 'This is a draft chapter for the unpublished book...', NULL, false, false, 1, now(), now());

-- Insert test bookmarks
INSERT INTO public.bookmarks (id, user_id, chapter_id, type, position, content, timestamp, note, created_at)
VALUES
  ('a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p', '15600712-bed1-4db3-a7f2-f9a5c9b8f9b7', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'text', 120, 'Detective Sarah first heard the whispers', NULL, 'Interesting start to the mystery', now()),
  ('b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7', '15600712-bed1-4db3-a7f2-f9a5c9b8f9b7', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'audio', 0, NULL, 45, 'Remember to continue from this point', now());

-- Insert test chat messages
INSERT INTO public.chat_messages (id, user_id, chapter_id, type, content, timestamp, created_at)
VALUES
  ('c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8', '15600712-bed1-4db3-a7f2-f9a5c9b8f9b7', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'user', 'Who is the main suspect?', '00:05:30', now()),
  ('d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9', '15600712-bed1-4db3-a7f2-f9a5c9b8f9b7', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'bot', 'The main suspect is still unclear at this point in the story. Keep reading to find out!', '00:05:35', now());

-- Insert test reading sessions
INSERT INTO public.reading_sessions (id, user_id, book_id, current_chapter, mode, position, last_accessed, created_at, updated_at)
VALUES
  ('e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', '15600712-bed1-4db3-a7f2-f9a5c9b8f9b7', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 2, 'text', 450, now(), now(), now()),
  ('f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1', '15600712-bed1-4db3-a7f2-f9a5c9b8f9b7', '6d3a7b98-9c1e-4b4f-8d3a-c95bf3d3c999', 1, 'chat', 200, now(), now(), now());

-- Insert test book tags
INSERT INTO public.book_tags (id, book_id, tag, created_at)
VALUES
  ('g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'mystery', now()),
  ('h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'thriller', now()),
  ('i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4', '6d3a7b98-9c1e-4b4f-8d3a-c95bf3d3c999', 'sci-fi', now()),
  ('j0k1l2m3-n4o5-p6q7-r8s9-t0u1v2w3x4y5', '6d3a7b98-9c1e-4b4f-8d3a-c95bf3d3c999', 'virtual-reality', now());
