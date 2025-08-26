import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx';
import NewTransaction from './pages/NewTransaction.jsx';
import Transactions from './pages/Transactions.jsx';
import Charts from './pages/Charts.jsx';

createRoot(document.getElementById('root')).render(
  
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='newtransaction' element={<NewTransaction/>}/>
          <Route path='transactions' element={<Transactions/>} />
          <Route path='charts' element={<Charts/>}/>
        </Routes>
      </BrowserRouter>
  
)
