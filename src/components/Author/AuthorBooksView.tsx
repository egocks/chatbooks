import React, { useState } from 'react';
import { Plus, Search, Edit3, BarChart3, Settings, BookOpen, MessageCircle, Headphones } from 'lucide-react';
import { mockBooks } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

interface AuthorBooksViewProps {
  onEditBook: (bookId: string) => void;
}

export function AuthorBooksView({ onEditBook }: AuthorBooksViewProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const userBooks = mockBooks.filter(book => book.authorId === user?.id);
  const filteredBooks = userBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">My Books</h1>
          <p className="text-primary-600 mt-2">Manage your published interactive books</p>
        </div>
        <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
          <Plus size={20} />
          <span>New Book</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" />
        <input
          type="text"
          placeholder="Search your books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        />
      </div>

      {/* Books List */}
      <div className="space-y-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-xl p-6 shadow-sm border border-primary-100 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-6">
              <img
                src={book.cover}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-primary-900">{book.title}</h3>
                    <p className="text-primary-600 mt-1">{book.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEditBook(book.id)}
                      className="p-2 text-primary-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                      title="Edit book"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 text-primary-600 hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors" title="Analytics">
                      <BarChart3 size={18} />
                    </button>
                    <button className="p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors" title="Settings">
                      <Settings size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-primary-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-primary-700">
                      <BookOpen size={16} />
                      <span className="text-sm font-medium">{book.chapters.length} Chapters</span>
                    </div>
                  </div>
                  
                  <div className="bg-success-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-success-700">
                      <MessageCircle size={16} />
                      <span className="text-sm font-medium">{book.chatEnabledChapters.length} Chat Enabled</span>
                    </div>
                  </div>
                  
                  <div className="bg-accent-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-accent-700">
                      <Headphones size={16} />
                      <span className="text-sm font-medium">{book.hasAudio ? 'Audio Ready' : 'No Audio'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-primary-50 rounded-lg p-3">
                    <div className="text-primary-700">
                      <div className="text-sm font-medium">Rating</div>
                      <div className="text-lg font-bold">{book.rating}/5</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {book.tags.map((tag, index) => (
                      <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-primary-500">Published {book.publishedAt}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto mb-4 text-primary-300" size={64} />
          <h3 className="text-xl font-semibold text-primary-900 mb-2">No books found</h3>
          <p className="text-primary-600">
            {userBooks.length === 0 
              ? "Start by creating your first interactive book"
              : "Try adjusting your search term"
            }
          </p>
        </div>
      )}
    </div>
  );
}