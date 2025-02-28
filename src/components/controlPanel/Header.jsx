import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookmark, FaSearch, FaBars } from 'react-icons/fa';
import ProfileOptionsModal from './ProfileOptionsModal';

const Header = ({ profilePicture, onHamburgerClick }) => {
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        const token = localStorage.getItem('authToken');
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
        <header className="dashboard-header">
            <div className="dahsboard-search">
                <div className="search-input-container">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Buscar" />
                </div>
            </div>
            <div className="header-right">
                <div className="saved">
                    <FaBookmark className="nav-icon-save" title="Guardados" />
                    <span>guardados</span>
                </div>
                <button>+ crear</button>
                <div className="profile-wrapper" style={{ position: 'relative' }}>
                    <img
                        className="profile-img"
                        src={profilePicture}
                        alt="Perfil"
                        onClick={handleProfileClick}
                    />
                    <FaBars className="hamburger-menu" onClick={onHamburgerClick} />
                    {showProfileOptions && (
                        <ProfileOptionsModal
                            onClose={() => setShowProfileOptions(false)}
                            onSelectOption={handleOptionSelect}
                        />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;