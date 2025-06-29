import React from 'react';
import { Book, User, MessageCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenu?: boolean;
}

export function Header({ onMenuToggle, showMenu }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-primary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg hover:bg-primary-50 transition-colors md:hidden"
              >
                {showMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <div className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-accent-500" />
              <span className="text-xl font-bold text-primary-900">ChatBooks</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <button className="p-2 rounded-lg hover:bg-primary-50 transition-colors relative">
                  <MessageCircle size={20} className="text-primary-600" />
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <span className="hidden sm:block text-primary-900">{user.name}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-primary-200 py-2">
                      <div className="px-4 py-2 border-b border-primary-100">
                        <p className="text-sm font-medium text-primary-900">{user.name}</p>
                        <p className="text-xs text-primary-500 capitalize">{user.role}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}