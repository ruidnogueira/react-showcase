import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import './index.scss';

createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <App />
  </StrictMode>
);
