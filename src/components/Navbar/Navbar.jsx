import { useState, useEffect } from "react";
import { Link, NavLink } from 'react-router-dom'
import "./Navbar.scss";
import logopicture from '../../assets/images/zaytun-logo.png'

const navItems = ["Home", "Locations", "Contact", "Order"];

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      <nav className="nav-root">
        <div className={`nav-inner ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-logo">
            <a href="/"><img src={logopicture} height="70"/></a>
          </div>

          <ul className="nav-links">
            {navItems.map((item, i) => (
              <>
                {i > 0 && <div className="nav-divider" key={`div-${i}`} />}
                <li key={item}>
                  <NavLink to={item}>
                  <button
                    className={`nav-link-btn ${active === item ? "active" : ""}`}
                    onClick={() => setActive(item)}
                  >
                    {item}
                    
                  </button>
                  </NavLink>
                </li>
              </>
            ))}
          </ul>
        </div>
      </nav>

      
    </>
  );
}
