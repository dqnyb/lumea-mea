import React from 'react';
import './inwork.css';
import NavBar from '../components/navbar';
import LiveChat from '../components/LiveChat';

const translations = {
  ro: {
    title: "Pagină în lucru",
    description: "Această pagină este în curs de dezvoltare. Revenim în curând!"
  },
  ru: {
    title: "Страница в разработке",
    description: "Эта страница находится в разработке. Скоро вернемся!"
  }
};

interface InWorkPageProps {
  currentLang: 'ro' | 'ru';
  setCurrentLang: (lang: 'ro' | 'ru') => void;
}

const InWorkPage: React.FC<InWorkPageProps> = ({ currentLang, setCurrentLang }) => {
  return (
    <div className="inwork-page">
      <NavBar currentLang={currentLang} setCurrentLang={setCurrentLang} />
      <LiveChat />
      <div className="inwork-content">
        <h1 className="inwork-title">{translations[currentLang].title}</h1>
        <p className="inwork-description">{translations[currentLang].description}</p>
        <div className="inwork-animation">
          <div className="gear" />
          <div className="gear gear2" />
        </div>
      </div>
    </div>
  );
};

export default InWorkPage;