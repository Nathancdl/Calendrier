import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/soft.css'
import '@fontsource-variable/fraunces/soft-italic.css'
import '@fontsource-variable/figtree'
import '@fontsource-variable/caveat'
import './styles.css'
import App from './App'

// L'écriture manuscrite ne sert que dans le petit mot : on la charge d'avance
// pour qu'elle soit déjà là à l'ouverture de la première porte.
void document.fonts?.load('1em "Caveat Variable"')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
