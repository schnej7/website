import './App.scss'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout.tsx'
import Homepage from './pages/Homepage.tsx'
import WordWizard from './pages/wordWizard/WordWizard.tsx'
import CloudRocket from './pages/cloudRocket/CloudRocket.tsx'
import Chip8Emulator from './pages/chip8/Chip8Emulator.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
        </Route>
        <Route path="/" element={<Layout smallHeader={true} />}>
          <Route path="word-wizard" element={<WordWizard />} />
          <Route path="chip8-emulator" element={<Chip8Emulator />} />
        </Route>
        <Route path="/" element={<Layout noHeader={true} />}>
          <Route path="cloud-rocket" element={<CloudRocket />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
