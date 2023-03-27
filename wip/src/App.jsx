import { useState } from 'react'
import { Navbar, Footer } from './comp'
import { Aboutme, Mlp, Pas, Frequencies} from './pages'
import {Routes, Route} from 'react-router-dom'
import './App.css'


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Mlp />} />
        <Route path='/pas' element={<Pas />} />
        <Route path='/about-me' element={<Aboutme />} />
        <Route path='/frequencies' element={<Frequencies />} />

      </Routes>
      <Footer />


    </div>
  )
}

export default App
