import React from 'react';
import { Book, MessageCircle, Headphones, Zap, Users, Star, ArrowRight, Play } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Book className="h-12 w-12 text-accent-400" />
              <span className="text-4xl font-bold text-white">ChatBooks</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Books That
              <span className="text-accent-400 block">Talk Back</span>
            </h1>
            <p className="text-xl text-primary-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              The future of reading is here. Create interactive e-books where readers can chat with AI avatars, 
              listen to AI-narrated audio, and discover content in revolutionary new ways.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Start Publishing</span>
                <ArrowRight size={20} />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2">
                <Play size={20} />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4">
              Three Revolutionary Reading Modes
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Give your readers the choice of how they want to experience your content
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Book className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Traditional Text</h3>
              <p className="text-primary-600 mb-6">
                Beautiful, distraction-free reading experience with advanced bookmarking and note-taking.
              </p>
              <ul className="space-y-2 text-primary-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>Chapter bookmarks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>Highlight & notes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>Progress tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Headphones className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">AI Audio</h3>
              <p className="text-primary-600 mb-6">
                High-quality AI narration that brings your words to life with natural, expressive voices.
              </p>
              <ul className="space-y-2 text-primary-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                  <span>Natural AI voices</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                  <span>Chapter navigation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                  <span>Speed control</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Interactive Chat</h3>
              <p className="text-primary-600 mb-6">
                Readers can chat with your AI avatar to explore ideas, ask questions, and discover hidden insights.
              </p>
              <ul className="space-y-2 text-primary-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Author AI avatar</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Context-aware responses</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Exclusive content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4">
              Why Authors Choose ChatBooks
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Engage your readers like never before and build lasting connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-accent-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-900 mb-2">Deeper Engagement</h3>
                  <p className="text-primary-600">
                    Readers spend 3x longer with interactive books, forming stronger connections with your content.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-success-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-success-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-900 mb-2">Build Community</h3>
                  <p className="text-primary-600">
                    Create ongoing relationships with readers through interactive conversations and feedback.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-900 mb-2">Premium Pricing</h3>
                  <p className="text-primary-600">
                    Interactive books command 40% higher prices than traditional e-books.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-accent-400 to-accent-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Writing?</h3>
                <p className="mb-6 opacity-90">
                  Join thousands of authors who are already creating the future of reading.
                </p>
                <button
                  onClick={onGetStarted}
                  className="bg-white text-accent-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Book className="h-8 w-8 text-accent-400" />
            <span className="text-2xl font-bold">ChatBooks</span>
          </div>
          <div className="text-center text-primary-300">
            <p>&copy; 2024 ChatBooks. The future of interactive reading.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}