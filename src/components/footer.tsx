import React from 'react';
import './footer.css';
import { useNavigate, useLocation } from 'react-router-dom';

const translations = {
  ru: {
    copyright: "© 2025 SRL Lumea Ta",
    home: "Главная",
    calendar: "Календарь",
    blog: "Блог",
    contacts: "Контакты",
    top: "Вверх"
  },
  ro: {
    copyright: "© 2025 SRL Lumea Ta",
    home: "Acasă",
    calendar: "Calendar",
    blog: "Blog",
    contacts: "Contacte",
    top: "Sus"
  }
};

interface FooterProps {
  currentLang: 'ro' | 'ru';
}

const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const forceScrollToTop = () => {
    // Method 1: Direct property manipulation
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Method 2: Force all scrollable elements to 0
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      if (element.scrollTop > 0) {
        element.scrollTop = 0;
      }
    });
    
    // Method 3: Use hash navigation trick
    window.location.hash = '#';
    window.location.hash = '';
    
    // Method 4: Multiple window.scrollTo calls
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100);
    setTimeout(() => window.scrollTo(0, 0), 200);
  };

  const forceScrollToBottom = () => {
    // Method 1: Try to find contacts or footer elements
    const contactsElement = document.querySelector('.contacts');
    const footerElement = document.querySelector('.footer');
    
    if (contactsElement) {
      // Force scroll to contacts using multiple methods
      contactsElement.scrollIntoView({ behavior: 'instant' });
      setTimeout(() => {
        contactsElement.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'instant' });
      setTimeout(() => {
        footerElement.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    
    // Method 2: Calculate and force scroll to maximum height
    const getMaxScrollHeight = () => {
      return Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
    };
    
    const maxHeight = getMaxScrollHeight();
    
    // Force scroll to bottom using multiple methods
    document.documentElement.scrollTop = maxHeight;
    document.body.scrollTop = maxHeight;
    window.scrollTo(0, maxHeight);
    
    setTimeout(() => {
      window.scrollTo({ top: maxHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleNavClick = (path: string) => {
    if (location.pathname === path) {
      forceScrollToTop();
    } else {
      navigate(path);
      // Scroll to top after navigation
      setTimeout(() => {
        forceScrollToTop();
      }, 100);
    }
  };

  const handleContactsClick = () => {
    forceScrollToBottom();
  };

  const handleTopClick = () => {
    forceScrollToTop();
  };

  return (
    <footer className="footer">
      <div className="footer-copyright">
        <p>{translations[currentLang].copyright}</p>
      </div>
      
      <nav className="footer-nav">
        <button 
          className="footer-nav-button"
          onClick={() => handleNavClick('/')}
        >
          {translations[currentLang].home}
        </button>
        <button 
          className="footer-nav-button"
          onClick={() => handleNavClick('/calendar')}
        >
          {translations[currentLang].calendar}
        </button>
        <button 
          className="footer-nav-button"
          onClick={() => handleNavClick('/blog')}
        >
          {translations[currentLang].blog}
        </button>
        <button 
          className="footer-nav-button"
          onClick={handleContactsClick}
        >
          {translations[currentLang].contacts}
        </button>
      </nav>
      
      <div className="footer-top">
        <button onClick={handleTopClick} className="footer-top-button">
          {translations[currentLang].top} ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;