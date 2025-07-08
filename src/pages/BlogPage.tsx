import React from 'react';
import './Blogpage.css';
import NavBar from "../components/navbar";
import translations from "./BlogPage.json";
import Footer from "../components/footer";
import Bg from "../assets/blogmainbg.jpg";
import Contacts from "../components/contacts";
import secBg from "../assets/blogsecondbg.png";
import blueline from "../assets/blueline.svg";
import blogsection1 from "../assets/blogsection1.jpg";
import biglueline from "../assets/longblueline.svg";
import card1 from "../assets/blogcard1.jpg";
import card2 from "../assets/blogcard2.jpg";
import card3 from "../assets/blogcard3.jpg";
import article4image from "../assets/article4image.jpg";
import cardblog1 from "../assets/cardblog1.jpg";
import cardblog2 from "../assets/cardblog2.jpg";
import card1ru from "../assets/blogcard1ru.jpg";
import card2ru from "../assets/blogcard2ru.jpg";
import card3ru from "../assets/blogcard3ru.jpg";
import cardblog1ru from "../assets/cardblog1ru.jpg";
import cardblog2ru from "../assets/cardblog2ru.jpg";
import LiveChat from '../components/LiveChat';

interface BlogPageProps {
  currentLang: 'ro' | 'ru';
  setCurrentLang: (lang: 'ro' | 'ru') => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ currentLang, setCurrentLang }) => {
  return (
    <div className="blogpage">
        <div className='mainpage'>
            <img src={Bg} className='blogpage-main-bg' />
            <img src={secBg} className='blogpage-second-bg' />
            <div className="blogpage-fog-overlay"></div>
            <NavBar currentLang={currentLang} setCurrentLang={setCurrentLang} />
            <LiveChat/>
            <div className="blogpage-title-container">
                <h1 className='blogpage-title'>{translations[currentLang].blog.title}</h1>
            </div>
            <div className="blogpage-content">
                <h1 className='blogpage-description'>{translations[currentLang].blog.description}</h1>
            </div>
      </div>
      <div className='blogpage-articles'>
        <div className='blogpage-articles-1'>
            <img src={blueline} className='blogpage-articles-1-blueline'/>
            <p className='blogpage-articles-1-title'>{translations[currentLang].blog.section1title}</p>
            <p className='blogpage-articles-1-descritpion-1'>{translations[currentLang].blog.section1description1}</p>
            <img src={blogsection1} className='blogpage-articles-1-img' />
            <p className='blogpage-articles-1-descritpion-2'>{translations[currentLang].blog.section1descritpion2}</p>
            <img src={biglueline} className='blogpage-articles-1-longblueline'/>
        </div>
        <div className='blogpage-articles-2'>
            <p className='blogpage-articles-2-title'>{translations[currentLang].blog.section2title}</p>
            <p className='blogpage-articles-2-descritpion-1'>{translations[currentLang].blog.section2description}</p>
            <ul className='blogpage-articles-2-list'>
                <li className='blogpage-articles-2-list-item'>
                    <img src={currentLang === 'ru' ? card1ru : card1} />
                </li>
                <li className='blogpage-articles-2-list-item'>
                    <img src={currentLang === 'ru' ? card2ru : card2}/>
                </li>
                <li className='blogpage-articles-2-list-item'>
                    <img src={currentLang === 'ru' ? card3ru : card3}/>
                </li>
            </ul>
        </div>
        <div className='blogpage-articles-3'>
            <p className='blogpage-articles-3-title'>{translations[currentLang].blog.section3title}</p>
            <p className='blogpage-articles-3-descritpion' dangerouslySetInnerHTML={{ __html: translations[currentLang].blog.section3description }}/>
        </div>
        <div className='blogpage-articles-4'>
            <img src={blueline} className='blogpage-articles-4-blueline'/>
            <p className='blogpage-articles-4-title'>{translations[currentLang].blog.section4title}</p>
            <p className='blogpage-articles-4-descritpion-1'>{translations[currentLang].blog.section4descritpion1}</p>
            <img src={article4image} className='blogpage-articles-4-image'/>
            <p className='blogpage-articles-4-descritpion-2'>{translations[currentLang].blog.section4descritpion2}</p>
            <img src={biglueline} className='blogpage-articles-1-longblueline'/>
        </div>
        <div className='blogpage-articles-5'>
            <p className='blogpage-articles-5-title'>{translations[currentLang].blog.section5title}</p>
            <p className='blogpage-articles-5-descritpion' dangerouslySetInnerHTML={{ __html: translations[currentLang].blog.section5description1 }} />
            <p className='blogpage-articles-5-descritpion'>{translations[currentLang].blog.section5description2}</p>
            <p className='blogpage-articles-5-descritpion-bold'>{translations[currentLang].blog.section5description3}</p>
            <p className='blogpage-articles-5-descritpion' dangerouslySetInnerHTML={{ __html: translations[currentLang].blog.section5description4 }} />
            <img src={currentLang === 'ru' ? cardblog1ru : cardblog1} className='blogpage-articles-5-card' />
            <img src={currentLang === 'ru' ? cardblog2ru : cardblog2} className='blogpage-articles-5-card' />
        </div>
        <div className='blogpage-articles-6'>
            <p className='blogpage-articles-6-title'>{translations[currentLang].blog.section6title}</p>
            <p className='blogpage-articles-6-descritpion-1'>{translations[currentLang].blog.section6description1}</p>
            <p className='blogpage-articles-6-descritpion-2' dangerouslySetInnerHTML={{ __html: translations[currentLang].blog.section6description2 }} />
            <p className='blogpage-articles-6-descritpion-3' dangerouslySetInnerHTML={{ __html: translations[currentLang].blog.section6description3 }} />
            <p className='blogpage-articles-6-descritpion-4' dangerouslySetInnerHTML={{ __html: translations[currentLang].blog.section6description4 }} />
        </div>
      </div>
      <Contacts currentLang={currentLang}/>
      <Footer currentLang={currentLang}/>
    </div>
  );
};

export default BlogPage;