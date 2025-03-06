// Sidebar.jsx (o MobileSideMenu.jsx si es el menú móvil)
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    FaCompass,
    FaUsers,
    FaTshirt,
    FaBriefcase,
    FaRegNewspaper,
    FaBookOpen,
    FaInfoCircle,
} from 'react-icons/fa';
import logo from '../../assets/st-isotipo-temporal.png';

const navItems = [
    { id: 'explorer', icon: <FaCompass className="nav-icon" />, tooltip: 'Explorar' },
    { id: 'creatives', icon: <FaUsers className="nav-icon" />, tooltip: 'Creativos' },
    { id: 'fashion', icon: <FaTshirt className="nav-icon" />, tooltip: 'Estudiar Moda' },
    { id: 'offers', icon: <FaBriefcase className="nav-icon" />, tooltip: 'Ofertas' },
    { id: 'blog', icon: <FaRegNewspaper className="nav-icon" />, tooltip: 'Blog' },
    { id: 'magazine', icon: <FaBookOpen className="nav-icon" />, tooltip: 'Revista' },
];

const Sidebar = ({ onLinkClick }) => {
    const location = useLocation();
    const activeMenu = location.state?.activeMenu || 'explorer';

    return (
        <aside className="dashboard-sidebar">
            <div>
                <div className="logo-dashboard">
                    <img src={logo} alt="Logo" style={{ width: '50px', height: '60px' }} />
                </div>
                <nav>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to="/ControlPanel"
                                    state={{ activeMenu: item.id }}
                                    className={`nav-icon-container ${activeMenu === item.id ? 'active' : ''}`}
                                    onClick={onLinkClick}
                                >
                                    {item.icon}
                                    <span className="nav-tooltip">{item.tooltip}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="info-icon">
                <Link
                    to="/ControlPanel"
                    state={{ activeMenu: 'info' }}
                    className="nav-icon-container"
                    onClick={onLinkClick}
                >
                    <FaInfoCircle className="nav-icon" title="Información" />
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
