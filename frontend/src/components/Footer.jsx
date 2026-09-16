import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div className="site-footer__brand">
          <img src={logo} alt="T-Construction logo" />
          <div>
            <div className="site-footer__name">T-CONSTRUCTION</div>
            <div className="site-footer__tag">Where Vision Becomes Structure</div>
          </div>
        </div>

        <div className="site-footer__col">
          <div className="site-footer__heading">Site</div>
          <Link to="/">Home</Link>
          <Link to="/work">Our Work</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/about">About</Link>
          <Link to="/request">Request a Job</Link>
        </div>

        <div className="site-footer__col">
          <div className="site-footer__heading">Contact</div>
          <a href="tel:+234 8131369040">+234 813 136 9040</a>
          <a href="mailto:info@t-construction.com">info@t-construction.com</a>
          <span>Nigeria</span>
        </div>
      </div>

      <div className="wrap site-footer__bottom">
        <span>© {new Date().getFullYear()} T-Construction. All rights reserved.</span>
      </div>
    </footer>
  );
}
