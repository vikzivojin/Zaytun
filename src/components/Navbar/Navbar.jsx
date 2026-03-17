import { useState, useEffect } from "react";
import { Link, NavLink } from 'react-router-dom'
import "./Navbar.scss";
import logopicture from '../../assets/images/zaytun-logo.png'

const navItems = ["Home", "Locations", "Contact", "Order"];

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className="nav-root">
        <div className={`nav-inner ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-logo">
            <a href="/"><img src={logopicture} height="70"/></a>
          </div>

          {/* Desktop nav */}
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

          {/* Hamburger button (mobile only) */}
          <button
            className={`nav-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`nav-mobile-overlay ${menuOpen ? "open" : ""}`}>
        <ul className="nav-mobile-links">
          {navItems.map((item, i) => (
            <li key={item} style={{ animationDelay: `${i * 0.07}s` }}>
              <NavLink to={item}>
                <button
                  className={`nav-mobile-btn ${active === item ? "active" : ""}`}
                  onClick={() => { setActive(item); setMenuOpen(false); }}
                >
                  {item}
                </button>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
