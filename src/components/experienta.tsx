import React from 'react';
import "./experianta.css";
import TikTokIcon from "../assets/tiktokalb.svg"
import InstagramIcon from "../assets/instagramalb.svg"
import FacebookIcon from "../assets/facebookalb.svg"

const translations = {
  ro: {
    title: "Împărtășește-ți experiența din tur!",
    description: "Ai trăit momente de neuitat? Spune-le și prietenilor despre aventura ta! Călătoriile devin și mai speciale când le împărtășim cu cei dragi. Rămâi aproape de noi și urmărește-ne pe rețelele sociale pentru inspirație și noi destinații!"
  },
  ru: {
    title: "Поделитесь своими впечатлениями от тура!",
    description: "Вы пережили незабываемые моменты? Расскажите друзьям о своём приключении! Путешествия становятся ещё более особенными, когда мы делимся ими с близкими. Оставайтесь с нами и подпишитесь на нас в социальных сетях, чтобы вдохновляться новыми местами и открывать для себя что-то новое!"
  }
};

interface ExperientaProps {
  currentLang: 'ro' | 'ru';
}

const Experienta: React.FC<ExperientaProps> = ({ currentLang }) => {
  return (
    <div className="experienta">
        <h1 className="experienta-title">{translations[currentLang].title}</h1>
        <h2 className="experienta-description">{translations[currentLang].description}</h2>
        <ul className="experienta-social-list">
            <li>
              <a href="https://www.facebook.com/lumeata" target="_blank" rel="noopener noreferrer" className="experienta-social-button">
                <img src={FacebookIcon} alt="Facebook"/>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/lumeata.md/" target="_blank" rel="noopener noreferrer" className="experienta-social-button">
                <img src={InstagramIcon} alt="Instagram"/>
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@lumeata.md" target="_blank" rel="noopener noreferrer" className="experienta-social-button">
                <img src={TikTokIcon} alt="TikTok"/>
              </a>
            </li>
        </ul>
    </div>
  );
};

export default Experienta;