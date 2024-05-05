import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout.tsx'
import Homepage from './pages/Homepage.tsx'
import WordWizard from './pages/WordWizard.tsx'
import CloudRocket from './pages/CloudRocket.tsx'
import Chip8Emulator from './pages/Chip8Emulator.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="word-wizard" element={<WordWizard />} />
          <Route path="cloud-rocket" element={<CloudRocket />} />
          <Route path="chip8-emulator" element={<Chip8Emulator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
