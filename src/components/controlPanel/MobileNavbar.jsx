import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCompass, FaUsers, FaBookmark, FaUser } from 'react-icons/fa';

const mobileNavItems = [
    { id: 'explorer', icon: <FaCompass />, label: 'Explorar' },
    { id: 'creatives', icon: <FaUsers />, label: 'Creativos' },
    { id: 'saved', icon: <FaBookmark />, label: 'Guardados' },
    { id: 'profile', icon: <FaUser />, label: 'Mi perfil' },
];

const MobileNavbar = () => {
    const location = useLocation();
    const activeMenu = location.state?.activeMenu || 'explorer';

    const [deviceClass, setDeviceClass] = useState('android-navbar');

    useEffect(() => {
        const userAgent = navigator.userAgent;

        if (/iPhone|iPad|iPod/.test(userAgent)) {
            if (window.screen.height >= 900) {
                setDeviceClass('iphone-16-navbar');
            } else {
                setDeviceClass('ios-navbar');
            }
        }
    }, []);

    return (
        <nav className={`mobile-navbar ${deviceClass}`}>
            <ul>
                {mobileNavItems.map((item) => (
                    <li key={item.id}>
                        <Link
                            to="/ControlPanel"
                            state={{ activeMenu: item.id }}
                            className={activeMenu === item.id ? 'active' : ''}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default MobileNavbar;