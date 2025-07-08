import React from 'react';
import './tripcarusel.css';
import { useNavigate } from 'react-router-dom';
import trip1 from '../assets/trip1.jpg';
import trip2 from '../assets/trip2.jpg';
import trip3 from '../assets/trip3.jpg';

const translations = {
  ru: {
    trip1title: "Марокко по максимуму",
    trip1description: "8 дней, в которые вы забудете, что такое рутина.",
    trip1price: "1260 €",
    trip2title: "Драконы Небесной Империи",
    trip2description: "Китай, где каждый день как фильм.",
    trip2price: "2640 €",
    trip3title: "Путь Сантьяго",
    trip3description: "Путь Сантьяго - это время тишины, погружения в глубины",
    trip3price: "2450 €",
    tripbutton: "Подробнее"
  },
  ro: {
    trip1title: "Maroc la maxim",
    trip1description: "8 zile în care vei uita ce este o rutină.",
    trip1price: "1260 €",
    trip2title: "Dragonii Imperiului Celest",
    trip2description: "China, unde fiecare zi este ca un film.",
    trip2price: "2640 €",
    trip3title: "Pune Santigyao",
    trip3description: "Drumul Santiago este un timp de tăcere, de scufundare în adâncuri",
    trip3price: "2450 €",
    tripbutton: "Vezi mai mult"
  }
};

interface TripCarouselProps {
  currentLang: 'ro' | 'ru';
}

const TripCarousel: React.FC<TripCarouselProps> = ({ currentLang }) => {
  const navigate = useNavigate();

  const handleTripClick = (destination: string) => {
    navigate(destination);
  };

  return (
    <div className="trip-carousel">
        <div className="trip-carousel-content">
            <ul className='trip-list'>
                <li className='trip-item'>
                    <div className='trip-card'>
                        <img src={trip1} className='trip-card-image' alt="Morocco trip"/>
                        <div className='trip-card-overlay'>
                            <h1 className='trip-card-title'>{translations[currentLang].trip1title}</h1>
                            <p className='trip-card-description'>{translations[currentLang].trip1description}</p>
                            <p className='trip-card-price'>{translations[currentLang].trip1price}</p>
                            <button 
                              className='trip-card-button'
                              onClick={() => handleTripClick('/maroc')}
                            >
                              {translations[currentLang].tripbutton}
                            </button>
                        </div>
                    </div>
                </li>
                <li className='trip-item'>
                    <div className='trip-card'>
                        <img src={trip2} className='trip-card-image' alt="China trip"/>
                        <div className='trip-card-overlay'>
                            <h1 className='trip-card-title'>{translations[currentLang].trip2title}</h1>
                            <p className='trip-card-description'>{translations[currentLang].trip2description}</p>
                            <p className='trip-card-price'>{translations[currentLang].trip2price}</p>
                            <button 
                              className='trip-card-button'
                              onClick={() => handleTripClick('/china')}
                            >
                              {translations[currentLang].tripbutton}
                            </button>
                        </div>
                    </div>
                </li>
                <li className='trip-item'>
                    <div className='trip-card'>
                        <img src={trip3} className='trip-card-image' alt="Santiago trip"/>
                        <div className='trip-card-overlay'>
                            <h1 className='trip-card-title'>{translations[currentLang].trip3title}</h1>
                            <p className='trip-card-description'>{translations[currentLang].trip3description}</p>
                            <p className='trip-card-price'>{translations[currentLang].trip3price}</p>
                            <button 
                              className='trip-card-button'
                              onClick={() => handleTripClick('/santiago')}
                            >
                              {translations[currentLang].tripbutton}
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  );
};

export default TripCarousel;