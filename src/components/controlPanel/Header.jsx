import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBookmark, FaSearch, FaBars, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import ProfileOptionsModal from './ProfileOptionsModal';
import CreateOptionsModal from './CreateOptionsModal';

const Header = ({ profilePicture, onHamburgerClick }) => {
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [showCreateOptions, setShowCreateOptions] = useState(false);
    const [professionalType, setProfessionalType] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const createButtonRef = useRef(null);

    useEffect(() => {
        const fetchUserType = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const response = await axios.get(`${backendUrl}/api/users/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setProfessionalType(response.data.professionalType || null);
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
        setShowCreateOptions(false);
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
        
        // Si el usuario es de tipo 0 o no tiene tipo, ir directamente a crear publicación
        if (!professionalType || professionalType === 0) {
            navigate('/ControlPanel/createPost');
            return;
        }
        
        // Para todos los demás tipos, mostrar el modal de opciones
        setShowCreateOptions(prev => !prev);
    };

    // Cerrar los modales cuando se hace clic fuera de ellos
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (createButtonRef.current && !createButtonRef.current.contains(event.target)) {
                setShowCreateOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getCreateButtonText = () => {
        if ([1, 2, 4].includes(professionalType)) {
            return "Crear";
        } else if (professionalType === 3) {
            return "Crear";
        }
        return "Crear";
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
                    <span>Guardados</span>
                </div>
                <div className="create-button-container" ref={createButtonRef} style={{ position: 'relative' }}>
                    <button
                        className="create-post-btn"
                        onClick={handleCreateClick}
                    >
                        <FaPlus style={{ color: 'white' }} /> {getCreateButtonText()}
                    </button>
                    {showCreateOptions && (
                        <CreateOptionsModal
                            onClose={() => setShowCreateOptions(false)}
                            professionalType={professionalType}
                        />
                    )}
                </div>
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