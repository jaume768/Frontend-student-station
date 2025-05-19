import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/home/css/landing-styles.css';
import '../components/home/css/page-wrapper.css';
import '../components/home/css/modal-overlay.css';

import LandingHeader from '../components/home/LandingHeader';
import LandingHero from '../components/home/LandingHero';
import LandingAddressTo from '../components/home/LandingAddressTo';
import LandingHowItWorks from '../components/home/LandingHowItWorks';
import LandingFooter from '../components/home/LandingFooter';
import LoginModal from '../components/home/LoginModal';
import RegisterModal from '../components/home/RegisterModal';
import PasswordResetModal from '../components/home/PasswordResetModal';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  useEffect(() => {
    if (location.state?.showRegister) {
      setShowRegister(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSwitchToRegister = () => {
    navigate('/');
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToReset = () => {
    setShowLogin(false);
    setShowPasswordReset(true);
  };

  return (
    <div className="page-wrapper">
      {/* Always render the landing page content */}
      <LandingHeader 
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)} 
      />
      <LandingHero 
        onRegisterClick={() => setShowRegister(true)} 
      />
      <LandingAddressTo />
      <LandingHowItWorks 
        onRegisterClick={() => setShowRegister(true)} 
      />
      <LandingFooter />

      {/* Modals are rendered as overlays */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToReset={handleSwitchToReset}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}

      {showPasswordReset && (
        <PasswordResetModal
          onClose={() => setShowPasswordReset(false)}
          onSwitchToLogin={() => {
            setShowPasswordReset(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
};

export default Home;