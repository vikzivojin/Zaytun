import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home.jsx'
import OrderPage from './pages/Order/OrderPage.jsx'
//import Contact from './pages/Contact/Contact.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/Order" element={<OrderPage />} />
        {/* <Route path="*" element={<PageNotFound title="404 - PAGE NOT FOUND"
          content="The content you are looking for cannot be found." />} />
        <Route path="/test" element={""} /> */}
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
