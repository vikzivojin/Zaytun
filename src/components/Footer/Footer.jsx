import logoImg from "../../assets/images/zaytun-logo.png";
import { NavLink } from 'react-router-dom';
import "./Footer.scss";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="white" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8"/>
      <circle cx="17.5" cy="6.5" r="1" fill="white"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo">
        <NavLink to="/"><img src={logoImg} alt="Zaytün" /></NavLink>
      </div>

      <p className="footer__copy">© {new Date().getFullYear()} Zaytün. All rights reserved.</p>

      <div className="footer__links">
        <a
          href="https://www.instagram.com/iluvzaytun/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__instagram"
          aria-label="Follow Zaytün on Instagram"
        >
          <InstagramIcon />
        </a>
      </div>
    </footer>
  );
}
