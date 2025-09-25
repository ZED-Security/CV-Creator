import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.jsx'
import { CvProvider } from './context/cvContext.jsx';


const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <CvProvider>
      <App/>
    </CvProvider>
  </StrictMode>,
)
