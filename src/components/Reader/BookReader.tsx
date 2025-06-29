import React, { useState, useRef, useEffect } from 'react';
import { Book, Headphones, MessageCircle, ArrowLeft, Bookmark, Play, Pause, SkipBack, SkipForward, Mic, MicOff, Volume2 } from 'lucide-react';
import { mockBooks } from '../../data/mockData';
import { ChatMessage } from '../../types';

interface BookReaderProps {
  bookId: string;
  onClose: () => void;
}

export function BookReader({ bookId, onClose }: BookReaderProps) {
  const [mode, setMode] = useState<'text' | 'audio' | 'chat'>('text');
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [textSelection, setTextSelection] = useState<string>('');
  const [audioPosition, setAudioPosition] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const book = mockBooks.find(b => b.id === bookId);
  if (!book) return null;

  const chapter = book.chapters[currentChapter];

  // Mock AI responses
  const generateAIResponse = (userMessage: string) => {
    const responses = [
      "That's a fascinating perspective! In the context of this chapter, I think about how digital creativity allows us to explore ideas that were previously impossible to visualize.",
      "Great question! This connects to broader themes in the book about how technology amplifies rather than replaces human intuition.",
      "I'm glad you brought that up. This particular section explores how the democratization of creative tools is reshaping entire industries.",
      "Interesting observation! What you're noticing here relates to the tension between technological efficiency and human authenticity that I discuss throughout the book."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date().toISOString(),
      chapterId: chapter.id
    };

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: generateAIResponse(chatInput),
      timestamp: new Date().toISOString(),
      chapterId: chapter.id
    };

    setChatMessages(prev => [...prev, userMessage, aiResponse]);
    setChatInput('');
  };

  const synthesizeChat = () => {
    const chatSummary = chatMessages
      .filter(msg => msg.type === 'bot')
      .map(msg => msg.content)
      .join(' ');
    
    alert(`Chat synthesized! This summary would be integrated into the chapter:\n\n"${chatSummary.substring(0, 200)}..."`);
  };

  const addBookmark = () => {
    const bookmark = {
      id: Date.now().toString(),
      type: mode,
      position: mode === 'audio' ? audioPosition : 0,
      content: mode === 'text' ? textSelection : undefined,
      note: `Bookmark in ${chapter.title}`,
      timestamp: Date.now()
    };
    alert(`Bookmark added! ${bookmark.note}`);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const renderTextMode = () => (
    <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-8 max-w-4xl mx-auto">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-primary-900 mb-6">{chapter.title}</h1>
        {chapter.exclusiveChat ? (
          <div className="bg-gradient-to-r from-primary-100 to-accent-100 rounded-lg p-8 text-center">
            <MessageCircle className="mx-auto mb-4 text-accent-500" size={48} />
            <h3 className="text-xl font-bold text-primary-900 mb-2">Exclusive Chat Content</h3>
            <p className="text-primary-600 mb-4">
              This chapter contains special content available only through AI chat interaction.
            </p>
            <button
              onClick={() => setMode('chat')}
              className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Chat to Unlock
            </button>
          </div>
        ) : (
          <div 
            className="leading-relaxed text-primary-800"
            onMouseUp={() => {
              const selection = window.getSelection()?.toString();
              if (selection) setTextSelection(selection);
            }}
          >
            {chapter.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAudioMode = () => (
    <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-8 max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <img
          src={book.cover}
          alt={book.title}
          className="w-48 h-64 mx-auto rounded-lg shadow-lg mb-6"
        />
        <h2 className="text-2xl font-bold text-primary-900 mb-2">{chapter.title}</h2>
        <p className="text-primary-600">{book.author}</p>
      </div>

      <div className="bg-primary-50 rounded-lg p-6 mb-6">
        <div className="w-full bg-primary-200 rounded-full h-2 mb-4">
          <div 
            className="bg-accent-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(audioPosition / 100) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-primary-600">
          <span>{Math.floor(audioPosition / 60)}:{(audioPosition % 60).toString().padStart(2, '0')}</span>
          <span>15:30</span>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-6">
        <button 
          onClick={() => setAudioPosition(Math.max(0, audioPosition - 15))}
          className="p-3 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors"
        >
          <SkipBack size={20} className="text-primary-700" />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 rounded-full bg-accent-500 hover:bg-accent-600 transition-colors"
        >
          {isPlaying ? (
            <Pause size={24} className="text-white" />
          ) : (
            <Play size={24} className="text-white ml-1" />
          )}
        </button>
        <button 
          onClick={() => setAudioPosition(Math.min(100, audioPosition + 15))}
          className="p-3 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors"
        >
          <SkipForward size={20} className="text-primary-700" />
        </button>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors">
          <Volume2 size={16} />
          <span className="text-sm">Speed: 1.0x</span>
        </button>
      </div>
    </div>
  );

  const renderChatMode = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 h-[600px] flex flex-col">
        <div className="p-6 border-b border-primary-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{book.author[0]}</span>
            </div>
            <div>
              <h3 className="font-bold text-primary-900">{book.author} AI Avatar</h3>
              <p className="text-sm text-primary-600">Ask me about "{chapter.title}"</p>
            </div>
          </div>
        </div>

        <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
          {chatMessages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto mb-4 text-primary-300" size={48} />
              <p className="text-primary-500">Start a conversation about this chapter</p>
            </div>
          )}
          
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-accent-500 text-white' 
                  : 'bg-primary-100 text-primary-900'
              }`}>
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-accent-100' : 'text-primary-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-primary-200">
          {chatMessages.length > 0 && (
            <div className="mb-4">
              <button
                onClick={synthesizeChat}
                className="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Synthesize Chat into Chapter
              </button>
            </div>
          )}
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask about this chapter..."
              className="flex-1 px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
            <button
              onClick={() => setIsListening(!isListening)}
              className={`p-2 rounded-lg transition-colors ${
                isListening ? 'bg-red-500 text-white' : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={handleChatSubmit}
              className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Send
            </button>
          </div>
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
                <h1 className="font-bold text-primary-900">{book.title}</h1>
                <p className="text-sm text-primary-600">Chapter {currentChapter + 1}: {chapter.title}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-primary-100 rounded-lg p-1">
                <button
                  onClick={() => setMode('text')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'text' ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-600'
                  }`}
                >
                  <Book size={16} className="inline mr-2" />
                  Text
                </button>
                {book.hasAudio && (
                  <button
                    onClick={() => setMode('audio')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      mode === 'audio' ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-600'
                    }`}
                  >
                    <Headphones size={16} className="inline mr-2" />
                    Audio
                  </button>
                )}
                {chapter.chatEnabled && (
                  <button
                    onClick={() => setMode('chat')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      mode === 'chat' ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-600'
                    }`}
                  >
                    <MessageCircle size={16} className="inline mr-2" />
                    Chat
                  </button>
                )}
              </div>

              <button
                onClick={addBookmark}
                className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <Bookmark size={20} className="text-primary-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {mode === 'text' && renderTextMode()}
        {mode === 'audio' && renderAudioMode()}
        {mode === 'chat' && renderChatMode()}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-primary-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
            disabled={currentChapter === 0}
            className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-primary-600">
              Chapter {currentChapter + 1} of {book.chapters.length}
            </p>
          </div>

          <button
            onClick={() => setCurrentChapter(Math.min(book.chapters.length - 1, currentChapter + 1))}
            disabled={currentChapter === book.chapters.length - 1}
            className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ArrowLeft size={16} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}