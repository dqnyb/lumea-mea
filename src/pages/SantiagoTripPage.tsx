import React, { useState, useEffect } from 'react';
import './MarocTripPage.css';
import NavBar from "../components/navbar";
import translations from "./TripPage.json";
import Footer from "../components/footer";
import Contacts from "../components/contacts";
import bg from "../assets/santiagobg.jpg"
import About from "../components/abouttrip";
import TripDescription from "../components/treidescription";
import santiagodescription from "../assets/santiagodescription.jpg";
import Calendar from '../components/calendar'; 
import day1Image from "../assets/SantiagoCalendar1.jpg";
import day2Image from "../assets/SantiagoCalendar2.jpg";
import day3Image from "../assets/SantiagoCalendar3.jpg";
import day4Image from "../assets/SantiagoCalendar4.jpg";
import day5Image from "../assets/SantiagoCalendar5.jpg";
import Echpament from "../components/echipamnt"
import allineedtoknoeimg1 from "../assets/marocalltoknow1.jpg"
import allineedtoknoeimg2 from "../assets/marocalltoknow2.jpg"
import allineedtoknoeimg3 from "../assets/marocalltoknow3.jpg"
import allineedtoknoeimg4 from "../assets/marocalltoknow1.jpg"
import allineedtoknoeimg5 from "../assets/marocalltoknow5.jpg"
import blueline from "../assets/longblueline.svg"
import Timer from "../components/timer"
import santiagotimer from "../assets/santiagotimer.jpg"
import priceinfo1ro from "../assets/priceonfosinagpor1.jpg"
import priceinfo2ro from "../assets/priceonfosinagpor2.jpg"
import priceinfo3ro from "../assets/priceonfosinagpor3.jpg"
import priceinfo1ru from "../assets/priceonfosinagpor1.jpg"
import priceinfo2ru from "../assets/priceonfosinagpor2.jpg"
import priceinfo3ru from "../assets/priceonfosinagpor3.jpg"
import LiveChat from '../components/LiveChat';

const SantiagoTripPage: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<'ro' | 'ru'>('ru');
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  
  const preventLanguageChange = (lang: 'ro' | 'ru') => {
    console.log(`Language change to ${lang} blocked - staying as 'ru'`);
  };

  useEffect(() => {
    setCurrentLang('ru');
  }, []);

  return (
    <div className="trippage">
      <NavBar currentLang={currentLang} setCurrentLang={preventLanguageChange} />
      <LiveChat open={liveChatOpen} setOpen={setLiveChatOpen} />
      <img src={bg} className='trippage-bg'/>
      <div className="trippage-fog-overlay"></div>
      <div className="trippage-content">
        <h1 className="trippage-title">{translations[currentLang].Santiago.title}</h1>
        <h1 className="trippage-description">{translations[currentLang].Santiago.description}</h1>
      </div>
      <div className='trippage-informations'>
        <div className='trippage-informations-about'>
            <About currentLang={currentLang} period={translations[currentLang].Santiago.period} duration={translations[currentLang].Santiago.duration} difficulty={translations[currentLang].Santiago.difficulty} price={translations[currentLang].Santiago.price}/>
            <TripDescription 
              currentLang={currentLang}
              description={translations[currentLang].Santiago.tripDescription}
              text={translations[currentLang].Santiago.tripText}
              image={santiagodescription}
            />
            <h1 className="trippage-invisible-mark">h</h1>
            <Calendar 
                currentLang={currentLang}
                buttonCount={translations[currentLang].Santiago.calendarDays.length} 
                buttonTexts={translations[currentLang].Santiago.calendarDays} 
                buttonContents={translations[currentLang].Santiago.calendarContents}
                buttonImages={[
                day1Image,
                day2Image,
                day3Image,
                day4Image,
                day5Image
              ]}/>
               <h1 className="trippage-info-title">{translations[currentLang].Santiago.sectionPriceTitle}</h1>
            <h1 className="trippage-price">{translations[currentLang].Santiago.sectionPriceDescritpion}</h1>
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
            <Echpament currentLang={currentLang} itemDescriptions={translations[currentLang].Santiago.echipament}/>
            <Calendar 
                currentLang={currentLang}
                buttonCount={translations[currentLang].Santiago.allneedtoknow.length} 
                buttonTexts={translations[currentLang].Santiago.allneedtoknow} 
                buttonContents={translations[currentLang].Santiago.allneedtoknowContent}
                buttonImages={[
                allineedtoknoeimg1,
                allineedtoknoeimg2,
                allineedtoknoeimg3,
                allineedtoknoeimg4,
                allineedtoknoeimg5
              ]}/>
              <h1 className='trippage-nevoie-title'>{translations[currentLang].Santiago.nevoietitle}</h1>
              <div 
                className='trippage-nevoie-descritpion' 
                dangerouslySetInnerHTML={{ __html: translations[currentLang].Santiago.nevoiedescription }}
              />
              <img src={blueline} className='trippage-nevoie-blueline' />
              <Timer 
                currentLang={currentLang}
                image={santiagotimer}
                title={translations[currentLang].Santiago.timertitle}
                description={translations[currentLang].Santiago.timerdescription}
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

export default SantiagoTripPage;