import React, { useState } from 'react';
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
                                    <ProfileOptionsModal onClose={() => setShowProfileOptions(false)} />
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
