import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppProvider';
import './index.css';

createRoot(document.getElementById('root')).render(
    <AppProvider>
      <App />
    </AppProvider>
);
