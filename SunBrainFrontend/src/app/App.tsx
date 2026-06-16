import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import '../styles/main.scss';
import { getRoutesConfig } from '@/app/providers/routes/config.tsx';
import { AppInitializer } from '@app/providers/AppInit/AppInitializer.tsx';

function App() {
  const router = createBrowserRouter(getRoutesConfig());

  return (
    <React.Suspense fallback={<div>Загрузка...</div>}>
      <AppInitializer />
      <RouterProvider router={router} />
    </React.Suspense>
  );
}

export default App;
