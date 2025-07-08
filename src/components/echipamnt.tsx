import React from 'react';
import icon1 from "../assets/echipament1.svg"
import icon2 from "../assets/echipament2.svg"
import icon3 from "../assets/echipament3.svg"
import icon4 from "../assets/echipament4.svg"
import icon5 from "../assets/echipament5.svg"
import icon6 from "../assets/echipament6.svg"
import "./echipamnt.css"

const translations = {
  ru: {
    title: "Рекомендуемое снаряжение",
    item1: "Рюкзак",
    item2: "Треккинговые ботинки",
    item3: "Куртка",
    item4: "Спальный мешок",
    item5: "Фонарик",
    item6: "Солнцезащитные очки"
  },
  ro: {
    title: "Echipament Recomandat",
    item1: "Îmbrăcăminte",
    item2: "Pentru odihnă",
    item3: "Pregătirea bagajului",
    item4: "Documente",
    item5: "Medicamente",
    item6: "Igienă personală"
  }
};

interface EchipamntProps {
  currentLang: 'ro' | 'ru';
  itemDescriptions?: string[];
}

const Echipamnt: React.FC<EchipamntProps> = ({ currentLang, itemDescriptions = [] }) => {
  return (
    <div className="echipamnt">
      <h1 className="echipamnt-title">{translations[currentLang].title}</h1>
      <ul className="echipamnt-list">
        <li className="echipamnt-item">
          <img src={icon1} alt={translations[currentLang].item1} />
          <div className="echipamnt-item-content">
            <span className="echipamnt-item-title">{translations[currentLang].item1}</span>
            {itemDescriptions[0] && <p className="echipamnt-item-description">{itemDescriptions[0]}</p>}
          </div>
        </li>
        <li className="echipamnt-item">
          <img src={icon2} alt={translations[currentLang].item2} />
          <div className="echipamnt-item-content">
            <span className="echipamnt-item-title">{translations[currentLang].item2}</span>
            {itemDescriptions[1] && <p className="echipamnt-item-description">{itemDescriptions[1]}</p>}
          </div>
        </li>
        <li className="echipamnt-item">
          <img src={icon3} alt={translations[currentLang].item3} />
          <div className="echipamnt-item-content">
            <span className="echipamnt-item-title">{translations[currentLang].item3}</span>
            {itemDescriptions[2] && <p className="echipamnt-item-description">{itemDescriptions[2]}</p>}
          </div>
        </li>
        <li className="echipamnt-item">
          <img src={icon4} alt={translations[currentLang].item4} />
          <div className="echipamnt-item-content">
            <span className="echipamnt-item-title">{translations[currentLang].item4}</span>
            {itemDescriptions[3] && <p className="echipamnt-item-description">{itemDescriptions[3]}</p>}
          </div>
        </li>
        <li className="echipamnt-item">
          <img src={icon5} alt={translations[currentLang].item5} />
          <div className="echipamnt-item-content">
            <span className="echipamnt-item-title">{translations[currentLang].item5}</span>
            {itemDescriptions[4] && <p className="echipamnt-item-description">{itemDescriptions[4]}</p>}
          </div>
        </li>
        <li className="echipamnt-item">
          <img src={icon6} alt={translations[currentLang].item6} />
          <div className="echipamnt-item-content">
            <span className="echipamnt-item-title">{translations[currentLang].item6}</span>
            {itemDescriptions[5] && <p className="echipamnt-item-description">{itemDescriptions[5]}</p>}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Echipamnt;