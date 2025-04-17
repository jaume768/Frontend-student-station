import React, { useState, useEffect } from 'react';
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
    FaCog,
    FaPlus,
    FaHandshake,
    FaGraduationCap,
    FaSuitcase
} from 'react-icons/fa';
import logo from '../../assets/st-isotipo-temporal.png';
import './css/sidebar.css';

const Sidebar = ({ onLinkClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('explorer');
    
    // Función para manejar la navegación y cerrar sidebar en móvil si es necesario
    const handleNavigation = (path, stateObj = null) => {
        if (stateObj) {
            navigate(`/ControlPanel/${path}`, { state: stateObj });
        } else {
            navigate(`/ControlPanel/${path}`);
        }
        if (onLinkClick) onLinkClick();
    };
    
    // Detectar la sección activa basada en la URL y el estado
    useEffect(() => {
        // Comprobar si hay estado en la localización actual
        const currentState = location.state?.activeMenu;
        
        if (currentState) {
            setActiveSection(currentState);
        } else {
            const path = location.pathname.split('/').pop() || 'explorer';
            if (path === 'profile') {
                setActiveSection('profile');
            } else if (path === 'editProfile') {
                setActiveSection('editProfile');
            } else if (path === 'community') {
                setActiveSection('community');
            } else if (path === 'explorer') {
                setActiveSection('explorer');
            } else if (path === 'creatives') {
                setActiveSection('creatives');
            }
        }
    }, [location]);

    const onSelectOption = (option) => {
        setActiveSection(option);
        
        switch (option) {
            case 'profile':
                handleNavigation('profile');
                break;
            case 'editProfile':
                handleNavigation('editProfile', { activeMenu: 'editProfile' });
                break;
            case 'community':
                handleNavigation('community');
                break;
            case 'misOfertas':
                handleNavigation('editProfile', { activeMenu: 'misOfertas' });
                break;
            case 'configuracion':
                handleNavigation('editProfile', { activeMenu: 'configuracion' });
                break;
            case 'explorer':
                handleNavigation('explorer');
                break;
            case 'creatives':
                handleNavigation('creatives');
                break;
            case 'fashion':
                handleNavigation('fashion');
                break;
            case 'offers':
                handleNavigation('offers');
                break;
            case 'blog':
                handleNavigation('blog');
                break;
            case 'magazine':
                handleNavigation('magazine');
                break;
            case 'random':
                handleNavigation('random');
                break;
            case 'about':
                handleNavigation('about');
                break;
            case 'contact':
                handleNavigation('contact');
                break;
            case 'legal':
                handleNavigation('legal');
                break;
            case 'cookies':
                handleNavigation('cookies');
                break;
            case 'privacy':
                handleNavigation('privacy');
                break;
            case 'logout':
                handleLogout();
                break;
            default:
                break;
        }
    };
    
    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
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
                                className={`sidebar-menu-item ${activeSection === 'profile' ? 'active' : ''}`}
                                onClick={() => onSelectOption('profile')}
                            >
                                <FaUser className="sidebar-icon" />
                                <span>Ver mi perfil</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'editProfile' ? 'active' : ''}`}
                                onClick={() => onSelectOption('editProfile')}
                            >
                                <FaEdit className="sidebar-icon" />
                                <span>Editar perfil</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'community' ? 'active' : ''}`}
                                onClick={() => onSelectOption('community')}
                            >
                                <FaUserFriends className="sidebar-icon" />
                                <span>Mi comunidad</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'misOfertas' ? 'active' : ''}`}
                                onClick={() => onSelectOption('misOfertas')}
                            >
                                <FaSuitcase className="sidebar-icon" />
                                <span>Mis ofertas</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'configuracion' ? 'active' : ''}`}
                                onClick={() => onSelectOption('configuracion')}
                            >
                                <FaCog className="sidebar-icon" />
                                <span>Configuración</span>
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* Menú principal */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Menú</div>
                    <ul className="sidebar-menu">
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'explorer' ? 'active' : ''}`}
                                onClick={() => onSelectOption('explorer')}
                            >
                                <FaCompass className="sidebar-icon" />
                                <span>Explorador</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'creatives' ? 'active' : ''}`}
                                onClick={() => onSelectOption('creatives')}
                            >
                                <FaUsers className="sidebar-icon" />
                                <span>Creativos</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'fashion' ? 'active' : ''}`}
                                onClick={() => onSelectOption('fashion')}
                            >
                                <FaTshirt className="sidebar-icon" />
                                <span>Estudiar moda</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'offers' ? 'active' : ''}`}
                                onClick={() => onSelectOption('offers')}
                            >
                                <FaBriefcase className="sidebar-icon" />
                                <span>Ofertas de trabajo</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'blog' ? 'active' : ''}`}
                                onClick={() => onSelectOption('blog')}
                            >
                                <FaRegNewspaper className="sidebar-icon" />
                                <span>Blog</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'magazine' ? 'active' : ''}`}
                                onClick={() => onSelectOption('magazine')}
                            >
                                <FaBookOpen className="sidebar-icon" />
                                <span>Revista</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'random' ? 'active' : ''}`}
                                onClick={() => onSelectOption('random')}
                            >
                                <FaRandom className="sidebar-icon" />
                                <span>Random</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'about' ? 'active' : ''}`}
                                onClick={() => onSelectOption('about')}
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
                                onClick={() => onSelectOption('contact')}
                            >
                                <span>Contacto</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => onSelectOption('legal')}
                            >
                                <span>Aviso legal</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => onSelectOption('cookies')}
                            >
                                <span>Política de cookies</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => onSelectOption('privacy')}
                            >
                                <span>Política de privacidad</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className="sidebar-menu-item" 
                                onClick={() => onSelectOption('logout')}
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
