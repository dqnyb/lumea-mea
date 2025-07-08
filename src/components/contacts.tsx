import React from 'react';
import './contacts.css';
import natalia from "../assets/natalia.svg"
import viber from "../assets/viber.svg"
import whatsapp from "../assets/wa.svg"
import telegram from "../assets/telegram.svg"
import facebook from "../assets/facebookc.svg"
import instagram from "../assets/instagramc.svg"
import tiktok from "../assets/tiktokc.svg"
import youtube from "../assets/youtube.svg"

const translations = {
  ru: {
    title: "ДЛЯ СВЯЗИ",
    text: "Напишите нам с любовью или позвоните нам – мы действительно любим быть рядом с вами!",
    name: "Наталья",
    description: "Координатор и опытный гид",
    number: "+373 69 69 22 65",
    email: "lumeata.md@gmail.com"
  },
  ro: {
    title: "Contact",
    text: "Scrie-ne cu drag sau sună-ne – iubim cu adevărat să fim aproape de voi!",
    name: "Natalia",
    description: "Coordonator și ghid experimentat",
    number: "+373 69 69 22 65",
    email: "lumeata.md@gmail.com"
  }
};

interface ContactsProps {
  currentLang: 'ro' | 'ru';
}

const Contacts: React.FC<ContactsProps> = ({ currentLang }) => {
  return (
    <div className="contacts">
      <h1 className="contacts-title">{translations[currentLang].title}</h1>
      <p className="contacts-text">{translations[currentLang].text}</p>
      <img src={natalia} className='contacts-image'/>
      <h2 className="contacts-name">{translations[currentLang].name}</h2>
      <p className="contacts-description">{translations[currentLang].description}</p>
      <p className="contacts-number">{translations[currentLang].number}</p>
      <p className="contacts-email">{translations[currentLang].email}</p>
      <ul>
        <li>
          <a href="viber://chat?number=%2B37369692265" target="_blank" rel="noopener noreferrer">
            <img src={viber} alt="Viber" />
          </a>
        </li>
        <li>
          <a href="https://api.whatsapp.com/send/?phone=37369692265&text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82%21+%D0%96%D0%B5%D0%BB%D0%B0%D1%8E+%D0%B7%D0%B0%D0%B4%D0%B0%D1%82%D1%8C+%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
            <img src={whatsapp} alt="WhatsApp" />
          </a>
        </li>
        <li>
          <a href="https://t.me/NataliaSemenciuc" target="_blank" rel="noopener noreferrer">
            <img src={telegram} alt="Telegram" />
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/lumeata" target="_blank" rel="noopener noreferrer">
            <img src={facebook} alt="Facebook" />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/lumeata.md/" target="_blank" rel="noopener noreferrer">
            <img src={instagram} alt="Instagram" />
          </a>
        </li>
        <li>
          <a href="https://www.tiktok.com/@lumeata.md" target="_blank" rel="noopener noreferrer">
            <img src={tiktok} alt="TikTok" />
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/@LumeaTa_md" target="_blank" rel="noopener noreferrer">
            <img src={youtube} alt="YouTube" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contacts;