import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(<StrictMode><App /></StrictMode>);
