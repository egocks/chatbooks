import React, { useState } from 'react';
import { Book, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = (role: 'author' | 'reader') => {
    const credentials = {
      author: { email: 'sarah@example.com', password: 'demo' },
      reader: { email: 'michael@example.com', password: 'demo' }
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Book className="h-10 w-10 text-accent-500" />
            <span className="text-2xl font-bold text-primary-900">ChatBooks</span>
          </div>
          <h2 className="text-3xl font-bold text-primary-900">Welcome back</h2>
          <p className="text-primary-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-primary-200">
            <p className="text-center text-sm text-primary-600 mb-4">
              Quick demo access:
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => demoLogin('author')}
                className="flex-1 bg-primary-100 hover:bg-primary-200 text-primary-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Demo as Author
              </button>
              <button
                onClick={() => demoLogin('reader')}
                className="flex-1 bg-success-100 hover:bg-success-200 text-success-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Demo as Reader
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onToggleMode}
              className="text-accent-600 hover:text-accent-700 font-medium"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}