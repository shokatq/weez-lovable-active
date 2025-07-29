import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove Clerk dependency for faster loading
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById("root")!).render(
  <App />
);
