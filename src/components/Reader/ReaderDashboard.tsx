import React from 'react';
import { Book, Clock, Bookmark, Star, Play, MessageCircle, Headphones } from 'lucide-react';
import { useBooks } from '../../hooks/useBooks';

interface ReaderDashboardProps {
  onReadBook: (bookId: string) => void;
}

export function ReaderDashboard({ onReadBook }: ReaderDashboardProps) {
  const { books, loading } = useBooks({ published: true });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  const featuredBook = books[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900">Discover Your Next Great Read</h1>
        <p className="text-primary-600 mt-2">Explore interactive books that adapt to how you learn</p>
      </div>

      {/* Featured Book */}
      {featuredBook && (
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
              <h2 className="text-3xl font-bold mt-4 mb-4">{featuredBook.title}</h2>
              <p className="text-accent-100 mb-6">
                {featuredBook.description}
              </p>
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{featuredBook.rating || '4.8'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>3h read</span>
                </div>
                {featuredBook.has_chat_enabled && (
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat enabled</span>
                  </div>
                )}
                {featuredBook.has_audio && (
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-5 h-5" />
                    <span>Audio ready</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => onReadBook(featuredBook.id)}
                className="bg-white text-accent-600 px-6 py-3 rounded-lg font-semibold hover:bg-accent-50 transition-colors flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Start Reading</span>
              </button>
            </div>
            <div className="relative">
              <img
                src={featuredBook.cover_url || "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400"}
                alt="Featured Book"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Books Grid */}
      <div>
        <h2 className="text-2xl font-bold text-primary-900 mb-6">Trending Interactive Books</h2>
        {books.length === 0 ? (
          <div className="text-center py-12">
            <Book className="mx-auto mb-4 text-primary-300" size={64} />
            <h3 className="text-xl font-semibold text-primary-900 mb-2">No books available yet</h3>
            <p className="text-primary-600">Check back soon for new interactive books!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img
                    src={book.cover_url || "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400"}
                    alt={book.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors">
                      <Bookmark size={16} className="text-primary-600" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-primary-900 mb-2">{book.title}</h3>
                  <p className="text-primary-600 text-sm mb-3">By Author</p>
                  <p className="text-primary-700 text-sm mb-4 line-clamp-2">{book.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-accent-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-semibold">{book.rating || '4.5'}</span>
                    </div>
                    <div className="flex space-x-2">
                      {book.has_audio && (
                        <span className="w-2 h-2 bg-success-500 rounded-full" title="Audio available"></span>
                      )}
                      {book.has_chat_enabled && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full" title="Chat enabled"></span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onReadBook(book.id)}
                      className="flex-1 bg-accent-500 hover:bg-accent-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Read Now
                    </button>
                    <button className="p-2 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">
                      <Bookmark size={16} className="text-primary-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}