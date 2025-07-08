import React, { useState } from 'react';
import './calendar.css';

const translations = {
  ru: {
    title : "Расписание поездки"
  },
  ro: {
    title : "Programul călătoriei"
  }
};

interface CalendarProps {
  currentLang: 'ro' | 'ru';
  buttonCount: number;
  buttonTexts: string[];
  buttonContents?: string[];
  buttonImages?: string[];
  id?: string;
}

const Calendar: React.FC<CalendarProps> = ({ currentLang, buttonCount, buttonTexts, buttonContents, buttonImages }) => {
  const [activeButton, setActiveButton] = useState<number | null>(0);

  const renderButtons = () => {
    const buttons = [];
    for (let i = 0; i < buttonCount && i < buttonTexts.length; i++) {
      buttons.push(
        <button 
          key={i} 
          className={`calendar-button ${activeButton === i ? 'active' : ''}`}
          onClick={() => setActiveButton(activeButton === i ? null : i)}
        >
          {buttonTexts[i]}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="calendar">
      <h1 className='calendar-title'>{translations[currentLang].title}</h1>
      <div className="calendar-buttons-row">
        {renderButtons()}
      </div>
      
      {/* Display content based on active button */}
      {activeButton !== null && (
        <div className="calendar-content">
          <div className="calendar-content-inner">
            <div className="calendar-content-text">
              {buttonContents && buttonContents[activeButton] ? (
                <div dangerouslySetInnerHTML={{ __html: buttonContents[activeButton] }} />
              ) : (
                <p>Content for {buttonTexts[activeButton]}</p>
              )}
            </div>
            {buttonImages && buttonImages[activeButton] && (
              <img 
                src={buttonImages[activeButton]} 
                alt={buttonTexts[activeButton]} 
                className="calendar-content-image"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;