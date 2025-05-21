import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaChevronUp, FaChevronDown, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import ProfileOptionsModal from './ProfileOptionsModal';
import CreateOptionsModal from './CreateOptionsModal';
import './css/mobileNavbar.css';

const mobileNavItems = [
    { id: 'explorer', icon: <img src="/iconos/explorer.svg" alt="Explorar" className="mobile-nav-icon" />, label: 'Explorar', route: '/ControlPanel/explorer' },
    { id: 'creatives', icon: <img src="/iconos/creatives.svg" alt="Creativos" className="mobile-nav-icon" />, label: 'Creativos', route: '/ControlPanel/creatives' },
    { id: 'create', icon: <FaPlus className="mobile-nav-icon-plus" />, label: 'Crear', route: null },
    { id: 'guardados', icon: <img src="/iconos/save.svg" alt="Guardados" className="mobile-nav-icon" />, label: 'Guardados', route: '/ControlPanel/guardados' },
    { id: 'profile', icon: null, label: 'Mi perfil', route: '/ControlPanel/profile' },
];

const MobileNavbar = ({ profilePicture }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [showCreateOptions, setShowCreateOptions] = useState(false);
    const [professionalType, setProfessionalType] = useState(null);
    const currentPath = location.pathname;
    const token = localStorage.getItem('authToken');
    const createButtonRef = useRef(null);

    const handleProfileClick = (e) => {
        e.preventDefault();
        if (!token) {
            navigate('/', { state: { showRegister: true } });
        } else {
            setShowProfileOptions((prev) => !prev);
        }
    };

    useEffect(() => {
        const fetchUserType = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const response = await axios.get(`${backendUrl}/api/users/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setProfessionalType(response.data.professionalType || null);
                } catch (error) {
                    console.error('Error fetching user type:', error);
                }
            }
        };
        fetchUserType();
    }, []);

    useEffect(() => {
        setShowProfileOptions(false);
        setShowCreateOptions(false);
    }, [location]);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (createButtonRef.current && !createButtonRef.current.contains(event.target)) {
                setShowCreateOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionSelect = (option) => {
        setShowProfileOptions(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        switch (option) {
            case 'editProfile':
                navigate('/ControlPanel/editProfile');
                break;
            case 'profile':
                navigate('/ControlPanel/profile');
                break;
            case 'community':
                navigate('/ControlPanel/community');
                break;
            case 'misOfertas':
                navigate('/ControlPanel/misOfertas');
                break;
            case 'configuracion':
                navigate('/ControlPanel/configuracion');
                break;
            case 'logout':
                localStorage.removeItem('authToken');
                navigate('/');
                break;
            default:
                break;
        }
    };

    // Función para determinar si una ruta está activa
    const isActive = (itemId) => {
        if (itemId === 'creatives' && (currentPath.includes('/ControlPanel/profile') || currentPath.includes('/ControlPanel/user/'))) {
            return true;
        }
        if (itemId === 'create' && (
            currentPath.includes('/ControlPanel/createPost') || 
            currentPath.includes('/ControlPanel/createOffer') || 
            currentPath.includes('/ControlPanel/createEducationalOffer')
        )) {
            return true;
        }
        return currentPath.includes(`/ControlPanel/${itemId}`);
    };
    
    const handleCreateClick = () => {
        if (!token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }
        
        if (!professionalType || professionalType === 0) {
            navigate('/ControlPanel/createPost');
            return;
        }
        
        setShowCreateOptions(prev => !prev);
    };

    return (
        <nav className="mobile-navbar">
            <ul>
                {mobileNavItems.map((item) => (
                    <li key={item.id}>
                        {item.id === 'profile' ? (
                            <div
                                onClick={handleProfileClick}
                                className="mobile-profile-link"
                                style={{ position: 'relative' }}
                            >
                                <img
                                    src={profilePicture}
                                    alt="Perfil"
                                    className="mobile-profile-img"
                                />
                                <div className="mobile-profile-text">
                                    <span>{item.label}</span>
                                    {showProfileOptions ? 
                                        <FaChevronUp className="profile-arrow" /> : 
                                        <FaChevronDown className="profile-arrow" />
                                    }
                                </div>
                                {showProfileOptions && (
                                    <ProfileOptionsModal
                                        onClose={() => setShowProfileOptions(false)}
                                        onSelectOption={handleOptionSelect}
                                    />
                                )}
                            </div>
                        ) : item.id === 'create' ? (
                            <div 
                                ref={createButtonRef}
                                className={`nav-link-container create-container ${showCreateOptions || isActive('create') ? 'active' : ''}`}
                                onClick={handleCreateClick}
                                style={{ position: 'relative' }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {showCreateOptions && (
                                    <CreateOptionsModal
                                        onClose={() => setShowCreateOptions(false)}
                                        professionalType={professionalType}
                                    />
                                )}
                            </div>
                        ) : (
                            <div 
                                className={`nav-link-container ${isActive(item.id) ? 'active' : ''}`}
                                onClick={() => {
                                    if (!token && item.id !== 'explorer' && item.id !== 'creatives') {
                                        navigate('/', { state: { showRegister: true } });
                                    } else {
                                        navigate(item.route);
                                    }
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default MobileNavbar;
