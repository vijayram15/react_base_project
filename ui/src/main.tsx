// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { i18nService } from './services/i18n/i18nService';

// 1. Initialize Technical Features before rendering
async function bootstrap() {
  // Fetch initial language bundle from Struts/Spring or local JSON
  await i18nService.init(); 

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
