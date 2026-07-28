/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppContent from './App.jsx';
import { LanguageProvider } from './context/LanguageContext';

const App = () => {
  return (
    <React.StrictMode>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </React.StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<App />);
