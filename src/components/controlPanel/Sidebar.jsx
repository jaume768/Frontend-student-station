import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    FaCompass,
    FaUsers,
    FaTshirt,
    FaBriefcase,
    FaRegNewspaper,
    FaBookOpen,
    FaRandom,
    FaInfoCircle,
    FaUser,
    FaEdit,
    FaUserFriends,
    FaBriefcase as FaJobOffers,
    FaCog,
    FaPhoneAlt,
    FaFileAlt,
    FaCookieBite,
    FaUserSecret,
    FaSignOutAlt,
    FaPlus
} from 'react-icons/fa';
import logo from '../../assets/st-isotipo-temporal.png';
import './css/sidebar.css';

const Sidebar = ({ onLinkClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    // Obtener el activeMenu de la URL actual
    const currentPath = location.pathname.split('/').pop();
    const activeMenu = currentPath || 'explorer';
    
    // Función para manejar la navegación y cerrar sidebar en móvil si es necesario
    const handleNavigation = (path) => {
        navigate(`/ControlPanel/${path}`);
        if (onLinkClick) onLinkClick();
    };
    
    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <aside className="dashboard-sidebar">
            <div>
                <div className="logo-dashboard">
                    <img src={logo} alt="Logo" style={{ width: '50px', height: '60px' }} />
                </div>
                
                {/* Mi perfil sección */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Mi perfil</div>
                    <ul className="sidebar-menu">
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => handleNavigation('profile')}
                            >
                                <FaUser className="sidebar-icon" />
                                <span>Ver mi perfil</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => handleNavigation('edit-profile')}
                            >
                                <FaEdit className="sidebar-icon" />
                                <span>Editar perfil</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => handleNavigation('community')}
                            >
                                <FaUserFriends className="sidebar-icon" />
                                <span>Mi comunidad</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeMenu === 'mis-ofertas' ? 'active' : ''}`}
                                onClick={() => handleNavigation('mis-ofertas')}
                            >
                                <FaJobOffers className="sidebar-icon" />
                                <span>Mis ofertas</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => handleNavigation('settings')}
                            >
                                <FaCog className="sidebar-icon" />
                                <span>Configuración</span>
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* Menú principal */}
                <div className="sidebar-section">
                    <ul className="sidebar-menu">
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeMenu === 'explorer' ? 'active' : ''}`}
                                onClick={() => handleNavigation('explorer')}
                            >
                                <FaCompass className="sidebar-icon" />
                                <span>Explorador</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeMenu === 'creatives' ? 'active' : ''}`}
                                onClick={() => handleNavigation('creatives')}
                            >
                                <FaUsers className="sidebar-icon" />
                                <span>Creativos</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeMenu === 'fashion' ? 'active' : ''}`}
                                onClick={() => handleNavigation('fashion')}
                            >
                                <FaTshirt className="sidebar-icon" />
                                <span>Estudiar moda</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeMenu === 'offers' ? 'active' : ''}`}
                                onClick={() => handleNavigation('offers')}
                            >
                                <FaBriefcase className="sidebar-icon" />
                                <span>Ofertas de trabajo</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeMenu === 'blog' ? 'active' : ''}`}
                                onClick={() => handleNavigation('blog')}
                            >
                                <FaRegNewspaper className="sidebar-icon" />
                                <span>Blog</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeMenu === 'magazine' ? 'active' : ''}`}
                                onClick={() => handleNavigation('magazine')}
                            >
                                <FaBookOpen className="sidebar-icon" />
                                <span>Revista</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeMenu === 'random' ? 'active' : ''}`}
                                onClick={() => handleNavigation('random')}
                            >
                                <FaRandom className="sidebar-icon" />
                                <span>Random</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeMenu === 'about' ? 'active' : ''}`}
                                onClick={() => handleNavigation('about')}
                            >
                                <FaInfoCircle className="sidebar-icon" />
                                <span>About</span>
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* Más información */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">
                        <FaPlus className="sidebar-icon" />
                        <span>Más información</span>
                    </div>
                    <ul className="sidebar-menu sidebar-info-menu">
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => handleNavigation('contact')}
                            >
                                <span>Contacto</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => handleNavigation('legal')}
                            >
                                <span>Aviso legal</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => handleNavigation('cookies')}
                            >
                                <span>Política de cookies</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => handleNavigation('privacy')}
                            >
                                <span>Política de privacidad</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={handleLogout}
                            >
                                <span>Cerrar sesión</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
