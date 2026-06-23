import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Customers from './pages/Customers'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/customers" element={<Customers />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
