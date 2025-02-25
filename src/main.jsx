import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
  
)
