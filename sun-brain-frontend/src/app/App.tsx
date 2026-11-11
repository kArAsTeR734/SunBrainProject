import './styles/main.scss';

import { getRoutesConfig } from '@app/routes/config';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppInitializer } from './initialization/AppInitializer.tsx';

const router = createBrowserRouter(getRoutesConfig());

function App() {
  return (
    <React.Suspense fallback={<div>Загрузка...</div>}>
      <AppInitializer />
      <RouterProvider router={router} />
    </React.Suspense>
  );
}

export default App;
