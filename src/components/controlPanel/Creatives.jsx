import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { MdTune, MdClose } from 'react-icons/md';
import Draggable from 'react-draggable';
import './css/Creatives.css';

const Creatives = () => {
    const [creatives, setCreatives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [tabDisabled, setTabDisabled] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        city: '',
        country: '',
        school: '',
        skills: '',
        graduationYear: '',
        professionalProfile: '',
        software: '',
        availability: '',
        internships: false
    });
    
    const [appliedFilters, setAppliedFilters] = useState({});

    const navigate = useNavigate();
    const observer = useRef();
    const initialPosRef = useRef({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    // Estado para mostrar filtros de escritorio
    const [showFilters, setShowFilters] = useState(false);

    // Detectar si estamos en móvil
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        // Comprobar al cargar y al cambiar el tamaño de la ventana
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);
    
    // Referencia al último elemento para la paginación infinita
    const lastCreativeElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Cargar creativos
    useEffect(() => {
        const fetchCreatives = async () => {
            setLoading(true);
            setError(null);

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                // Construir parámetros de consulta
                let params = new URLSearchParams();
                params.append('page', page);
                params.append('limit', 9);

                // Aplicar filtros activos
                if (appliedFilters.search) params.append('search', appliedFilters.search);
                if (appliedFilters.city) params.append('city', appliedFilters.city);
                if (appliedFilters.country) params.append('country', appliedFilters.country);
                if (appliedFilters.school) params.append('school', appliedFilters.school);
                if (appliedFilters.skills) params.append('skills', appliedFilters.skills);
                if (appliedFilters.graduationYear) params.append('graduationYear', appliedFilters.graduationYear);
                if (appliedFilters.professionalProfile) params.append('professionalProfile', appliedFilters.professionalProfile);
                if (appliedFilters.software) params.append('software', appliedFilters.software);
                if (appliedFilters.availability) params.append('availability', appliedFilters.availability);
                if (appliedFilters.internships) params.append('internships', appliedFilters.internships);

                const response = await axios.get(
                    `${backendUrl}/api/users/creatives?${params.toString()}`
                );

                const newCreatives = response.data.creatives;
                
                // Filtrar solo creativos que tengan al menos un post
                const filteredCreatives = newCreatives.filter(creative => creative.lastPost);

                // Actualizar estado
                setCreatives(prev => {
                    if (page === 1) {
                        return filteredCreatives;
                    } else {
                        return [...prev, ...filteredCreatives];
                    }
                });

                // Ajustar hasMore basado en la cantidad de creativos filtrados
                const originalLength = newCreatives.length;
                const filteredLength = filteredCreatives.length;
                setHasMore(filteredLength > 0 && originalLength > 0 && page < response.data.totalPages);

                // Guardar países para filtro si es la primera página
                if (page === 1) {
                    setCountries(response.data.countries);
                }

            } catch (error) {
                console.error("Error al cargar creativos:", error);
                setError("No se pudieron cargar los creativos. Por favor, inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchCreatives();
    }, [page, appliedFilters]);

    // Manejar cambios en los filtros (solo actualiza el estado, no aplica los filtros)
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };
    
    // Aplicar filtros cuando se hace clic en el botón
    const applyFilters = () => {
        setAppliedFilters({...filters});
        setPage(1); // Reiniciar paginación
    };

    // Navegar al perfil del usuario
    const handleUserClick = (username) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }
        navigate(`/ControlPanel/profile/${username}`);
    };

    // Función para limpiar todos los filtros
    const clearFilters = () => {
        const emptyFilters = {
            search: '',
            city: '',
            country: '',
            school: '',
            skills: '',
            graduationYear: '',
            professionalProfile: '',
            software: '',
            availability: '',
            internships: false
        };
        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        setPage(1);
    };

    // Renderizado de filtros
    const renderFilters = () => {
        return (
            <div className="creatives-filters">
                <h3>Filtros</h3>
                {/* Buscador */}
                <div className="filter-search">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscador" 
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>
                
                {/* País */}
                <div className="filter-input">
                    <input 
                        type="text" 
                        placeholder="País" 
                        value={filters.country}
                        onChange={(e) => handleFilterChange('country', e.target.value)}
                    />
                </div>
                
                {/* Ciudad */}
                <div className="filter-input">
                    <input 
                        type="text" 
                        placeholder="Ciudad" 
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                    />
                </div>
                
                {/* Centro de estudios */}
                <div className="filter-input">
                    <input 
                        type="text" 
                        placeholder="Centro de estudios" 
                        value={filters.school}
                        onChange={(e) => handleFilterChange('school', e.target.value)}
                    />
                </div>
                
                {/* Año de graduación */}
                <div className="filter-select">
                    <select
                        value={filters.graduationYear}
                        onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                    >
                        <option value="">Año de graduación</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                </div>
                
                {/* Softskills */}
                <div className="filter-input">
                    <input 
                        type="text" 
                        placeholder="Softskills" 
                        value={filters.skills}
                        onChange={(e) => handleFilterChange('skills', e.target.value)}
                    />
                </div>
                
                {/* Hardskills / Software */}
                <div className="filter-input">
                    <input 
                        type="text" 
                        placeholder="Hardskills / Software" 
                        value={filters.software}
                        onChange={(e) => handleFilterChange('software', e.target.value)}
                    />
                </div>
                
                {/* Prácticas */}
                <div className="filter-checkbox">
                    <label>
                        Prácticas
                        <input 
                            type="checkbox" 
                            checked={filters.internships}
                            onChange={(e) => handleFilterChange('internships', e.target.checked)}
                        />
                    </label>
                </div>
                
                {/* Botón para aplicar filtros */}
                <button className="apply-filters-btn" onClick={applyFilters}>
                    Aplicar filtros
                </button>
            </div>
        );
    };

    // Renderizar galería de creativos
    const renderCreativesGallery = () => {
        if (error) {
            return <div className="error-message">{error}</div>;
        }

        if (creatives.length === 0 && !loading) {
            return <div className="no-results">No se encontraron creativos con los filtros aplicados</div>;
        }

        return (
            <div className="creatives-masonry">
                {creatives.map((creative, index) => {
                    const isLastElement = index === creatives.length - 1;
                    return (
                        <div
                            key={creative._id}
                            className="creative-card"
                            ref={isLastElement ? lastCreativeElementRef : null}
                            onClick={() => handleUserClick(creative.username)}
                        >
                            <div className="creative-profile">
                                <img
                                    src={creative.profile && creative.profile.profilePicture ? creative.profile.profilePicture : "/multimedia/usuarioDefault.jpg"}
                                    alt={creative.username}
                                    className="profile-picture"
                                />
                                <div className="creative-details">
                                    <h3>{creative.fullName || creative.username}</h3>
                                    {creative.country && (
                                        <div className="creative-location">
                                            <span>{creative.country}, {creative.city}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="creative-tags">
                                {creative.skills && creative.skills.length > 0 ? (
                                    creative.skills.slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="tag-creatives">{skill}</span>
                                    ))
                                ) : (
                                    <span className="tag-creatives">Sin habilidades</span>
                                )}
                            </div>
                            <div className="creative-post-image">
                                <img
                                    src={creative.lastPost.mainImage}
                                    alt={creative.lastPost.title || "Proyecto creativo"}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Función para abrir filtros según dispositivo
    const handleOpenFilters = () => {
        if (isMobile) setShowMobileFilters(prev => !prev);
        else setShowFilters(prev => !prev);
    };

    return (
        <div className="creatives-container">
            <div className="offers-header">
                <h1>Creativos</h1>
                <p className="offers-description">
                    Descubre los nuevos talentos de la industria de la moda. Usa los filtros para descubrir perfiles según
                    tus estudios, ciudad, especialización, disponibilidad para prácticas, colaboraciones y más.
                </p>
                <div className="explorer-tabs-container">
                    <div className="explorer-tabs">
                        <button
                            className={`user-extern-tab ${activeTab === 'all' ? 'active' : ''}`}
                            disabled={tabDisabled}
                            onClick={() => {
                                if (!tabDisabled) {
                                    setTabDisabled(true);
                                    setActiveTab('all');
                                    setPage(1);
                                    setFilters(prev => ({ ...prev, internships: false }));
                                    setAppliedFilters(prev => ({ ...prev, internships: false }));
                                    setTimeout(() => setTabDisabled(false), 500);
                                }
                            }}
                        >
                            Todos los usuarios
                        </button>
                        <button
                            className={`user-extern-tab ${activeTab === 'internships' ? 'active' : ''}`}
                            disabled={tabDisabled}
                            onClick={() => {
                                if (!tabDisabled) {
                                    setTabDisabled(true);
                                    setActiveTab('internships');
                                    setPage(1);
                                    setFilters(prev => ({ ...prev, internships: true }));
                                    setAppliedFilters(prev => ({ ...prev, internships: true }));
                                    setTimeout(() => setTabDisabled(false), 500);
                                }
                            }}
                        >
                            Disponible para prácticas
                        </button>
                    </div>
                </div>
                
                {/* Botón de filtro para móvil */}
                {isMobile && (
                    <Draggable
                        onStart={(e, data) => {
                            initialPosRef.current = { x: data.x, y: data.y };
                            setDragging(false);
                            return true;
                        }}
                        onDrag={(e, data) => {
                            const dx = data.x - initialPosRef.current.x;
                            const dy = data.y - initialPosRef.current.y;
                            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDragging(true);
                        }}
                        onStop={(e, data) => {
                            if (!dragging) setShowMobileFilters(prev => !prev);
                        }}
                    >
                        <button className="creatives-filter-button">
                            <MdTune />
                        </button>
                    </Draggable>
                )}
                {/* Botón de filtro para desktop */}
                {!isMobile && !showFilters && (
                    <button
                        className="creatives-filter-button"
                        title="Abrir filtros"
                        aria-label="Abrir filtros"
                        onClick={handleOpenFilters}
                    >
                        <MdTune />
                    </button>
                )}
            </div>
            
            {/* Modal de filtros para móvil */}
            {showMobileFilters && (
                <div 
                    className="creatives-mobile-filters-modal"
                    onClick={(e) => {
                        // Cerrar el modal si se hace clic fuera del contenido
                        if (e.target.className === 'creatives-mobile-filters-modal') {
                            setShowMobileFilters(false);
                        }
                    }}
                >
                    <div className="creatives-mobile-filters-content">
                        <div className="creatives-mobile-filters-header">
                            <button 
                                className="creatives-mobile-filters-close" 
                                onClick={() => setShowMobileFilters(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="creatives-filters-modal-content">
                            {renderFilters()}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Panel de filtros (desktop) */}
            <div className={`creatives-filters-panel ${showFilters ? 'show' : ''}`}>
                <div className="creatives-filters-container">
                    <div className="creatives-filters-header">
                        <button
                            className="creatives-filters-header-close"
                            onClick={() => setShowFilters(false)}
                            title="Cerrar filtros"
                        >
                            <MdClose />
                        </button>
                    </div>
                    <div className="creatives-filters-content">
                        {renderFilters()}
                        <button
                            className="creatives-clear-filters-btn"
                            onClick={() => { clearFilters(); }}
                        >
                            Borrar Filtros
                        </button>
                    </div>
                </div>
            </div>

            <div className={`creatives-content ${showFilters ? 'with-filters' : ''}`}>
                {/* Sidebar de filtros en desktop eliminado, uso panel deslizable para filtros */}
                <main className="creatives-main">
                    {renderCreativesGallery()}
                    {loading && <div className="loading-indicator">Cargando más creativos...</div>}
                    {!hasMore && creatives.length > 0 && (
                        <div className="end-message">No hay más creativos para mostrar</div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Creatives;
