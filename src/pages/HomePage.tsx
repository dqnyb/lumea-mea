import React, { useState, useEffect } from 'react';
import './Homepage.css';
import NavBar from "../components/navbar"
import translations from "./Homepage.json"
import Bg from "../assets/homemainbg.jpg"
//import secondaryBG from "../assets/homebg.svg"
//import Carousel from '../components/carusel';
import LiveChat from '../components/LiveChat';
import TripCarousel from "../components/tripcarusel"
import abotusimage from "../assets/desprenoi.jpg"
import icon1 from "../assets/icon1.svg"
import icon2 from "../assets/icon2.svg"
import icon3 from "../assets/icon3.svg"
import whyus from "../assets/Dece sa calatoresti cu noi.jpg"
import Contacts from "../components/contacts"
import Footer from "../components/footer"
import whyusru from "../assets/whyusru.jpg"
import secondbg from "../assets/pexels-zhicheng-zhang-312594413-15193338 (2).png"
import gallery1 from "../assets/galerie/image.jpg"
import gallery2 from "../assets/galerie/image (1).jpg"
import gallery3 from "../assets/galerie/image (2).jpg"
import gallery4 from "../assets/galerie/image (3).jpg"
import gallery5 from "../assets/galerie/image (4).jpg"
import gallery6 from "../assets/galerie/image (5).jpg"
import gallery7 from "../assets/galerie/image (6).jpg"
import gallery8 from "../assets/galerie/image (7).jpg"
import gallery9 from "../assets/galerie/image (8).jpg"
import gallery10 from "../assets/galerie/image (9).jpg"
import gallery11 from "../assets/galerie/image (10).jpg"
import gallery12 from "../assets/galerie/image (11).jpg"
import gallery13 from "../assets/galerie/image (12).jpg"
import gallery14 from "../assets/galerie/image (13).jpg"
import coordonatorjos from "../assets/mesajcoordonatorjos.svg"
import coordonatorsus from "../assets/mesajcoordonatorsus.svg"
import iconcoordonator from "../assets/iconcoordonator.svg"
import partener1 from "../assets/partener1.svg"
import partener2 from "../assets/partener2.svg"
import partener3 from "../assets/partener3.svg"
import harta from "../assets/harta.jpg"

interface HomePageProps {
  currentLang: 'ro' | 'ru';
  setCurrentLang: (lang: 'ro' | 'ru') => void;
}

