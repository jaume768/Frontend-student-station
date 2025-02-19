import React from 'react';
import { FaBookmark, FaSearch, FaBars } from 'react-icons/fa';

const Header = ({ onHamburgerClick }) => {
    return (
        <header className="dashboard-header">
            <div className="dahsboard-search">
                <div className="search-input-container">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Buscar" />
                </div>
            </div>
            <div className="header-right">
                <div className="saved">
                    <FaBookmark className="nav-icon-save" title="Guardados" />
                    <span>guardados</span>
                </div>
                <button>+ crear</button>
                <div className="profile-wrapper">
                    <img className="profile-img" src="/multimedia/usuarioDefault.jpg" alt="Perfil" />
                    <FaBars className="hamburger-menu" onClick={onHamburgerClick} />
                </div>
            </div>
        </header>
    );
};

export default Header;