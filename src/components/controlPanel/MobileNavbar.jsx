import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaCompass, FaUsers, FaBookmark } from 'react-icons/fa';

const mobileNavItems = [
    { id: 'explorer', icon: <FaCompass />, label: 'Explorar' },
    { id: 'creatives', icon: <FaUsers />, label: 'Creativos' },
    { id: 'saved', icon: <FaBookmark />, label: 'Guardados' },
    { id: 'profile', icon: null, label: 'Mi perfil' },
];

const MobileNavbar = ({ profilePicture }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const activeMenu = location.state?.activeMenu || 'explorer';
    const token = localStorage.getItem('authToken');

    return (
        <nav className="mobile-navbar">
            <ul>
                {mobileNavItems.map((item) => (
                    <li key={item.id}>
                        {item.id === 'profile' ? (
                            token ? (
                                <Link
                                    to="/ControlPanel"
                                    state={{ activeMenu: 'editProfile' }}
                                    className={`mobile-profile-link ${activeMenu === 'editProfile' ? 'active' : ''}`}
                                >
                                    <img
                                        src={profilePicture}
                                        alt="Perfil"
                                        className="mobile-profile-img"
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            ) : (
                                <div
                                    onClick={() => navigate('/', { state: { showRegister: true } })}
                                    className="mobile-profile-link"
                                    style={{ position: 'relative' }}
                                >
                                    <img
                                        src={profilePicture}
                                        alt="Perfil"
                                        className="mobile-profile-img"
                                    />
                                    <span>{item.label}</span>
                                </div>
                            )
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
