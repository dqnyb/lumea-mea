import React from 'react';
import './abouttrip.css';
import perioada from "../assets/perioada.svg";
import durata from "../assets/durata.svg";
import dificulatete from "../assets/dificultate.svg";
import pret from "../assets/pret.svg";

interface AboutTripProps {
  currentLang: 'ro' | 'ru';
  period: string;
  duration: string;
  difficulty: string;
  price: string;
}

const translations = {
  ru: {
    title: "О поездке",
    time: "Период",
    duration: "Длительность",
    difficulty: "Сложность",
    price: "Цена",
    button: "Забронировать место",
    description: "Нажимая кнопку, вы даете согласие на обработку персональных данных и соглашаетесь с политикой конфиденциальности."
  },
  ro: {
    title: "Despre Călătorie",
    time: "Perioada",
    duration: "Durata",
    difficulty: "Dificultate",
    price: "Preț",
    button: "Rezervă-ți locul",
    description: "Făcând clic pe buton, îți dai consimțământul pentru prelucrarea datelor personale și ești de acord cu politica de confidențialitate."
  }
};

const AboutTrip: React.FC<AboutTripProps> = ({ currentLang, period, duration, difficulty, price }) => {
  const scrollToBottom = () => {
    // Method inspired by navbar.tsx - find contacts or footer element directly
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

  return (
    <div className="abouttrip">
      <h1 className='abouttrip-title'>{translations[currentLang].title}</h1>
      <ul className="abouttrip-list">
        <li className="abouttrip-list-item">
          <img src={perioada} className="abouttrip-list-item-img" />
          <div>
            <h2 className="abouttrip-list-item-title">{translations[currentLang].time}</h2>
            <p className="abouttrip-list-item-value">{period}</p>
          </div>
        </li>
        <li className="abouttrip-list-item">
          <img src={durata} className="abouttrip-list-item-img" />
          <div>
            <h2 className="abouttrip-list-item-title">{translations[currentLang].duration}</h2>
            <p className="abouttrip-list-item-value">{duration}</p>
          </div>
        </li>
        <li className="abouttrip-list-item">
          <img src={dificulatete} className="abouttrip-list-item-img" />
          <div>
            <h2 className="abouttrip-list-item-title">{translations[currentLang].difficulty}</h2>
            <p className="abouttrip-list-item-value">{difficulty}</p>
          </div>
        </li>
        <li className="abouttrip-list-item">
          <img src={pret} className="abouttrip-list-item-img" />
          <div>
            <h2 className="abouttrip-list-item-title">{translations[currentLang].price}</h2>
            <p className="abouttrip-list-item-value">{price}</p>
          </div>
        </li>
      </ul>
      <button 
        className="abouttrip-button" 
        onClick={scrollToBottom}
      >
        {translations[currentLang].button}
      </button>
      <p className="abouttrip-description">{translations[currentLang].description}</p>
    </div>
  );
};

export default AboutTrip;