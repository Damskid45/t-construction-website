import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import './Header.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Our Work' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about', label: 'About' },
  { to: '/request', label: 'Request a Job' }
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <NavLink to="/" className="site-header__brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="T-Construction logo" />
          <span>T-CONSTRUCTION</span>
        </NavLink>

        <button
          className="site-header__toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-header__nav ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `site-header__link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
