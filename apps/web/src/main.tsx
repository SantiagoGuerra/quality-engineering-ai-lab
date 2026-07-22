import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@talent-lab/ui/styles.css';
import './styles.css';
import { App } from './App.js';
import { startPrivacyFirstReplay } from './session-replay.js';

void startPrivacyFirstReplay();
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
