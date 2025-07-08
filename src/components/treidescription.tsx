import React from 'react';
import './treidescription.css';

const translations = {
  ru: {
    title: "Описание путешествия",
  },
  ro: {
    title: "Descrierea turului",
  }
};

interface TripDescriptionProps {
  currentLang: 'ro' | 'ru';
  description: string;
  text: string;
  image: string;
}

const TripDescription: React.FC<TripDescriptionProps> = ({ 
  currentLang, 
  description, 
  text, 
  image 
}) => {
  return (
    <div className="trip-description">
      <div className="trip-description-container">
        <h1 className="trip-description-title">{translations[currentLang].title}</h1>
        <p className="trip-description-description">{description}</p>
        
        <div className="trip-description-content">
          <div className="trip-description-text-section">
            <div 
              className="trip-description-text" 
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
          
          <div className="trip-description-image-section">
            <img src={image} className="trip-description-image"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDescription;