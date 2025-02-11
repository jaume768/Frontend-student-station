import React, { useState } from 'react';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

const Header = ({ onLoginClick, onRegisterClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <header className="header-home">
            <div className="wrapper">
                <div className="logo">
                    <img src="/multimedia/logo-completo.png" alt="Student Station Logo" />
                </div>

                <nav className={`header-home-nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><a href="#">Explorar</a></li>
                        <li><a href="#">Diseñadores</a></li>
                        <li><a href="#">Escuelas</a></li>
                        <li><a href="#">Trabajos</a></li>
                        <li><a href="#">Revista</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">About</a></li>
                    </ul>
                </nav>

                <div className="user-actions">
                    <a href="#" className="register"
                        onClick={(e) => {
                            e.preventDefault();
                            onRegisterClick();
                        }}
                    >
                        Registro
                    </a>
                    <a href="#" className="login"
                        onClick={(e) => {
                            e.preventDefault();
                            onLoginClick();
                        }}
                    >
                        Inicio sesión
                    </a>
                    <a href="#" className="user-icon">
                        <FaUser />
                    </a>
                </div>

                <button className="menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? (
                        <FaTimes style={{ color: 'black' }} />
                    ) : (
                        <FaBars style={{ color: 'black' }} />
                    )}
                </button>
            </div>
            {isMenuOpen && (
                <div className="menu-overlay" onClick={toggleMenu}></div>
            )}
        </header>
    );
};

export default Header;
