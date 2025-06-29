import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { AuthorDashboard } from './components/Author/AuthorDashboard';
import { ReaderDashboard } from './components/Reader/ReaderDashboard';
import { BookReader } from './components/Reader/BookReader';
import { LibraryView } from './components/Reader/LibraryView';
import { AuthorBooksView } from './components/Author/AuthorBooksView';
import { BookEditor } from './components/Author/BookEditor';

function AppContent() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<string | null>(null);

  // Not authenticated - show landing page or auth forms
  if (!user) {
    if (showAuth) {
      return authMode === 'login' ? (
        <LoginForm onToggleMode={() => setAuthMode('register')} />
      ) : (
        <RegisterForm onToggleMode={() => setAuthMode('login')} />
      );
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // Handle book reading view
  if (selectedBook) {
    return (
      <div className="min-h-screen bg-primary-50">
        <Header />
        <BookReader 
          bookId={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      </div>
    );
  }

  // Handle book editing view
  if (editingBook) {
    return (
      <div className="min-h-screen bg-primary-50">
        <Header />
        <BookEditor 
          bookId={editingBook} 
          onClose={() => setEditingBook(null)} 
        />
      </div>
    );
  }

  // Main dashboard view
  const renderMainContent = () => {
    if (user.role === 'author') {
      switch (currentView) {
        case 'books':
          return <AuthorBooksView onEditBook={setEditingBook} />;
        case 'analytics':
          return <div className="p-8"><h1 className="text-2xl font-bold">Analytics (Coming Soon)</h1></div>;
        case 'settings':
          return <div className="p-8"><h1 className="text-2xl font-bold">Settings (Coming Soon)</h1></div>;
        default:
          return <AuthorDashboard onEditBook={setEditingBook} />;
      }
    } else {
      switch (currentView) {
        case 'library':
          return <LibraryView onReadBook={setSelectedBook} />;
        case 'reading':
          return <div className="p-8"><h1 className="text-2xl font-bold">Continue Reading (Coming Soon)</h1></div>;
        case 'bookmarks':
          return <div className="p-8"><h1 className="text-2xl font-bold">Bookmarks (Coming Soon)</h1></div>;
        default:
          return <ReaderDashboard onReadBook={setSelectedBook} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenu={sidebarOpen}
      />
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-8">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;