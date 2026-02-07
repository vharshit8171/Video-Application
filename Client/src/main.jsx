import './index.css'
import App from './App.jsx'
import Stairs from '../src/components/ui/Animation.jsx'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Stairs>
        <App />
    </Stairs>
    </BrowserRouter>
)
