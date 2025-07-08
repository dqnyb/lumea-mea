import './navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import navbarbg from "../assets/navbarbg.png"
import logo from "../assets/logo.svg"
import tiktok from "../assets/tiktok.svg"
import facebook from "../assets/facebook.svg"
import instagram from "../assets/instagram.svg"

const translations = {
  ru: {
    home: "Главная",
    calendar: "Календарь",
    blog: "Блог",
    contacts: "Контакты",
  },
  ro: {
    home: "Acasă",
    calendar: "Calendar",
    blog: "Blog",
    contacts: "Contacte",
  }
};

interface NavBarProps {
  currentLang: 'ro' | 'ru';
  setCurrentLang: (lang: 'ro' | 'ru') => void;
}

const Navbar: React.FC<NavBarProps> = ({ currentLang, setCurrentLang }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shouldScrollHome, setShouldScrollHome] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLanguageChange = (lang: 'ro' | 'ru') => {
    setCurrentLang(lang);
    setDropdownOpen(false);
  };

  const handleHomeClick = () => {
    setShouldScrollHome(true);
  };

  const scrollToBottom = () => {
    // Find the contacts or footer element directly
    const contactsElement = document.querySelector('.contacts');
    const footerElement = document.querySelector('.footer');
    
    if (contactsElement) {
      contactsElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else if (footerElement) {
      footerElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll to end of document
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleContactsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToBottom();
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (shouldScrollHome && location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setShouldScrollHome(false);
    }
  }, [location.pathname, shouldScrollHome]);

  return (
    <nav className="navbar" style={{ backgroundImage: `url(${navbarbg})` }}>
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      {/* Hamburger icon for mobile */}
      <button
        className="navbar-hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Open menu"
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`navbar-menu${mobileMenuOpen ? ' open' : ''}`}>
        {/* Show logo inside menu on mobile */}
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <Link to="/" onClick={handleHomeClick}>
          {translations[currentLang].home}
        </Link>
        <Link to="/calendar">
          {translations[currentLang].calendar}
        </Link>
        <Link to="/blog">
          {translations[currentLang].blog}
        </Link>
        <a href="#" onClick={handleContactsClick}>{translations[currentLang].contacts}</a>
        <div className="language-switcher">
          <button
            className="language-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {currentLang === 'ro' ? 'Ro' : 'Ru'}
          </button>
          {dropdownOpen && (
            <div className="language-dropdown">
              <button onClick={() => handleLanguageChange('ro')}>Ro</button>
              <button onClick={() => handleLanguageChange('ru')}>Ru</button>
            </div>
          )}
        </div>
      </div>
      <div className="navbar-social">
        <a href="https://www.tiktok.com/@lumeata.md" target="_blank" rel="noopener noreferrer">
          <img src={tiktok} alt="TikTok" />
        </a>
        <a href="https://www.facebook.com/lumeata" target="_blank" rel="noopener noreferrer">
          <img src={facebook} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/lumeata.md/" target="_blank" rel="noopener noreferrer">
          <img src={instagram} alt="Instagram" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;