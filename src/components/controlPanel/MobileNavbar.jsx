import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaCompass, FaUsers, FaBookmark } from 'react-icons/fa';
import ProfileOptionsModal from './ProfileOptionsModal';

const mobileNavItems = [
    { id: 'explorer', icon: <FaCompass size={20}/>, label: 'Explorar', route: '/ControlPanel/explorer' },
    { id: 'creatives', icon: <FaUsers size={20}/>, label: 'Creativos', route: '/ControlPanel/creatives' },
    { id: 'guardados', icon: <FaBookmark size={20}/>, label: 'Guardados', route: '/ControlPanel/guardados' },
    { id: 'profile', icon: null, label: 'Mi perfil', route: '/ControlPanel/profile' },
];

const MobileNavbar = ({ profilePicture }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const currentPath = location.pathname;
    const token = localStorage.getItem('authToken');

    const handleProfileClick = (e) => {
        e.preventDefault();
        if (!token) {
            navigate('/', { state: { showRegister: true } });
        } else {
            setShowProfileOptions((prev) => !prev);
        }
    };

    useEffect(() => {
        setShowProfileOptions(false);
    }, [location]);

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
        return currentPath.includes(`/ControlPanel/${itemId}`);
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
                                <span>{item.label}</span>
                                {showProfileOptions && (
                                    <ProfileOptionsModal
                                        onClose={() => setShowProfileOptions(false)}
                                        onSelectOption={handleOptionSelect}
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
