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
import PasswordResetModal from '../components/home/PasswordResetModal';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const navigate = useNavigate();

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
      {!showLogin && !showRegister && !showPasswordReset && (
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

      <Footer />
    </div>
  );
};

export default Home;