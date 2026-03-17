import logoImg      from "../../assets/images/zaytun-logo.png";
import { Link, NavLink } from 'react-router-dom';
import "./Footer.scss";
import "../Navbar/Navbar.scss";

const navItems = ["Home", "Locations", "Contact", "Order"];

export default function Footer() {

    return(
        <>

            <footer className="footer">
                <div className="footer__logo">
                <a href="/"><img src={logoImg} alt="Zaytün" /></a>
                </div>

                <p className="footer__copy">© {new Date().getFullYear()} Zaytün. All rights reserved.</p>

                <nav className="footer__links">
                    <ul className="nav-links">
                            {navItems.map((item, i) => (
                              <>
                                {i > 0 && <div className="nav-divider" key={`div-${i}`} />}
                                <li key={item}>
                                  <NavLink to={item}>
                                  <button
                                    className="nav-link-btn"
                                  >
                                    {item}
                                    
                                  </button>
                                  </NavLink>
                                </li>
                              </>
                            ))}
                          </ul>
                
                </nav>
            </footer>
            
        </>


    )
}

