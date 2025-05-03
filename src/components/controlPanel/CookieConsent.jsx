import React, { useState, useEffect } from 'react';
import './css/CookieConsent.css';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent">
      <p>
        Esta web usa cookies para mejorar tu experiencia.{' '}
        <a href="/politica-cookies">Más info</a>
      </p>
      <button onClick={handleAccept}>Aceptar</button>
    </div>
  );
};

export default CookieConsent;
