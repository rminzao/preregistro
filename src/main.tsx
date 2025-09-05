import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if (import.meta.env.DEV) {
  console.log(
    "%cDesenvolvido por rmdev 🚀",
    "color: #fff; background: #6b21a8; padding: 4px 8px; border-radius: 4px; font-weight: bold;"
  );
}

createRoot(document.getElementById("root")!).render(<App />);

createRoot(document.getElementById("root")!).render(<App />);