const HomePage: React.FC<HomePageProps> = ({ currentLang, setCurrentLang }) => {
  const [liveChatOpen, setLiveChatOpen] = useState(false);

  // Gallery images array for navigation
  const galleryImages = [
    gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7,
    gallery8, gallery9, gallery10, gallery11, gallery12, gallery13, gallery14
  ];

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const img = e.target as HTMLImageElement;
      if (img.tagName === 'IMG' && img.closest('.gallery-list')) {
        // Find the index of the clicked image
        const clickedSrc = img.src;
        const imageIndex = galleryImages.findIndex(galleryImg => 
          clickedSrc.includes(galleryImg.split('/').pop() || '')
        );
        
        showGalleryOverlay(imageIndex);
      }
    };

    const showGalleryOverlay = (currentIndex: number) => {
      const overlay = document.createElement('div');
      overlay.className = 'gallery-overlay';
      
      // Create image container
      const imageContainer = document.createElement('div');
      imageContainer.className = 'gallery-image-container';
      
      // Create image element
      const zoomedImg = document.createElement('img');
      zoomedImg.src = galleryImages[currentIndex];
      zoomedImg.className = 'gallery-overlay-image';
      imageContainer.appendChild(zoomedImg);
      
      // Create previous arrow
      const prevArrow = document.createElement('button');
      prevArrow.className = 'gallery-nav-arrow gallery-prev-arrow';
      prevArrow.innerHTML = '‹';
      prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
        document.body.removeChild(overlay);
        showGalleryOverlay(newIndex);
      });
      
      // Create next arrow
      const nextArrow = document.createElement('button');
      nextArrow.className = 'gallery-nav-arrow gallery-next-arrow';
      nextArrow.innerHTML = '›';
      nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
        document.body.removeChild(overlay);
        showGalleryOverlay(newIndex);
      });
      
      // Create close button
      
      
      // Create image counter
      const imageCounter = document.createElement('div');
      imageCounter.className = 'gallery-counter';
      imageCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
      
      // Append elements to overlay
      overlay.appendChild(imageContainer);
      overlay.appendChild(prevArrow);
      overlay.appendChild(nextArrow);
      overlay.appendChild(imageCounter);
      
      // Close on overlay click (but not on image or arrows)
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
        }
      });
      
      // Keyboard navigation
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          const newIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
          document.body.removeChild(overlay);
          showGalleryOverlay(newIndex);
        } else if (e.key === 'ArrowRight') {
          const newIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
          document.body.removeChild(overlay);
          showGalleryOverlay(newIndex);
        } else if (e.key === 'Escape') {
          document.body.removeChild(overlay);
          document.removeEventListener('keydown', handleKeyPress);
        }
      };
      
      document.addEventListener('keydown', handleKeyPress);
      
      // Remove keyboard listener when overlay is closed
      overlay.addEventListener('DOMNodeRemoved', () => {
        document.removeEventListener('keydown', handleKeyPress);
      });
      
      document.body.appendChild(overlay);
    };

    document.addEventListener('click', handleImageClick);

    return () => {
      document.removeEventListener('click', handleImageClick);
    };
  }, [galleryImages]);

  // Function to scroll to the about us section
  const scrollToAboutUs = () => {
    const aboutUsElement = document.querySelector('.homepage-aboutus-section');
    if (aboutUsElement) {
      aboutUsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="homepage">
      <img src={Bg} className='homepage-main-bg' />
      <img src={secondbg} className='homepage-second-bg' />
      <div className="homepage-fog-overlay"></div>
      <NavBar currentLang={currentLang} setCurrentLang={setCurrentLang} />
      <LiveChat open={liveChatOpen} setOpen={setLiveChatOpen} />
      <div className="homepage-content">
        {currentLang === 'ro' ? (
        <h1 className='homepage-title'>{translations['ro'].homepage.title}</h1>
      ) : (
        <h1 className='homepage-title-ru'
        dangerouslySetInnerHTML={{ __html: translations[currentLang].homepage.title }}/>
      )}
        {currentLang === 'ro' ? (
            <h1 className="homepage-description">{translations.ro.homepage.description}</h1>
          ) : (
            <h1 className="homepage-description-ru">{translations.ru.homepage.description}</h1>
          )}
        {currentLang === 'ro' ? (
          <button
            className='homepage-button'
            onClick={() => scrollToAboutUs()}
          >
            {translations.ro.homepage.button}
          </button>
        ) : (
          <button
            className='homepage-button-ru'
            onClick={() => scrollToAboutUs()}
          >
            {translations.ru.homepage.button}
          </button>
        )}
      </div>
      <div className='homepage-trip-section'>
        <h1 className='homepage-trip-title'>{translations[currentLang].homepage.trip}</h1>
        
        <TripCarousel currentLang={currentLang}/>
        <button 
          className='homepage-trip-button' 
          onClick={() =>setLiveChatOpen(true)}
        >
          {translations[currentLang].homepage.tripButton}
        </button>
        <h1 className='homepage-trip-description'>{translations[currentLang].homepage.tripDescription}</h1>
      </div>
      <div className='homepage-aboutus-section'>
        <img src={abotusimage} className='homepage-aboutus-image' />
        <div className='homepage-aboutus-content'>
          <h1 className='homepage-aboutus-title'>{translations[currentLang].aboutus.title}</h1>
          <p className='homepage-aboutus-description'>{translations[currentLang].aboutus.description}</p>
          <ul className='homepage-aboutus-list'>
            <li className='homepage-aboutus-list-item'>
              <img src={icon1} className='homepage-aboutus-list-item-icon' />
              <p className='homepage-aboutus-list-text'>{translations[currentLang].aboutus.icon1}</p>
            </li>
            <li className='homepage-aboutus-list-item'>
              <img src={icon2} className='homepage-aboutus-list-item-icon' />
              <p className='homepage-aboutus-list-text'>{translations[currentLang].aboutus.icon2}</p>
            </li>
            <li className='homepage-aboutus-list-item'>
              <img src={icon3} className='homepage-aboutus-list-item-icon' />
              <p className='homepage-aboutus-list-text'>{translations[currentLang].aboutus.icon3}</p>
            </li>
          </ul>
        </div>
      </div>
      <div className='homepage-other-content'>
        <img src={harta} className='homepage-other-content-harta'/>
        <h1 className='homepage-whyus-text'>{translations[currentLang].homepage.whyus}</h1>
        <img src={currentLang === 'ru' ? whyusru : whyus} className='homepage-whyus-img' />
        <div className='homepage-coordinator-message'>
          <img src={coordonatorsus} className='homepage-coordinator-message-img' />
            <div 
                className='homepage-coordinator-message-text' 
                dangerouslySetInnerHTML={{ __html: translations[currentLang].homepage.coordinatormessage }}
              />
          <img src={coordonatorjos} className='homepage-coordinator-message-img' />
          <img src={iconcoordonator} className='homepage-coordinator-message-icon' />
          <p className='homepage-coordinator-message-name'>{translations[currentLang].homepage.coordinatorname}</p>
          <p className='homepage-coordinator-message-job'>{translations[currentLang].homepage.coordinatorjob}</p>
        </div>
        <ul className='gallery-list'>
          <li>
            <img src={gallery1} />
            <img src={gallery2} />
            <img src={gallery3} />
          </li>
          <li>
            <img src={gallery4} />
            <img src={gallery5} />
            <img src={gallery6} />
            <img src={gallery7} />
          </li>
           <li>
            <img src={gallery8} />
            <img src={gallery9} />
            <img src={gallery10} />
          </li>
          <li>
            <img src={gallery11} />
            <img src={gallery12} />
            <img src={gallery13} />
            <img src={gallery14} />
          </li>
        </ul>
      </div>
      <div className='homepage-partners'>
        <h1 className='homepage-partners-title'>{translations[currentLang].homepage.prietenititlu}</h1>
        <h1 className='homepage-partners-description'>{translations[currentLang].homepage.prietenidescriere}</h1>
        <ul>
          <li>
            <a href="https://gonomad.ro/" target="_blank" rel="noopener noreferrer">
              <img src={partener1}/>
            </a>
          </li>
          <li>
            <a href="https://gonomad.ro/" target="_blank" rel="noopener noreferrer">
              <img src={partener2}/>
            </a>
          </li>
          <li>
            <a href="https://jyotish.md/" target="_blank" rel="noopener noreferrer">
              <img src={partener3}/>
            </a>
          </li>
        </ul>
      </div>
      <div className="homepage-footer-section" id="footer-section">
        <Contacts currentLang={currentLang}/>
        <Footer currentLang={currentLang}/>
      </div>
    </div>
  );
};

export default HomePage;