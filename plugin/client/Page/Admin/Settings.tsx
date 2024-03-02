import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/Shared/App';
import '@/assets/styles/index.css';

document.getElementById('agent-wp-loading')?.remove();
ReactDOM.createRoot(document.getElementById('agent-wp-root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
