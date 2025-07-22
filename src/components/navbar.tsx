import './navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import navbarbg from "../assets/navbarbg.png"
import logo from "../assets/logo.svg"
import tiktok from "../assets/tiktok.svg"
import facebook from "../assets/facebook.svg"
import instagram from "../assets/instagram.svg"
// Import icons for mobile navigation
// Temporary placeholder if you don't have icons yet
const homeIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2300417A' viewBox='0 0 24 24'%3E%3Cpath d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'/%3E%3C/svg%3E";
const calendarIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2300417A' viewBox='0 0 24 24'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3E%3C/svg%3E";
const blogIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2300417A' viewBox='0 0 24 24'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E";
const faqIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2300417A' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z'/%3E%3C/svg%3E";
const contactIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2300417A' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E";

const translations = {
  ru: {
    home: "Главная",
    calendar: "Календарь",
    blog: "Блог",
    faq: "FAQ",
    contacts: "Контакты",
  },
  ro: {
    home: "Acasă",
    calendar: "Calendar",
    blog: "Blog",
    faq: "FAQ",
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
  const location = useLocation();

  const handleLanguageChange = (lang: 'ro' | 'ru') => {
    setCurrentLang(lang);
    setDropdownOpen(false);
  };

  const handleHomeClick = () => {
    setShouldScrollHome(true);
  };

  const scrollToBottom = () => {
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
    <>
      {/* Desktop Navigation */}
      <nav className="navbar desktop-navbar" style={{ backgroundImage: `url(${navbarbg})` }}>
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="navbar-menu">
          <Link to="/" onClick={handleHomeClick}>
            {translations[currentLang].home}
          </Link>
          <Link to="/calendar">
            {translations[currentLang].calendar}
          </Link>
          <Link to="/blog">
            {translations[currentLang].blog}
          </Link>
          <Link to="/faq">
            {translations[currentLang].faq}
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

      {/* Mobile Navigation */}
      <nav className="mobile-navbar">
        <Link to="/" className="mobile-nav-item" onClick={handleHomeClick}>
          <img src={homeIcon} alt="Home" className="mobile-nav-icon" />
          <span className="mobile-nav-text">{translations[currentLang].home}</span>
        </Link>
        <Link to="/calendar" className="mobile-nav-item">
          <img src={calendarIcon} alt="Calendar" className="mobile-nav-icon" />
          <span className="mobile-nav-text">{translations[currentLang].calendar}</span>
        </Link>
        <Link to="/blog" className="mobile-nav-item">
          <img src={blogIcon} alt="Blog" className="mobile-nav-icon" />
          <span className="mobile-nav-text">{translations[currentLang].blog}</span>
        </Link>
        <Link to="/faq" className="mobile-nav-item">
          <img src={faqIcon} alt="FAQ" className="mobile-nav-icon" />
          <span className="mobile-nav-text">{translations[currentLang].faq}</span>
        </Link>
        <a href="#" className="mobile-nav-item" onClick={handleContactsClick}>
          <img src={contactIcon} alt="Contact" className="mobile-nav-icon" />
          <span className="mobile-nav-text">{translations[currentLang].contacts}</span>
        </a>
        
        {/* Language switcher in mobile */}
        <div className="mobile-language-switcher">
          <button
            className="mobile-language-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {currentLang === 'ro' ? 'Ro' : 'Ru'}
          </button>
          {dropdownOpen && (
            <div className="mobile-language-dropdown">
              <button onClick={() => handleLanguageChange('ro')}>Ro</button>
              <button onClick={() => handleLanguageChange('ru')}>Ru</button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;