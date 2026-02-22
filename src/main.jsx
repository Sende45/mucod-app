import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// L'ordre est crucial : l'index.css doit être chargé ici
import './index.css' 
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)