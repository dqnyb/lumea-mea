import React from 'react';
import './TwoColumnCards.css';

interface TwoColumnCardsProps {
  list1: string[];
  list2: string[];
  title1?: string;
  title2?: string;
}

const TwoColumnCards: React.FC<TwoColumnCardsProps> = ({
  list1,
  list2,
  title1 = "Card 1",
  title2 = "Card 2"
}) => {
  return (
    <div className="two-column-cards">
      <div className="card-container">
        <div className="card">
          <h3 className="card-title">{title1}</h3>
          <div className="card-content">
            {list1.map((item, index) => (
              <div key={index} className="card-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card-container">
        <div className="card">
          <h3 className="card-title">{title2}</h3>
          <div className="card-content">
            {list2.map((item, index) => (
              <div key={index} className="card-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnCards;