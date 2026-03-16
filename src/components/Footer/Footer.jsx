import logoImg      from "../../assets/images/zaytun-logo.png";
import "./Footer.scss";

export default function Footer() {

    return(
        <>

            <footer className="footer">
                <div className="footer__logo">
                <a href="/"><img src={logoImg} alt="Zaytün" /></a>
                </div>

                <p className="footer__copy">© {new Date().getFullYear()} Zaytün. All rights reserved.</p>

                <nav className="footer__links">
                <a href="/Home">Home</a>
                <a href="/Locations">Locations</a>
                <a href="/Contact">Contact</a>
                <a href="/Order">Order</a>
                
                </nav>
            </footer>
            
        </>


    )
}

