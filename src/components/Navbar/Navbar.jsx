import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.scss";
import logopicture from '../../assets/images/zaytun-logo.png';

const navItems = [
  { label: "Home",      path: "/"         },
  { label: "Locations", path: "/locations" },
  { label: "Contact",   path: "/contact"  },
  { label: "Order",     path: "/order"    },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  // Derive the active label from the current URL
  const activeLabel = (() => {
    const match = navItems.find(item =>
      item.path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.path)
    );
    return match?.label ?? "";
  })();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <nav className="nav-root">
        <div className={`nav-inner ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-logo">
            <NavLink to="/"><img src={logopicture} height="70" alt="Zaytün" /></NavLink>
          </div>

          {/* Desktop nav */}
          <ul className="nav-links">
            {navItems.map((item, i) => (
              <>
                {i > 0 && <div className="nav-divider" key={`div-${i}`} />}
                <li key={item.label}>
                  <NavLink to={item.path}>
                    <button className={`nav-link-btn ${activeLabel === item.label ? "active" : ""}`}>
                      {item.label}
                    </button>
                  </NavLink>
                </li>
              </>
            ))}
          </ul>

          {/* Hamburger (mobile only) */}
          <button
            className={`nav-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(m => !m)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`nav-mobile-overlay ${menuOpen ? "open" : ""}`}>
        <ul className="nav-mobile-links">
          {navItems.map((item, i) => (
            <li key={item.label} style={{ animationDelay: `${i * 0.07}s` }}>
              <NavLink to={item.path}>
                <button className={`nav-mobile-btn ${activeLabel === item.label ? "active" : ""}`}>
                  {item.label}
                </button>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
