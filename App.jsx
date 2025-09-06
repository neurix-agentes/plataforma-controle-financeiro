import React, { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Lancamentos from './pages/Lancamentos'
import Painel from './pages/Painel'
import Dashboard from './pages/Dashboard'
import Calendario from './pages/Calendario'
import Parcelamentos from './pages/Parcelamentos'
import Metas from './pages/Metas'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lancamentos" element={<Lancamentos />} />
              <Route path="/painel" element={<Painel />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/parcelamentos" element={<Parcelamentos />} />
              <Route path="/metas" element={<Metas />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App

