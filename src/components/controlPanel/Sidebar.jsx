import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/thefolder-logotipo-beta.png';
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
            navigate(`/${path}`, { state: stateObj });
        } else {
            navigate(`/${path}`);
        }
        if (onLinkClick) onLinkClick();
    };
    
    // Función para obtener la sección activa basada en la URL
    const getActiveSection = () => {
        const path = location.pathname;
        
        if (path === '/' || path === '/login') return 'community';
        if (path.includes('/profile/') && !path.includes('/editProfile')) return 'creatives';
        if (path.includes('/editProfile')) return 'editProfile';
        if (path.includes('/misOfertas')) return 'misOfertas';
        if (path.includes('/configuracion')) return 'configuracion';
        if (path.includes('/community') || path.includes('/createPost')) return 'community';
        if (path.includes('/explorer')) return 'explorer';
        if (path.includes('/creatives')) return 'creatives';
        if (path.includes('/offers') || path.includes('/createOffer') || path.includes('/createEducationalOffer') || path.includes('/offer/') || path.includes('/edit-offer/') || path.includes('/edit-educational-offer/') || path.includes('/JobOfferDetail/') || path.includes('/EducationalOfferDetail/')) return 'offers';
        if (path.includes('/fashion')) return 'fashion';
        if (path.includes('/guardados')) return 'guardados';
        if (path.includes('/blog') || path.includes('/magazine') || path.includes('/article/')) return 'blog';
        if (path.includes('/legal') || path.includes('/privacy') || path.includes('/cookies') || path.includes('/contact') || path.includes('/about') || path.includes('/info')) return 'info';
        return 'community'; // Valor por defecto
    };

    // Detectar la sección activa basada en la URL y el estado
    useEffect(() => {
        // Comprobar si hay estado en la localización actual
        const currentState = location.state?.activeMenu;
        
        if (currentState) {
            setActiveSection(currentState);
        } else {
            setActiveSection(getActiveSection());
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
        <div className="menu-tab-menu-container">
            <div className="menu-tab-menu-button">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="menu-tab-menu-tabs">
                {/* Menú principal */}
                <button 
                    className={`menu-tab-tab ${activeSection === 'explorer' ? 'active' : ''}`}
                    onClick={() => onSelectOption('explorer')}
                >
                    <img src="/iconos/explorer.svg" alt="Explorador" className="sidebar-icon" />
                    Explorador
                </button>
                <button 
                    className={`menu-tab-tab ${activeSection === 'creatives' ? 'active' : ''}`}
                    onClick={() => onSelectOption('creatives')}
                >
                    <img src="/iconos/creatives.svg" alt="Creativos" className="sidebar-icon" />
                    Creativos
                </button>
                <button 
                    className={`menu-tab-tab ${activeSection === 'fashion' ? 'active' : ''}`}
                    onClick={() => onSelectOption('fashion')}
                >
                    <img src="/iconos/study.svg" alt="Estudiar moda" className="sidebar-icon" />
                    Estudiar moda
                </button>
                <button 
                    className={`menu-tab-tab ${activeSection === 'offers' ? 'active' : ''}`}
                    onClick={() => onSelectOption('offers')}
                >
                    <img src="/iconos/job-offer.svg" alt="Ofertas de trabajo" className="sidebar-icon" />
                    Ofertas de trabajo
                </button>
                <button 
                    className={`menu-tab-tab ${activeSection === 'blog' ? 'active' : ''}`}
                    onClick={() => onSelectOption('blog')}
                >
                    <img src="/iconos/blog.svg" alt="Blog" className="sidebar-icon" />
                    Blog
                </button>
                <button 
                    className={`menu-tab-tab ${activeSection === 'magazine' ? 'active' : ''}`}
                    onClick={() => onSelectOption('magazine')}
                >
                    <img src="/iconos/magazine.svg" alt="Revista" className="sidebar-icon" />
                    Revista
                </button>
                <button 
                    className={`menu-tab-tab ${activeSection === 'about' ? 'active' : ''}`}
                    onClick={() => onSelectOption('about')}
                >
                    <img src="/iconos/about.svg" alt="About" className="sidebar-icon" />
                    About
                </button>
                
                {/* Más información (desplegable al hacer hover) */}
                {infoOpen && (
                    <>
                        <button 
                            className={`menu-tab-tab ${activeSection === 'contact' ? 'active' : ''}`}
                            onClick={() => onSelectOption('contact')}
                        >
                            Contacto
                        </button>
                        <button 
                            className={`menu-tab-tab ${activeSection === 'legal' ? 'active' : ''}`}
                            onClick={() => onSelectOption('legal')}
                        >
                            Aviso legal
                        </button>
                        <button 
                            className={`menu-tab-tab ${activeSection === 'cookies' ? 'active' : ''}`}
                            onClick={() => onSelectOption('cookies')}
                        >
                            Política de cookies
                        </button>
                        <button 
                            className={`menu-tab-tab ${activeSection === 'privacy' ? 'active' : ''}`}
                            onClick={() => onSelectOption('privacy')}
                        >
                            Política de privacidad
                        </button>
                        <button 
                            className="menu-tab-tab"
                            onClick={() => onSelectOption('logout')}
                        >
                            Cerrar sesión
                        </button>
                    </>
                )}
                <button 
                    className="menu-tab-tab"
                    onClick={toggleInfo}
                >
                    <img src={infoOpen ? "/iconos/less.svg" : "/iconos/more.svg"} alt="Más información" className="sidebar-icon" />
                    {infoOpen ? 'Menos información' : 'Más información'}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
