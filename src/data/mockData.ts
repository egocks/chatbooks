import { Book, Chapter } from '../types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Digital Renaissance',
    author: 'Sarah Chen',
    authorId: '1',
    cover: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Explore how technology is reshaping creativity and human expression in the 21st century.',
    chapters: [
      {
        id: '1-1',
        title: 'Introduction: The New Creative Age',
        content: 'We stand at the threshold of a new creative age. Technology has become our canvas, our instrument, our collaborator. This book explores how digital tools are not replacing human creativity, but amplifying it in ways we never imagined possible...',
        chatEnabled: true,
        exclusiveChat: false,
        bookmarks: []
      },
      {
        id: '1-2',
        title: 'The Tools of Tomorrow',
        content: 'Artificial intelligence, virtual reality, and blockchain technology are converging to create unprecedented opportunities for creative expression...',
        chatEnabled: true,
        exclusiveChat: false,
        bookmarks: []
      },
      {
        id: '1-3',
        title: 'Hidden Insights',
        content: '[This chapter contains exclusive content available only through AI chat interaction]',
        chatEnabled: true,
        exclusiveChat: true,
        bookmarks: []
      }
    ],
    hasAudio: true,
    hasChatEnabled: true,
    chatEnabledChapters: ['1-1', '1-2', '1-3'],
    exclusiveChatChapters: ['1-3'],
    publishedAt: '2024-01-15',
    rating: 4.8,
    tags: ['Technology', 'Creativity', 'Future']
  },
  {
    id: '2',
    title: 'Mindful Leadership',
    author: 'Dr. Elena Rodriguez',
    authorId: '2',
    cover: 'https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'A practical guide to leading with consciousness and emotional intelligence.',
    chapters: [
      {
        id: '2-1',
        title: 'The Foundation of Awareness',
        content: 'True leadership begins with self-awareness. In this chapter, we explore the fundamental principles of mindful leadership and how they transform both leaders and organizations...',
        chatEnabled: true,
        exclusiveChat: false,
        bookmarks: []
      }
    ],
    hasAudio: true,
    hasChatEnabled: true,
    chatEnabledChapters: ['2-1'],
    exclusiveChatChapters: [],
    publishedAt: '2024-02-01',
    rating: 4.6,
    tags: ['Leadership', 'Mindfulness', 'Business']
  }
];