import React, { useState } from 'react';
import { Search, Filter, Book, Clock, Star, Bookmark } from 'lucide-react';
import { mockBooks } from '../../data/mockData';

interface LibraryViewProps {
  onReadBook: (bookId: string) => void;
}

export function LibraryView({ onReadBook }: LibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'audio') return matchesSearch && book.hasAudio;
    if (selectedFilter === 'chat') return matchesSearch && book.hasChatEnabled;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">My Library</h1>
          <p className="text-primary-600 mt-2">Your collection of interactive books</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" />
          <input
            type="text"
            placeholder="Search your library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-primary-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          >
            <option value="all">All Books</option>
            <option value="audio">Audio Available</option>
            <option value="chat">Chat Enabled</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden hover:shadow-lg transition-all group">
            <div className="relative">
              <img
                src={book.cover}
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
              <h3 className="font-bold text-primary-900 mb-2 line-clamp-2">{book.title}</h3>
              <p className="text-primary-600 text-sm mb-3">{book.author}</p>
              <p className="text-primary-700 text-sm mb-4 line-clamp-2">{book.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1 text-accent-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-semibold">{book.rating}</span>
                </div>
                <div className="flex space-x-2">
                  {book.hasAudio && (
                    <span className="w-2 h-2 bg-success-500 rounded-full" title="Audio available"></span>
                  )}
                  {book.hasChatEnabled && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full" title="Chat enabled"></span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => onReadBook(book.id)}
                  className="flex-1 bg-accent-500 hover:bg-accent-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors mr-2"
                >
                  Continue Reading
                </button>
                <div className="flex items-center space-x-1 text-primary-500 text-xs">
                  <Clock size={12} />
                  <span>67% complete</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="mx-auto mb-4 text-primary-300" size={64} />
          <h3 className="text-xl font-semibold text-primary-900 mb-2">No books found</h3>
          <p className="text-primary-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}