import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaBars, FaPlus, FaTimes, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import logo from '../../assets/thefolder-logotipo-beta.png';
import logoMobile from '../../assets/logo-f-folder.png';
import ProfileOptionsModal from './ProfileOptionsModal';
import CreateOptionsModal from './CreateOptionsModal';
import SearchResults from './SearchResults';
import SearchFullScreen from './SearchFullScreen';

const Header = ({ profilePicture, onHamburgerClick }) => {
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [showCreateOptions, setShowCreateOptions] = useState(false);
    const [professionalType, setProfessionalType] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showFullScreenSearch, setShowFullScreenSearch] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const createButtonRef = useRef(null);
    
    // This effect ensures search results close whenever searchQuery becomes empty
    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === '') {
            setSearchResults(null);
            setShowResults(false);
            setShowFullScreenSearch(false);
        }
    }, [searchQuery]);
    
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

    // Función para realizar la búsqueda
    const performSearch = useCallback(async (term) => {
        if (!term || term.trim().length < 2) {
            setSearchResults(null);
            setShowResults(false);
            return;
        }
        
        try {
            setIsSearching(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.get(`${backendUrl}/api/users/search`, {
                params: { 
                    query: term.trim(),
                    searchByFullName: true,     // Buscar por nombre completo
                    searchByUsername: true,     // Buscar también por username
                    includePosts: true,         // Incluir posts de los usuarios encontrados
                    includeUserPosts: true      // Incluir posts creados por los usuarios encontrados
                }
            });
            setSearchResults(response.data.results);
            setIsSearching(false);
            return response.data.results;
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            setIsSearching(false);
            return null;
        }
    }, []);

    // Manejar cambios en el input con debounce
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        
        // Actualizar el valor del query inmediatamente
        setSearchQuery(value);
        
        // Limpiar cualquier timeout pendiente
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Si el valor está vacío, cerrar los resultados
        if (!value || value.trim() === '') {
            setSearchResults(null);
            setShowResults(false);
            setShowFullScreenSearch(false);
            return;
        }
        
        // Configurar un nuevo timeout para debouncing (300ms)
        const timeout = setTimeout(async () => {
            if (value && value.trim().length >= 2) {
                const results = await performSearch(value);
                // Solo mostrar resultados si el query actual tiene al menos 2 caracteres
                if (results && value && value.trim().length >= 2) {
                    setShowResults(true);
                }
            } else {
                // Si el valor es menor de 2 caracteres, asegurarse de que no haya resultados
                setSearchResults(null);
                setShowResults(false);
            }
        }, 300);
        
        setSearchTimeout(timeout);
    };
    
    // Manejar el evento Enter para abrir la búsqueda completa
    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!searchQuery || searchQuery.trim().length < 2) {
                setSearchResults(null);
                setShowResults(false);
                setShowFullScreenSearch(false);
                return;
            }
            
            const results = await performSearch(searchQuery);
            if (results) {
                setShowFullScreenSearch(true);
                setShowResults(false);
            }
        }
    };
    
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults(null);
        setShowResults(false);
        setShowFullScreenSearch(false);
        setIsSearchExpanded(false);
    };
    
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
        setShowResults(false);
        setShowFullScreenSearch(false);
        setIsSearchExpanded(false);
        setSearchQuery('');
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
                navigate('/ControlPanel/editProfile', { state: { activeMenu: 'misOfertas' } });
                break;
            case 'configuracion':
                navigate('/ControlPanel/editProfile', { state: { activeMenu: 'configuracion' } });
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
        
        if (!professionalType || professionalType === 0) {
            navigate('/ControlPanel/createPost');
            return;
        }
        
        setShowCreateOptions(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (createButtonRef.current && !createButtonRef.current.contains(event.target)) {
                setShowCreateOptions(false);
            }
            
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
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
    
    const handleResultClick = (type, item) => {
        setShowResults(false);
        setShowFullScreenSearch(false);
        switch (type) {
            case 'user':
                navigate(`/ControlPanel/profile/${item.username}`);
                break;
            case 'post':
                navigate(`/ControlPanel/post/${item._id}`);
                break;
            case 'offer':
                navigate(`/ControlPanel/JobOfferDetail/${item._id}`);
                break;
            case 'educationalOffer':
                navigate(`/ControlPanel/educational-offer/${item._id}`);
                break;
            default:
                break;
        }
    };

    // Check if the screen is mobile sized
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 769);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 769);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="dashboard-header">
            <div className="logo-dashboard" style={{ cursor: 'pointer' }} onClick={() => navigate('/ControlPanel/explorer')}>
                <img src={logo} alt="Logo" style={{ width: '150px', marginLeft: '10px' }} />
            </div>
            <div className={`dahsboard-search ${isSearchExpanded ? 'expanded' : ''}`} ref={searchRef}>
                <div className="search-input-container">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder={isSearchExpanded ? "Buscar personas, publicaciones, ofertas..." : "Buscador"} 
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleSearch}
                        onFocus={() => {
                            setIsSearchExpanded(true);
                            if (searchQuery && searchQuery.trim().length >= 2 && searchResults) {
                                setShowResults(true);
                            }
                        }}
                        onBlur={() => {
                            if (!searchQuery || !searchQuery.trim()) {
                                setIsSearchExpanded(false);
                                // Give a small delay before hiding the results to allow for clicks
                                setTimeout(() => {
                                    if (!searchQuery || !searchQuery.trim()) {
                                        setShowResults(false);
                                    }
                                }, 200);
                            }
                        }}
                        className="modern-search-input"
                    />
                    {searchQuery && (
                        <FaTimes 
                            className="search-clear-icon" 
                            onClick={clearSearch}
                            style={{ cursor: 'pointer', position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}
                        />
                    )}
                </div>
                {showResults && searchResults && searchQuery && searchQuery.trim().length >= 2 && (
                    <SearchResults 
                        results={searchResults} 
                        onResultClick={handleResultClick}
                        isLoading={isSearching}
                        onViewAll={() => {
                            setShowFullScreenSearch(true);
                            setShowResults(false);
                        }}
                    />
                )}
            </div>
            <div className="header-right">
                <button
                    className={`sidebar-menu-item saved-button ${location.pathname.includes('guardados') ? 'active' : ''}`}
                    onClick={() => navigate('/ControlPanel/guardados')}
                >
                    <img src="/iconos/save.svg" alt="Guardados" className="sidebar-icon" />
                    <span>Guardados</span>
                </button>
                {!isMobile && (
                    <div className="create-button-container" ref={createButtonRef} style={{ position: 'relative' }}>
                        <button
                            className={`create-post-btn ${location.pathname.includes('createPost') ? 'active' : ''}`}
                            onClick={handleCreateClick}
                        >
                            <FaPlus /> {getCreateButtonText()}
                        </button>
                        {showCreateOptions && (
                            <CreateOptionsModal
                                onClose={() => setShowCreateOptions(false)}
                                professionalType={professionalType}
                            />
                        )}
                    </div>
                )}
                <div className="profile-wrapper" style={{ position: 'relative' }}>
                    <img
                        className="profile-img"
                        src={profilePicture}
                        alt="Perfil"
                        onClick={handleProfileClick}
                    />
                    <div className="profile-dropdown-icon" onClick={handleProfileClick}>
                        <FaChevronDown className={`dropdown-arrow ${showProfileOptions ? 'open' : ''}`} />
                    </div>
                    <FaBars className="hamburger-menu" onClick={onHamburgerClick} />
                    {showProfileOptions && (
                        <ProfileOptionsModal
                            onClose={() => setShowProfileOptions(false)}
                            onSelectOption={handleOptionSelect}
                        />
                    )}
                </div>
            </div>
            
            {showFullScreenSearch && (
                <SearchFullScreen 
                    initialResults={searchResults}
                    initialQuery={searchQuery}
                    onClose={() => setShowFullScreenSearch(false)}
                    onSearch={performSearch}
                    onResultClick={handleResultClick}
                />
            )}
        </header>
    );
};

export default Header;