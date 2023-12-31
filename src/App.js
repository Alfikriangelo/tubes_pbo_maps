import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import Maps from './Pages/Maps'
import Login from './Pages/Login'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/maps' element={<Maps />}/>
      </Routes>
    </Router>
  )
}

export default App