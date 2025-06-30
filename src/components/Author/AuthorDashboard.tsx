import React, { useState } from 'react';
import { Book, Users, BarChart3, Plus, MessageSquare, TrendingUp, Edit3, Upload } from 'lucide-react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useBooks } from '../../hooks/useBooks';
import { ManuscriptUpload } from './ManuscriptUpload';
import { manuscriptService, ManuscriptUploadResult } from '../../services/manuscript.service';

interface AuthorDashboardProps {
  onEditBook: (bookId: string) => void;
}

export function AuthorDashboard({ onEditBook }: AuthorDashboardProps) {
  const { user } = useSupabaseAuth();
  const { books, loading, refetch } = useBooks({ authorId: user?.id });
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUploadComplete = async (result: ManuscriptUploadResult) => {
    if (!user) return;

    try {
      setUploading(true);
      
      // Create book from manuscript
      const bookId = await manuscriptService.createBookFromManuscript(
        result,
        user.id,
        {
          hasAudio: false,
          hasChatEnabled: true,
          tags: ['imported'],
        }
      );

      setShowUpload(false);
      refetch(); // Refresh the books list
      
      // Navigate to edit the new book
      onEditBook(bookId);
    } catch (error) {
      console.error('Error creating book from manuscript:', error);
      alert('Failed to create book from manuscript. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    { label: 'Published Books', value: books.filter(b => b.published_at).length, icon: Book, color: 'bg-accent-500' },
    { label: 'Total Readers', value: '2,847', icon: Users, color: 'bg-success-500' },
    { label: 'Chat Interactions', value: '12,450', icon: MessageSquare, color: 'bg-primary-500' },
    { label: 'Revenue This Month', value: '$4,230', icon: TrendingUp, color: 'bg-accent-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Welcome back, {user?.name}!</h1>
          <p className="text-primary-600 mt-2">Here's what's happening with your books</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUpload(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <Upload size={20} />
            <span>Upload Manuscript</span>
          </button>
          <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
            <Plus size={20} />
            <span>New Book</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Books */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-100">
        <div className="p-6 border-b border-primary-100">
          <h2 className="text-xl font-bold text-primary-900">Your Books</h2>
        </div>
        <div className="p-6">
          {books.length === 0 ? (
            <div className="text-center py-12">
              <Book className="mx-auto mb-4 text-primary-300" size={64} />
              <h3 className="text-xl font-semibold text-primary-900 mb-2">No books yet</h3>
              <p className="text-primary-600 mb-6">
                Start by uploading your first manuscript or creating a new book
              </p>
              <button
                onClick={() => setShowUpload(true)}
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Upload Your First Book
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <div key={book.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-primary-50 transition-colors">
                  <img
                    src={book.cover_url || 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-900">{book.title}</h3>
                    <p className="text-primary-600 text-sm mt-1">{book.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">
                        {book.chapters.length} chapters
                      </span>
                      {book.has_audio && (
                        <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded">
                          Audio enabled
                        </span>
                      )}
                      {book.has_chat_enabled && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          Chat enabled
                        </span>
                      )}
                      {book.published_at && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Published
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-accent-500">
                      <span className="text-sm font-semibold">{book.rating || 'N/A'}</span>
                      <BarChart3 size={16} />
                    </div>
                    <p className="text-xs text-primary-500 mt-1">
                      {book.published_at ? `Published ${new Date(book.published_at).toLocaleDateString()}` : 'Draft'}
                    </p>
                  </div>
                  <button
                    onClick={() => onEditBook(book.id)}
                    className="p-2 text-primary-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showUpload && (
        <ManuscriptUpload
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUpload(false)}
        />
      )}

      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Creating Your Book</h3>
              <p className="text-primary-600">Processing manuscript and setting up chapters...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}