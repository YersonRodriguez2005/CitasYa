import React from 'react'
import NavBar from './components/navBar'
import ListCitas from './components/listCitas'
import CreateCita from './components/createCitas'
import EditCita from './components/editCitas'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<ListCitas />} />
          <Route path="/create" element={<CreateCita />} />
          <Route path="/edit/:id" element={<EditCita />} />
        </Routes>
      </Router>
    </>
  )
}
