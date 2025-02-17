import React from 'react';
import { FaBookmark, FaSearch } from 'react-icons/fa';

const Header = () => {
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
                    <span>Guardados</span>
                </div>
                <button>+ Crear</button>
                <div>
                    <img src="/multimedia/usuarioDefault.jpg" alt="Perfil" />
                </div>
            </div>
        </header>
    );
};

export default Header;
