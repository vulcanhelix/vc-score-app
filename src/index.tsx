import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './lib/utils';

// Import Tailwind CSS
import '../tailwind.css';

// Create the app component for vite-ssg
export const createApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Client-side rendering
if (typeof window !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('app')!);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
