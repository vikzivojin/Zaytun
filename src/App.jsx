import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/Home/HomePage.jsx'
import OrderPage from './pages/Order/OrderPage.jsx'
import Contact from './pages/Contact/ContactPage.jsx'
import Locations from './pages/Locations/LocationsPage.jsx'
import ScrollToTop from './scripts/ScrollToTop.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes> 
        <Route path="/" element={<HomePage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Locations" element={<Locations />} />
        <Route path="/Order" element={<OrderPage />} />
        <Route path="/Contact" element={<Contact />} />
        {/* <Route path="*" element={<PageNotFound title="404 - PAGE NOT FOUND"
          content="The content you are looking for cannot be found." />} />
        <Route path="/test" element={""} /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
