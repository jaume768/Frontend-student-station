import React from 'react';
import { Link } from 'react-router-dom';

const LandingHeader = ({ onLoginClick, onRegisterClick }) => {
  return (
    <header className="landing-header">
      <div className="landing-logo">
        <img src="/multimedia/thefolder-logotipo-beta.png" alt="TheFolder Logo" />
      </div>
      <nav className="landing-nav-menu">
        <Link to="/ControlPanel/explorer">Explorar</Link>
        <Link to="/ControlPanel/creatives">Creativos</Link>
        <Link to="/ControlPanel/fashion">Estudiar moda</Link>
        <Link to="/ControlPanel/offers">Ofertas de trabajo</Link>
        <Link to="/ControlPanel/magazine">Revista</Link>
        <Link to="/ControlPanel/blog">Blog</Link>
        <Link to="/ControlPanel/info">About</Link>
      </nav>
      <div className="landing-auth-buttons">
        <button 
          className="landing-btn landing-registro"
          onClick={onRegisterClick}
        >
          Registro
        </button>
        <button 
          className="landing-btn landing-inicio-sesion"
          onClick={onLoginClick}
        >
          Inicio de sesión
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;
