import React from 'react';
import { Book, Users, BarChart3, Plus, MessageSquare, TrendingUp, Edit3 } from 'lucide-react';
import { mockBooks } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

interface AuthorDashboardProps {
  onEditBook: (bookId: string) => void;
}

export function AuthorDashboard({ onEditBook }: AuthorDashboardProps) {
  const { user } = useAuth();
  const userBooks = mockBooks.filter(book => book.authorId === user?.id);

  const stats = [
    { label: 'Published Books', value: userBooks.length, icon: Book, color: 'bg-accent-500' },
    { label: 'Total Readers', value: '2,847', icon: Users, color: 'bg-success-500' },
    { label: 'Chat Interactions', value: '12,450', icon: MessageSquare, color: 'bg-primary-500' },
    { label: 'Revenue This Month', value: '$4,230', icon: TrendingUp, color: 'bg-accent-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Welcome back, {user?.name}!</h1>
          <p className="text-primary-600 mt-2">Here's what's happening with your books</p>
        </div>
        <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
          <Plus size={20} />
          <span>New Book</span>
        </button>
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
          <div className="space-y-4">
            {userBooks.map((book) => (
              <div key={book.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-primary-50 transition-colors">
                <img
                  src={book.cover}
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
                    {book.hasAudio && (
                      <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded">
                        Audio enabled
                      </span>
                    )}
                    {book.hasChatEnabled && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        Chat enabled
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-accent-500">
                    <span className="text-sm font-semibold">{book.rating}</span>
                    <BarChart3 size={16} />
                  </div>
                  <p className="text-xs text-primary-500 mt-1">Published {book.publishedAt}</p>
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
        </div>
      </div>
    </div>
  );
}