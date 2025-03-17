import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBookmark, FaSearch, FaBars, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import ProfileOptionsModal from './ProfileOptionsModal';

const Header = ({ profilePicture, onHamburgerClick }) => {
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUserType = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const response = await axios.get(`${backendUrl}/api/users/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserType(response.data.professionalType ? 'professional' : 'creative');
                } catch (error) {
                    console.error('Error fetching user type:', error);
                }
            }
        };
        fetchUserType();
    }, []);

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

    const handleCreateClick = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }
        
        if (userType === 'professional') {
            navigate('/ControlPanel/createOffer');
        } else {
            navigate('/ControlPanel/createPost');
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
                <div
                    className="saved"
                    onClick={() => navigate('/ControlPanel/guardados')}
                >
                    <FaBookmark className="nav-icon-save" title="Guardados" />
                    <span>guardados</span>
                </div>
                <button
                    className="create-post-btn"
                    onClick={handleCreateClick}
                >
                    <FaPlus style={{ color: 'white' }} /> crear
                </button>
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