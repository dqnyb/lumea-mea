import React, { useState } from 'react';
import './MarocTripPage.css';
import NavBar from "../components/navbar";
import translations from "./TripPage.json";
import Footer from "../components/footer";
import Contacts from "../components/contacts";
import bg from "../assets/chinabg.jpg"
import About from "../components/abouttrip";
import TripDescription from "../components/treidescription";
import chinadescription from "../assets/chinadescription.jpg";
import Calendar from '../components/calendar'; 
import day1Image from "../assets/chinacalendar1.jpg";
import day2Image from "../assets/chinacalendar2.jpg";
import day3Image from "../assets/chinacalendar3.jpg";
import day4Image from "../assets/chinacalendar4.jpg";
import day5Image from "../assets/chinacalendar5.jpg";
import day6Image from "../assets/chinacalendar6.jpg";
import day7Image from "../assets/chinacalendar7.jpg";
import priceinfo1ro from "../assets/chinapriceinforo1.jpg"
import priceinfo2ro from "../assets/chinapriceinforo2.jpg"
import priceinfo3ro from "../assets/chinapriceinforo3.jpg"
import priceinfo1ru from "../assets/chinapriceinforu1.jpg"
import priceinfo2ru from "../assets/chinapriceinforu2.jpg"
import priceinfo3ru from "../assets/chinapriceinforu3.jpg"
import Echpament from "../components/echipamnt"
import allineedtoknoeimg1 from "../assets/marocalltoknow1.jpg"
import allineedtoknoeimg2 from "../assets/marocalltoknow2.jpg"
import allineedtoknoeimg3 from "../assets/marocalltoknow3.jpg"
import allineedtoknoeimg4 from "../assets/marocalltoknow1.jpg"
import allineedtoknoeimg5 from "../assets/marocalltoknow5.jpg"
import blueline from "../assets/longblueline.svg"
import Timer from "../components/timer"
import chinatimer from "../assets/chinatimer.jpg"
import LiveChat from '../components/LiveChat';

interface ChinaTripPageProps {
  currentLang: 'ro' | 'ru';
  setCurrentLang: (lang: 'ro' | 'ru') => void;
}

const ChinaTripPage: React.FC<ChinaTripPageProps> = ({ currentLang, setCurrentLang }) => {
  const [liveChatOpen, setLiveChatOpen] = useState(false);

  return (
    <div className="trippage">
      <NavBar currentLang={currentLang} setCurrentLang={setCurrentLang} />
      <LiveChat open={liveChatOpen} setOpen={setLiveChatOpen} />
      <img src={bg} className='trippage-bg'/>
      <div className="trippage-fog-overlay"></div>
      <div className="trippage-content">
        <h1 className="trippage-title">{translations[currentLang].China.title}</h1>
        <h1 className="trippage-description">{translations[currentLang].China.description}</h1>
      </div>
      <div className='trippage-informations'>
        <div className='trippage-informations-about'>
            <About currentLang={currentLang} period={translations[currentLang].China.period} duration={translations[currentLang].China.duration} difficulty={translations[currentLang].China.difficulty} price={translations[currentLang].China.price}/>
            <TripDescription 
              currentLang={currentLang}
              description={translations[currentLang].China.tripDescription}
              text={translations[currentLang].China.tripText}
              image={chinadescription}
            />
            <h1 className="trippage-invisible-mark">h</h1>
            <Calendar 
                currentLang={currentLang}
                buttonCount={translations[currentLang].China.calendarDays.length} 
                buttonTexts={translations[currentLang].China.calendarDays} 
                buttonContents={translations[currentLang].China.calendarContents}
                buttonImages={[
                day1Image,
                day2Image,
                day3Image,
                day4Image,
                day5Image,
                day6Image,
                day7Image,
              ]}/>
              <h1 className="trippage-info-title">{translations[currentLang].China.sectionPriceTitle}</h1>
            <h1 className="trippage-price">{translations[currentLang].China.sectionPriceDescritpion}</h1>
            <ul className="trippage-info-list">
              <li className="trippage-info-list-item">
                <img src={currentLang === 'ru' ? priceinfo1ru : priceinfo1ro} />
              </li>
              <li className="trippage-info-list-item">
                <img src={currentLang === 'ru' ? priceinfo2ru : priceinfo2ro} />
              </li>
              <li className="trippage-info-list-item">
                <img src={currentLang === 'ru' ? priceinfo3ru : priceinfo3ro} />
              </li>
            </ul>
            <Echpament currentLang={currentLang} itemDescriptions={translations[currentLang].China.echipament}/>
            <Calendar 
                currentLang={currentLang}
                buttonCount={translations[currentLang].China.allneedtoknow.length} 
                buttonTexts={translations[currentLang].China.allneedtoknow} 
                buttonContents={translations[currentLang].China.allneedtoknowContent}
                buttonImages={[
                allineedtoknoeimg1,
                allineedtoknoeimg2,
                allineedtoknoeimg3,
                allineedtoknoeimg4,
                allineedtoknoeimg5
              ]}/>
             <h1 className='trippage-nevoie-title'>{translations[currentLang].China.nevoietitle}</h1>
              <div 
                className='trippage-nevoie-descritpion' 
                dangerouslySetInnerHTML={{ __html: translations[currentLang].China.nevoiedescription }}
              />
              <img src={blueline} className='trippage-nevoie-blueline' />
               <Timer 
                currentLang={currentLang}
                image={chinatimer}
                title={translations[currentLang].China.timertitle}
                description={translations[currentLang].China.timerdescription}
                date="13/10/2026"
                setLiveChatOpen={setLiveChatOpen}
              />      
            <Contacts currentLang={currentLang}/>
            <Footer currentLang={currentLang}/>
        </div>
      </div>
    </div>
  );
};

export default ChinaTripPage;