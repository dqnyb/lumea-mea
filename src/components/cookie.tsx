import React, { useState, useEffect } from 'react';
import './cookie.css';

interface CookieConsentProps {
  onAccept?: () => void;
  onReject?: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onReject }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState<'ro' | 'ru'>('ro');

  const translations = {
    ro: {
      title: "Cookie-uri",
      message: "Utilizăm cookie-uri pentru a îmbunătăți experiența ta pe site. Prin continuarea navigării, ești de acord cu utilizarea acestora.",
      accept: "Accept",
      reject: "Refuz",
      learnMore: "Detalii"
    },
    ru: {
      title: "Cookie",
      message: "Мы используем файлы cookie для улучшения вашего опыта на сайте. Продолжая навигацию, вы соглашаетесь на их использование.",
      accept: "Принять",
      reject: "Отклонить",
      learnMore: "Подробнее"
    }
  };

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show popup after a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Get current language from localStorage or default to 'ro'
    const lang = (localStorage.getItem('lang') as 'ro' | 'ru') || 'ro';
    setCurrentLang(lang);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    onAccept?.();
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
    onReject?.();
  };

  const handleLearnMore = () => {
    const googleCookiePolicyUrl = currentLang === 'ru' 
      ? 'https://policies.google.com/technologies/cookies?hl=ru'
      : 'https://policies.google.com/technologies/cookies?hl=ro';
    
    window.open(googleCookiePolicyUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="cookie-overlay" />
      <div className="cookie-container">
        <div className="cookie-text">
          <h4 className="cookie-title">{translations[currentLang].title}</h4>
          <p className="cookie-message">{translations[currentLang].message}</p>
        </div>
        
        <div className="cookie-buttons">
          <button 
            className="cookie-btn cookie-btn-learn"
            onClick={handleLearnMore}
          >
            {translations[currentLang].learnMore}
          </button>
          <button 
            className="cookie-btn cookie-btn-reject"
            onClick={handleReject}
          >
            {translations[currentLang].reject}
          </button>
          <button 
            className="cookie-btn cookie-btn-accept"
            onClick={handleAccept}
          >
            {translations[currentLang].accept}
          </button>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;