// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from './services/cache/cachePolicy';
import { AppLayout } from './layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    // Technical Feature: Caching Engine
    <QueryClientProvider client={queryClient}>
      {/* Technical Feature: Navigation Engine */}
      <BrowserRouter>
        {/* The Visual Shell we discussed */}
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
