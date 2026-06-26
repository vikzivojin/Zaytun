import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/Home/HomePage.jsx'
import OrderPage from './pages/Order/OrderPage.jsx'
import Contact from './pages/Contact/ContactPage.jsx'
import Locations from './pages/Locations/LocationsPage.jsx'
import ScrollToTop from './scripts/ScrollToTop.jsx'
import AdminPage from './pages/Admin/AdminPage.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin — no Navbar or Footer */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Public site */}
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/Home" element={<HomePage />} />
                <Route path="/Locations" element={<Locations />} />
                <Route path="/Order" element={<OrderPage />} />
                <Route path="/Contact" element={<Contact />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
