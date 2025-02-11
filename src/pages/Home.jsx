import React, { useState } from 'react';

import '../components/home/css/header-footer.css';
import '../components/home/css/efecto-parallex.css';

import Parallax from '../components/home/Parallax';
import Header from '../components/home/HeaderHome';
import Footer from '../components/home/FooterHome';
import CallToAction from '../components/home/CallToAction';
import LoginModal from '../components/home/LoginModal';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="page-wrapper">
      {
        !showLogin && (
          <>
            <Parallax />
            <Header onLoginClick={() => setShowLogin(true)} />
            <CallToAction onLoginClick={() => setShowLogin(true)} />
          </>
        )
      }

      {
        showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} />
        )
      }
      <Footer />
    </div>
  );
};

export default Home;
