import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBookmark, FaSearch, FaBars, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';
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
    const [searchTimeout, setSearchTimeout] = useState(null);
    const searchRef = useRef(null);
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

    // Función para realizar la búsqueda
    const performSearch = useCallback(async (term) => {
        if (term.trim().length < 2) {
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
        setSearchQuery(value);
        
        // Limpiar cualquier timeout pendiente
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        if (value.trim() === '') {
            setSearchResults(null);
            setShowResults(false);
            return;
        }
        
        // Configurar un nuevo timeout para debouncing (300ms)
        const timeout = setTimeout(async () => {
            if (value.trim().length >= 2) {
                const results = await performSearch(value);
                if (results) {
                    setShowResults(true);
                }
            }
        }, 300);
        
        setSearchTimeout(timeout);
    };
    
    // Manejar el evento Enter para abrir la búsqueda completa
    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
            e.preventDefault();
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
                navigate(`/ControlPanel/offer/${item._id}`);
                break;
            case 'educationalOffer':
                navigate(`/ControlPanel/educational-offer/${item._id}`);
                break;
            default:
                break;
        }
    };

    return (
        <header className="dashboard-header">
            <div className="dahsboard-search" ref={searchRef}>
                <div className="search-input-container">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscar personas, publicaciones, ofertas..." 
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleSearch}
                        onFocus={() => searchQuery.trim().length >= 2 && searchResults && setShowResults(true)}
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
                {showResults && searchResults && (
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