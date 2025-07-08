import React, { useState } from 'react';
import './MarocTripPage.css';
import NavBar from "../components/navbar";
import translations from "./TripPage.json";
import Footer from "../components/footer";
import Contacts from "../components/contacts";
import bg from "../assets/maroc ng.jpg"
import About from "../components/abouttrip";
import TripDescription from "../components/treidescription";
import marocdescription from "../assets/marocdescription.jpg"; 
import Calendar from '../components/calendar';
import day1Image from "../assets/MarocCalendar1.jpg";
import day2Image from "../assets/MarocCalendar2.jpg";
import day3Image from "../assets/MarocCalendar3.jpg";
import day4Image from "../assets/MarocCalendar4.jpg";
import day5Image from "../assets/MarocCalendar5.jpg";
import day6Image from "../assets/MarocCalendar6.jpg";
import day7Image from "../assets/MarocCalendar7.jpg";
import day8Image from "../assets/MarocCalendar8.jpg";
import priceinfo1ro from "../assets/pretinfoMaroc1.jpg"
import priceinfo2ro from "../assets/pretinfoMaroc2.jpg"
import priceinfo3ro from "../assets/pretinfoMaroc3.jpg"
import priceinfo1ru from "../assets/pretinfoMaroc1ru.jpg"
import priceinfo2ru from "../assets/pretinfoMaroc2ru.jpg"
import priceinfo3ru from "../assets/pretinfoMaroc3ru.jpg"
import Echpament from "../components/echipamnt"
import allineedtoknoeimg1 from "../assets/marocalltoknow1.jpg"
import allineedtoknoeimg2 from "../assets/marocalltoknow2.jpg"
import allineedtoknoeimg3 from "../assets/marocalltoknow3.jpg"
import allineedtoknoeimg4 from "../assets/marocalltoknow1.jpg"
import allineedtoknoeimg5 from "../assets/marocalltoknow5.jpg"
import blueline from "../assets/longblueline.svg"
import Timer from "../components/timer"
import maroctimer from "../assets/maroctimer.jpg"
import LiveChat from '../components/LiveChat';
import secondbg from "../assets/image (1).png"

interface MarocTripPageProps {
  currentLang: 'ro' | 'ru';
  setCurrentLang: (lang: 'ro' | 'ru') => void;
}

const TripPage: React.FC<MarocTripPageProps> = ({ currentLang, setCurrentLang }) => {
  const [liveChatOpen, setLiveChatOpen] = useState(false);//

  return (
    <div className="trippage">
      <NavBar currentLang={currentLang} setCurrentLang={setCurrentLang} />
      <LiveChat open={liveChatOpen} setOpen={setLiveChatOpen} />
      <img src={bg} className='trippage-bg'/>
      <img src={secondbg} className='trippage-second-bg'/>
      <div className="trippage-fog-overlay"></div>
      <h1 className="trippage-title">{translations[currentLang].Maroc.title}</h1>
      <div className="trippage-content">
        <h1 className="trippage-description">{translations[currentLang].Maroc.description}</h1>
      </div>
      <div className='trippage-informations'>
        <div className='trippage-informations-about'>
            <About currentLang={currentLang} period={translations[currentLang].Maroc.period} duration={translations[currentLang].Maroc.duration} difficulty={translations[currentLang].Maroc.difficulty} price={translations[currentLang].Maroc.price}/>
            <TripDescription 
              currentLang={currentLang}
              description={translations[currentLang].Maroc.tripDescription}
              text={translations[currentLang].Maroc.tripText}
              image={marocdescription}
            />
            <h1 className="trippage-invisible-mark">h</h1>
            <Calendar id= "calendar"
                currentLang={currentLang}
                buttonCount={translations[currentLang].Maroc.calendarDays.length} 
                buttonTexts={translations[currentLang].Maroc.calendarDays} 
                buttonContents={translations[currentLang].Maroc.calendarContents}
                buttonImages={[
                day1Image,
                day2Image,
                day3Image,
                day4Image,
                day5Image,
                day6Image,
                day7Image,
                day8Image
              ]}
              />
            <h1 className="trippage-info-title">{translations[currentLang].Maroc.sectionPriceTitle}</h1>
            <h1 className="trippage-price">{translations[currentLang].Maroc.sectionPriceDescritpion}</h1>
            <ul className="trippage-info-list">
              <li className="trippage-info-list-item">
                <img src={currentLang === 'ru' ? priceinfo1ru : priceinfo1ro} />
              </li>
              <li className="trippage-info-list-item">
                <img src={currentLang === 'ru' ? priceinfo2ru : priceinfo2ro} />
              </li>
              <li className="trippage-info-list-item">
                <img src={currentLang === 'ru' ? priceinfo3ru : priceinfo3ro}/>
              </li>
            </ul>
            <Echpament currentLang={currentLang} itemDescriptions={translations[currentLang].Maroc.echipament}/>
            <Calendar 
                currentLang={currentLang}
                buttonCount={translations[currentLang].Maroc.allneedtoknow.length} 
                buttonTexts={translations[currentLang].Maroc.allneedtoknow} 
                buttonContents={translations[currentLang].Maroc.allneedtoknowContent}
                buttonImages={[
                allineedtoknoeimg1,
                allineedtoknoeimg2,
                allineedtoknoeimg3,
                allineedtoknoeimg4,
                allineedtoknoeimg5
              ]}/>
              <h1 className='trippage-nevoie-title'>{translations[currentLang].Maroc.nevoietitle}</h1>
              <div 
                className='trippage-nevoie-descritpion' 
                dangerouslySetInnerHTML={{ __html: translations[currentLang].Maroc.nevoiedescription }}
              />
              <img src={blueline} className='trippage-nevoie-blueline' />
              <Timer 
                currentLang={currentLang}
                image={maroctimer}
                title={translations[currentLang].Maroc.timertitle}
                description={translations[currentLang].Maroc.timerdescription}
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

export default TripPage;