import React from 'react';
import {
    FaCompass,
    FaUsers,
    FaTshirt,
    FaBriefcase,
    FaRegNewspaper,
    FaBookOpen,
    FaInfoCircle,
} from 'react-icons/fa';

const navItems = [
    { icon: <FaCompass className="nav-icon" />, tooltip: 'Explorar' },
    { icon: <FaUsers className="nav-icon" />, tooltip: 'Creativos' },
    { icon: <FaTshirt className="nav-icon" />, tooltip: 'Estudiar Moda' },
    { icon: <FaBriefcase className="nav-icon" />, tooltip: 'Ofertas' },
    { icon: <FaRegNewspaper className="nav-icon" />, tooltip: 'Blog' },
    { icon: <FaBookOpen className="nav-icon" />, tooltip: 'Revista' },
];

const Sidebar = () => {
    return (
        <aside className="dashboard-sidebar">
            <div>
                <div className="logo">
                    <img src="/multimedia/st-isotipo-temporal.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
                </div>
                <nav>
                    <ul>
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <div className="nav-icon-container">
                                    {item.icon}
                                    <span className="nav-tooltip">{item.tooltip}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="info-icon">
                <FaInfoCircle className="nav-icon" title="Información" />
            </div>
        </aside>
    );
};

export default Sidebar;
