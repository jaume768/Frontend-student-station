import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaCompass, FaUsers, FaBookmark } from 'react-icons/fa';
import ProfileOptionsModal from './ProfileOptionsModal';

const mobileNavItems = [
    { id: 'explorer', icon: <FaCompass />, label: 'Explorar' },
    { id: 'creatives', icon: <FaUsers />, label: 'Creativos' },
    { id: 'saved', icon: <FaBookmark />, label: 'Guardados' },
    { id: 'profile', icon: null, label: 'Mi perfil' },
];

const MobileNavbar = ({ profilePicture }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const activeMenu = location.state?.activeMenu || 'explorer';
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
        switch (option) {
            case 'editProfile':
                navigate('/ControlPanel', { state: { activeMenu: 'editProfile' } });
                break;
            case 'profile':
                navigate('/ControlPanel', { state: { activeMenu: 'profile' } });
                break;
            case 'community':
                navigate('/ControlPanel', { state: { activeMenu: 'community' } });
                break;
            case 'misOfertas':
                navigate('/ControlPanel', { state: { activeMenu: 'misOfertas' } });
                break; 
            case 'configuracion':
                navigate('/ControlPanel', { state: { activeMenu: 'configuracion' } });
                break;    
            case 'logout':
                localStorage.removeItem('authToken');
                navigate('/');
                break;
            default:
                break;
        }
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
                            <Link
                                to="/ControlPanel"
                                state={{ activeMenu: item.id }}
                                className={activeMenu === item.id ? 'active' : ''}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default MobileNavbar;
