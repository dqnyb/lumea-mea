import React, { useState, useEffect, useRef } from 'react';
import "./carusel.css";

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  alt: string;
}

interface CarouselProps {
  items?: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [leftValue, setLeftValue] = useState(0);
  const carouselInnerRef = useRef<HTMLDivElement>(null);
  const carouselVpRef = useRef<HTMLDivElement>(null);

  // Default items if none provided
  const defaultItems: CarouselItem[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1564292284209-60cce69f08ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODQ0MTA1MTJ8&ixlib=rb-4.0.3&q=80&w=400",
      title: "Title 1 / 6",
      alt: "Moon"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1564292284209-60cce69f08ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODQ0MTA1MTJ8&ixlib=rb-4.0.3&q=80&w=400",
      title: "Title 2 / 6",
      alt: "Moon"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1564292284209-60cce69f08ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODQ0MTA1MTJ8&ixlib=rb-4.0.3&q=80&w=400",
      title: "Title 3 / 6",
      alt: "Moon"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1564292284209-60cce69f08ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODQ0MTA1MTJ8&ixlib=rb-4.0.3&q=80&w=400",
      title: "Title 4 / 6",
      alt: "Moon"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1564292284209-60cce69f08ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODQ0MTA1MTJ8&ixlib=rb-4.0.3&q=80&w=400",
      title: "Title 5 / 6",
      alt: "Moon"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1564292284209-60cce69f08ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODQ0MTA1MTJ8&ixlib=rb-4.0.3&q=80&w=400",
      title: "Title 6 / 6",
      alt: "Moon"
    }
  ];

  const carouselItems = items || defaultItems;

  const getTotalMovementSize = () => {
    if (carouselInnerRef.current) {
      const itemElement = carouselInnerRef.current.querySelector('.cCarousel-item') as HTMLElement;
      if (itemElement) {
        const itemWidth = itemElement.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(carouselInnerRef.current).getPropertyValue("gap"));
        return itemWidth + gap;
      }
    }
    return 260; // fallback value (250px width + 10px gap)
  };

  const handlePrev = () => {
    if (leftValue !== 0) {
      const totalMovementSize = getTotalMovementSize();
      setLeftValue(prev => prev + totalMovementSize);
    }
  };

  const handleNext = () => {
    if (carouselVpRef.current && carouselInnerRef.current) {
      const carouselVpWidth = carouselVpRef.current.getBoundingClientRect().width;
      const carouselInnerWidth = carouselInnerRef.current.getBoundingClientRect().width;
      const totalMovementSize = getTotalMovementSize();
      
      if (carouselInnerWidth - Math.abs(leftValue) > carouselVpWidth) {
        setLeftValue(prev => prev - totalMovementSize);
      }
    }
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Reset position on resize to prevent issues
      setLeftValue(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section>
      <div id="cCarousel">
        <div className="arrow" id="prev" onClick={handlePrev}>
          <i className="fa-solid fa-chevron-left">‹</i>
        </div>
        <div className="arrow" id="next" onClick={handleNext}>
          <i className="fa-solid fa-chevron-right">›</i>
        </div>

        <div id="carousel-vp" ref={carouselVpRef}>
          <div 
            id="cCarousel-inner" 
            ref={carouselInnerRef}
            style={{ left: `${leftValue}px` }}
          >
            {carouselItems.map((item) => (
              <article key={item.id} className="cCarousel-item">
                <img src={item.image} alt={item.alt} />
                <div className="infos">
                  <h3>{item.title}</h3>
                  <button type="button">See</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;