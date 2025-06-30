import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SupabaseAuthProvider } from './hooks/useSupabaseAuth';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseAuthProvider>
      <App />
    </SupabaseAuthProvider>
  </StrictMode>
);
