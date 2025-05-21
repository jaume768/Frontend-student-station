import React, { useEffect, useRef } from 'react';

const LandingHero = ({ onRegisterClick }) => {
  const typewriterWrapperRef = useRef(null);
  const typewriterCursorRef = useRef(null);

  useEffect(() => {
    const textElement = typewriterWrapperRef.current;
    const cursor = typewriterCursorRef.current;
    
    if (!textElement || !cursor) return;

    const frases = [
      "Muestra tu CV + Portfolio.",
      "Encuentra talento emergente.",
      "Accede a ofertas laborales.",
      "Descubre tus próximas prácticas.",
      "Explora formación educativa.",
    ];

    let fraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 100;
    
    // Check if we're on a mobile device
    let isMobile = window.innerWidth <= 768;

    function type() {
      const currentFrase = frases[fraseIndex];
      if (isDeleting) {
        textElement.textContent = currentFrase.substring(0, charIndex--);
        delay = 20;
      } else {
        textElement.textContent = currentFrase.substring(0, charIndex++);
        delay = 90;
      }

      // Adjust cursor position for mobile (when text wraps)
      if (isMobile) {
        // Handle cursor position when the text wraps to a new line
        // This doesn't need explicit calculation since we're using inline-block elements
        cursor.style.display = 'inline-block';
      }

      if (!isDeleting && charIndex === currentFrase.length) {
        delay = 1200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        fraseIndex = (fraseIndex + 1) % frases.length;
        delay = 500;
      }

      setTimeout(type, delay);
    }

    // Start the typewriter effect
    type();

    // Handle window resize events
    const handleResize = () => {
      // Update mobile status when window is resized
      isMobile = window.innerWidth <= 768;
    };

    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="landing-hero">
      <img src="/multimedia/thefolder.gif" className="landing-hero-image" alt="TheFolder showcase" />
      <div className="landing-hero-content">
        <h1 id="typewriter">
          <span ref={typewriterWrapperRef} className="landing-typewriter_wrapper"></span>
          <span ref={typewriterCursorRef} className="landing-typewriter_cursor">|</span>
        </h1>
        <h2 className="landing-h2-hero">Todo en un mismo lugar.</h2>
        <p>Diseñado por creativos, para creativos.</p>
        <div className="landing-cta-buttons">
          <a href="#" className="landing-cta" onClick={(e) => {
            e.preventDefault();
            onRegisterClick();
          }}>Soy creativo</a>
          <a href="#" className="landing-cta" onClick={(e) => {
            e.preventDefault();
            onRegisterClick();
          }}>Soy una empresa</a>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
