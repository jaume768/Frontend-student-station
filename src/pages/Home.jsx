import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../components/home/css/header-footer.css';
import '../components/home/css/efecto-parallex.css';

import Parallax from '../components/home/Parallax';
import Header from '../components/home/HeaderHome';
import Footer from '../components/home/FooterHome';
import CallToAction from '../components/home/CallToAction';
import LoginModal from '../components/home/LoginModal';
import RegisterModal from '../components/home/RegisterModal';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleSwitchToRegister = () => {
    navigate('/');
    setShowLogin(false);
    setShowRegister(true);
  };

  return (
    <div className="page-wrapper">
      {!showLogin && (
        <>
          <Parallax />
          <Header onLoginClick={() => setShowLogin(true)} onRegisterClick={() => setShowRegister(true)} />
          <CallToAction onLoginClick={() => setShowLogin(true)} onRegisterClick={() => setShowRegister(true)} />
        </>
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={handleSwitchToRegister}
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

      <Footer />
    </div>
  );
};

export default Home;