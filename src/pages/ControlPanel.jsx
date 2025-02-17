import React from 'react';
import './css/dashboard.css';
import {
    FaCompass,
    FaUsers,
    FaTshirt,
    FaBriefcase,
    FaRegNewspaper,
    FaBookOpen,
    FaInfoCircle,
    FaBookmark
} from 'react-icons/fa';

const ControlPanel = () => {
    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <div>
                    <div className="logo">
                        <img
                            src="logo.png"
                            alt="Logo"
                            style={{ width: '40px', height: '40px' }}
                        />
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <div className="nav-icon-container">
                                    <FaCompass className="nav-icon" />
                                    <span className="nav-tooltip">Explorar</span>
                                </div>
                            </li>
                            <li>
                                <div className="nav-icon-container">
                                    <FaUsers className="nav-icon" />
                                    <span className="nav-tooltip">Creativos</span>
                                </div>
                            </li>
                            <li>
                                <div className="nav-icon-container">
                                    <FaTshirt className="nav-icon" />
                                    <span className="nav-tooltip">Estudiar Moda</span>
                                </div>
                            </li>
                            <li>
                                <div className="nav-icon-container">
                                    <FaBriefcase className="nav-icon" />
                                    <span className="nav-tooltip">Ofertas</span>
                                </div>
                            </li>
                            <li>
                                <div className="nav-icon-container">
                                    <FaRegNewspaper className="nav-icon" />
                                    <span className="nav-tooltip">Blog</span>
                                </div>
                            </li>
                            <li>
                                <div className="nav-icon-container">
                                    <FaBookOpen className="nav-icon" />
                                    <span className="nav-tooltip">Revista</span>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="info-icon">
                    <FaInfoCircle className="nav-icon" title="Información" />
                </div>
            </aside>

            <div className="dashboard-main">
                <header className="dashboard-header">
                    <div className="dahsboard-search">
                        <input
                            type="text"
                            placeholder="Buscar"
                        />
                    </div>
                    <div className="header-right">
                        <div className="saved">
                            <FaBookmark className="nav-icon" title="Guardados" />
                            <span>Guardados</span>
                        </div>
                        <button>+ Crear</button>
                        <div>
                            <img
                                src="profile.jpg"
                                alt="Perfil"
                            />
                        </div>
                    </div>
                </header>

                <main className="dashboard-content">
                    <h1>Dashboard</h1>
                </main>
            </div>
        </div>
    );
};

export default ControlPanel;
