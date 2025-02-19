import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCompass, FaUsers, FaBookmark } from 'react-icons/fa';

const mobileNavItems = [
    { id: 'explorer', icon: <FaCompass />, label: 'Explorar' },
    { id: 'creatives', icon: <FaUsers />, label: 'Creativos' },
    { id: 'saved', icon: <FaBookmark />, label: 'Guardados' },
    { id: 'profile', icon: null, label: 'Mi perfil' },
];

const MobileNavbar = ({ profilePicture}) => {
    return (
        <nav className="mobile-navbar">
            <ul>
                {mobileNavItems.map((item) => (
                    <li key={item.id}>
                        <Link
                            to="/ControlPanel"
                            state={{ activeMenu: item.id }}
                            className={activeMenu === item.id ? 'active' : ''}
                        >
                            {item.id === 'profile' ? (
                                <img src={profilePicture} alt="Perfil" className="mobile-profile-img" />
                            ) : (
                                item.icon
                            )}
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default MobileNavbar;