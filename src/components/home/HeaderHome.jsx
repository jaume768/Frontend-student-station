import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

const Header = ({ onLoginClick, onRegisterClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <header className="header-home">
            <div className="wrapper">
                <div className="logo">
                    <img src="/multimedia/logo-completo.png" alt="Student Station Logo" />
                </div>

                <nav className={`header-home-nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>
                            <Link to="/ControlPanel/explorer">
                                Explorar
                            </Link>
                        </li>
                        <li>
                            <Link to="/ControlPanel/creatives">
                                Creativos
                            </Link>
                        </li>
                        <li>
                            <Link to="/ControlPanel/fashion">
                                Escuelas
                            </Link>
                        </li>
                        <li>
                            <Link to="/ControlPanel/offers">
                                Trabajos
                            </Link>
                        </li>
                        <li>
                            <Link to="/ControlPanel/magazine">
                                Revista
                            </Link>
                        </li>
                        <li>
                            <Link to="/ControlPanel/blog">
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link to="/ControlPanel/info">
                                About
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="user-actions">
                    <a
                        href="#"
                        className="register"
                        onClick={e => {
                            e.preventDefault();
                            onRegisterClick();
                        }}
                    >
                        Registro
                    </a>
                    <a
                        href="#"
                        className="login"
                        onClick={e => {
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
            {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
        </header>
    );
};

export default Header;
