import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, MessageCircle, Headphones, Eye, Settings } from 'lucide-react';
import { mockBooks } from '../../data/mockData';
import { Chapter } from '../../types';

interface BookEditorProps {
  bookId: string;
  onClose: () => void;
}

export function BookEditor({ bookId, onClose }: BookEditorProps) {
  const book = mockBooks.find(b => b.id === bookId);
  const [activeTab, setActiveTab] = useState<'content' | 'chat' | 'audio' | 'settings'>('content');
  const [selectedChapter, setSelectedChapter] = useState(0);
  
  if (!book) return null;

  const chapter = book.chapters[selectedChapter];

  const addChapter = () => {
    const newChapter: Chapter = {
      id: `${book.id}-${book.chapters.length + 1}`,
      title: 'New Chapter',
      content: 'Start writing your chapter content here...',
      chatEnabled: false,
      exclusiveChat: false,
      bookmarks: []
    };
    // In real app, this would update the book
    alert('Chapter added! (This would update the actual book in a real implementation)');
  };

  const toggleChatEnabled = (chapterId: string) => {
    // In real app, this would update the chapter's chat settings
    alert(`Chat toggled for chapter ${chapterId}`);
  };

  const saveBook = () => {
    alert('Book saved successfully!');
  };

  const renderContentTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Chapter List */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary-900">Chapters</h3>
          <button
            onClick={addChapter}
            className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="space-y-2">
          {book.chapters.map((ch, index) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapter(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedChapter === index
                  ? 'bg-accent-50 border border-accent-200 text-accent-700'
                  : 'hover:bg-primary-50 text-primary-700'
              }`}
            >
              <div className="font-medium text-sm mb-1">Chapter {index + 1}</div>
              <div className="text-xs truncate">{ch.title}</div>
              <div className="flex items-center space-x-2 mt-2">
                {ch.chatEnabled && (
                  <span className="w-2 h-2 bg-success-500 rounded-full" title="Chat enabled"></span>
                )}
                {ch.exclusiveChat && (
                  <span className="w-2 h-2 bg-primary-500 rounded-full" title="Exclusive chat"></span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Editor */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            value={chapter.title}
            className="text-xl font-bold text-primary-900 border-none outline-none bg-transparent"
            placeholder="Chapter title..."
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleChatEnabled(chapter.id)}
              className={`p-2 rounded-lg transition-colors ${
                chapter.chatEnabled
                  ? 'bg-success-100 text-success-600'
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
              }`}
              title="Toggle chat for this chapter"
            >
              <MessageCircle size={18} />
            </button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <textarea
          value={chapter.content}
          className="w-full h-96 p-4 border border-primary-300 rounded-lg resize-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          placeholder="Start writing your chapter content..."
        />

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={chapter.chatEnabled}
                className="rounded border-primary-300 text-accent-500 focus:ring-accent-500"
              />
              <span className="text-sm text-primary-700">Enable AI chat for this chapter</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={chapter.exclusiveChat}
                disabled={!chapter.chatEnabled}
                className="rounded border-primary-300 text-accent-500 focus:ring-accent-500 disabled:opacity-50"
              />
              <span className="text-sm text-primary-700">Make this chapter chat-exclusive</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
      <h3 className="text-lg font-bold text-primary-900 mb-6">AI Chat Configuration</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Author Avatar Personality
          </label>
          <textarea
            className="w-full h-32 p-4 border border-primary-300 rounded-lg resize-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            placeholder="Describe how you want your AI avatar to behave and respond to readers..."
            defaultValue="I am an thoughtful and engaging author who loves to explore deep questions about technology and creativity. I respond with enthusiasm and provide detailed explanations while encouraging readers to think critically."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Chat-Enabled Chapters
          </label>
          <div className="space-y-2">
            {book.chapters.map((ch, index) => (
              <label key={ch.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={ch.chatEnabled}
                  className="rounded border-primary-300 text-accent-500 focus:ring-accent-500"
                />
                <span className="text-primary-700">Chapter {index + 1}: {ch.title}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Exclusive Chat Content
          </label>
          <p className="text-sm text-primary-600 mb-3">
            These chapters will only be accessible through AI chat interaction
          </p>
          <div className="space-y-2">
            {book.chapters.map((ch, index) => (
              <label key={ch.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={ch.exclusiveChat}
                  disabled={!ch.chatEnabled}
                  className="rounded border-primary-300 text-accent-500 focus:ring-accent-500 disabled:opacity-50"
                />
                <span className={`${ch.chatEnabled ? 'text-primary-700' : 'text-primary-400'}`}>
                  Chapter {index + 1}: {ch.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudioTab = () => (
    <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
      <h3 className="text-lg font-bold text-primary-900 mb-6">Audio Configuration</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Headphones className="text-primary-600" size={24} />
            <div>
              <h4 className="font-medium text-primary-900">AI Audio Narration</h4>
              <p className="text-sm text-primary-600">Generate high-quality AI narration for your book</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={book.hasAudio} className="sr-only peer" />
            <div className="w-11 h-6 bg-primary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
          </label>
        </div>

        {book.hasAudio && (
          <>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Voice Selection
              </label>
              <select className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent">
                <option>Professional Female (Sarah)</option>
                <option>Professional Male (David)</option>
                <option>Conversational Female (Emma)</option>
                <option>Conversational Male (James)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Speech Speed
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                defaultValue="1"
                className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
              />
              <div className="flex justify-between text-xs text-primary-600 mt-1">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-primary-900 mb-3">Chapter Audio Status</h4>
              <div className="space-y-2">
                {book.chapters.map((ch, index) => (
                  <div key={ch.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <span className="text-primary-700">Chapter {index + 1}: {ch.title}</span>
                    <button className="bg-accent-500 hover:bg-accent-600 text-white px-3 py-1 rounded text-sm transition-colors">
                      Generate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
      <h3 className="text-lg font-bold text-primary-900 mb-6">Book Settings</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Book Title
          </label>
          <input
            type="text"
            defaultValue={book.title}
            className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Description
          </label>
          <textarea
            defaultValue={book.description}
            className="w-full h-24 p-4 border border-primary-300 rounded-lg resize-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            defaultValue={book.tags.join(', ')}
            placeholder="Technology, Creativity, Future"
            className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            defaultValue={book.cover}
            className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        <div className="pt-4 border-t border-primary-200">
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Delete Book
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="sticky top-0 z-40 bg-white border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <ArrowLeft size={20} className="text-primary-600" />
              </button>
              <div>
                <h1 className="font-bold text-primary-900">Edit: {book.title}</h1>
                <p className="text-sm text-primary-600">Manage your interactive book</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-800 border border-primary-300 rounded-lg transition-colors">
                <Eye size={16} />
                <span>Preview</span>
              </button>
              <button
                onClick={saveBook}
                className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-primary-100 rounded-lg p-1 mb-8 max-w-md">
          {[
            { id: 'content', label: 'Content', icon: BookOpen },
            { id: 'chat', label: 'Chat', icon: MessageCircle },
            { id: 'audio', label: 'Audio', icon: Headphones },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-primary-600 hover:text-primary-800'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'chat' && renderChatTab()}
          {activeTab === 'audio' && renderAudioTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
}