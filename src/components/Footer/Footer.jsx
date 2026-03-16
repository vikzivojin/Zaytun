import logoImg      from "../../assets/images/zaytun-logo.png";
import "./Footer.scss";

export default function Footer() {

    return(
        <>

            <footer className="footer">
                <div className="footer__logo">
                <img src={logoImg} alt="Zaytün" />
                </div>

                <p className="footer__copy">© {new Date().getFullYear()} Zaytün. All rights reserved.</p>

                <nav className="footer__links">
                <a href="/">Home</a>
                <a href="/contact">Contact</a>
                <a href="/order">Order</a>
                
                </nav>
            </footer>
            
        </>


    )
}

