import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/st-isotipo-temporal.png';
import './css/sidebar.css';

const Sidebar = ({ onLinkClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('explorer');
    const [infoOpen, setInfoOpen] = useState(false);
    const toggleInfo = () => setInfoOpen(prev => !prev);
    
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
            } else if (path === 'fashion') {
                setActiveSection('fashion');
            } else if (path === 'offers') {
                setActiveSection('offers');
            } else if (path === 'blog') {
                setActiveSection('blog');
            } else if (path === 'magazine') {
                setActiveSection('magazine');
            } else {
                setActiveSection('explorer');
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
                
                {/* Menú principal */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Menú</div>
                    <ul className="sidebar-menu">
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'explorer' ? 'active' : ''}`}
                                onClick={() => onSelectOption('explorer')}
                            >
                                <img src="/iconos/explorer.svg" alt="Explorador" className="sidebar-icon" />
                                <span>Explorador</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'creatives' ? 'active' : ''}`}
                                onClick={() => onSelectOption('creatives')}
                            >
                                <img src="/iconos/creatives.svg" alt="Creativos" className="sidebar-icon" />
                                <span>Creativos</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'fashion' ? 'active' : ''}`}
                                onClick={() => onSelectOption('fashion')}
                            >
                                <img src="/iconos/study.svg" alt="Estudiar moda" className="sidebar-icon" />
                                <span>Estudiar moda</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'offers' ? 'active' : ''}`}
                                onClick={() => onSelectOption('offers')}
                            >
                                <img src="/iconos/job-offer.svg" alt="Ofertas de trabajo" className="sidebar-icon" />
                                <span>Ofertas de trabajo</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'blog' ? 'active' : ''}`}
                                onClick={() => onSelectOption('blog')}
                            >
                                <img src="/iconos/blog.svg" alt="Blog" className="sidebar-icon" />
                                <span>Blog</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'magazine' ? 'active' : ''}`}
                                onClick={() => onSelectOption('magazine')}
                            >
                                <img src="/iconos/magazine.svg" alt="Revista" className="sidebar-icon" />
                                <span>Revista</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`sidebar-menu-item ${activeSection === 'about' ? 'active' : ''}`}
                                onClick={() => onSelectOption('about')}
                            >
                                <img src="/iconos/about.svg" alt="About" className="sidebar-icon" />
                                <span>About</span>
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* Más información */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title" onClick={toggleInfo} style={{ cursor: 'pointer' }}>
                        <img src={infoOpen ? "/iconos/less.svg" : "/iconos/more.svg"} alt="Más información" className="sidebar-icon" />
                        <span>Más información</span>
                    </div>
                    {infoOpen && (
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
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
