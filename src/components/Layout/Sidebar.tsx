import React from 'react';
import { Book, Users, BarChart3, Settings, Home, BookOpen, Headphones, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const authorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'books', label: 'My Books', icon: Book },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const readerMenuItems = [
    { id: 'discover', label: 'Discover', icon: Home },
    { id: 'library', label: 'My Library', icon: BookOpen },
    { id: 'reading', label: 'Continue Reading', icon: Book },
    { id: 'bookmarks', label: 'Bookmarks', icon: MessageSquare },
  ];

  const menuItems = user?.role === 'author' ? authorMenuItems : readerMenuItems;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-primary-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-accent-50 text-accent-700 border border-accent-200'
                      : 'text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}