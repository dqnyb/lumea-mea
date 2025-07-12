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
  setLiveChatOpen?: (open: boolean) => void; 
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

const AboutTrip: React.FC<AboutTripProps> = ({ currentLang, period, duration, difficulty, price, setLiveChatOpen }) => {

  const handleButtonClick = () => {
    if (setLiveChatOpen) {
      setLiveChatOpen(true);
    } else {
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
        onClick={handleButtonClick}
      >
        {translations[currentLang].button}
      </button>
      <h1 className="abouttrip-description">
        {(() => {
          const fullText = translations[currentLang].description;
          const words = fullText.split(' ');
          const lastThreeWords = words.slice(-3).join(' ');
          const remainingText = words.slice(0, -3).join(' ');
          
          return (
            <>
              {remainingText}{' '}
              <span 
                onClick={() => {
                  window.location.href = '/reguli';
                }}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {lastThreeWords}
              </span>
            </>
          );
        })()}
      </h1>
    </div>
  );
};

export default AboutTrip;