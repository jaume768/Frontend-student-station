import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './css/Creatives.css';

const Creatives = () => {
    const [creatives, setCreatives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        country: '',
        category: '',
        school: '',
        level: '',
        workWithStudents: false,
        openToInternships: false
    });

    const navigate = useNavigate();
    const observer = useRef();

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

                if (filters.country) params.append('country', filters.country);
                if (filters.category) params.append('category', filters.category);

                const response = await axios.get(
                    `${backendUrl}/api/users/creatives?${params.toString()}`
                );

                const newCreatives = response.data.creatives;

                // Actualizar estado
                setCreatives(prev => {
                    if (page === 1) {
                        return newCreatives;
                    } else {
                        return [...prev, ...newCreatives];
                    }
                });

                setHasMore(newCreatives.length > 0 && page < response.data.totalPages);

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
    }, [page, filters.country, filters.category]);

    // Manejar cambios en los filtros
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => {
            // Si el valor es el mismo, quitar el filtro
            if (prev[filterName] === value && typeof value !== 'boolean') {
                return { ...prev, [filterName]: '' };
            } else {
                return { ...prev, [filterName]: value };
            }
        });
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
        setFilters({
            country: '',
            category: '',
            school: '',
            level: '',
            workWithStudents: false,
            openToInternships: false
        });
        setPage(1);
    };

    // Renderizado de filtros
    const renderFilters = () => {
        return (
            <div className="creatives-filters">
                <div className="filter-section">
                    <h4>Filtros:</h4>
                    <button
                        className="clear-filters-btn"
                        onClick={clearFilters}
                    >
                        Limpiar filtros
                    </button>
                </div>

                <div className="filter-section">
                    <label>Ordenar</label>
                    <select
                        value={filters.sort || ''}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Relevancia</option>
                        <option value="newest">Más recientes</option>
                        <option value="oldest">Más antiguos</option>
                    </select>
                </div>

                <div className="filter-section">
                    <label>Escuelas</label>
                    <select
                        value={filters.school || ''}
                        onChange={(e) => handleFilterChange('school', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todas</option>
                        <option value="ESDi">ESDi</option>
                        <option value="IED">IED</option>
                        <option value="LCI">LCI</option>
                    </select>
                </div>

                <div className="filter-section">
                    <label>Nivel educativo</label>
                    <select
                        value={filters.level || ''}
                        onChange={(e) => handleFilterChange('level', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todos</option>
                        <option value="Grado">Grado</option>
                        <option value="Máster">Máster</option>
                        <option value="Postgrado">Postgrado</option>
                    </select>
                </div>

                <div className="filter-section">
                    <label>Otros</label>
                    <select
                        value={filters.category || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todos</option>
                        <option value="Moda">Moda</option>
                        <option value="Diseño">Diseño</option>
                        <option value="Fotografía">Fotografía</option>
                    </select>
                </div>

                <div className="filter-section">
                    <label>País</label>
                    <select
                        value={filters.country || ''}
                        onChange={(e) => handleFilterChange('country', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todos</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>{country}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-checkbox">
                    <input
                        type="checkbox"
                        id="workWithStudents"
                        checked={filters.workWithStudents}
                        onChange={() => handleFilterChange('workWithStudents', !filters.workWithStudents)}
                    />
                    <label htmlFor="workWithStudents">Trabaja con estudiantes</label>
                </div>

                <div className="filter-checkbox">
                    <input
                        type="checkbox"
                        id="openToInternships"
                        checked={filters.openToInternships}
                        onChange={() => handleFilterChange('openToInternships', !filters.openToInternships)}
                    />
                    <label htmlFor="openToInternships">Abierto a prácticas</label>
                </div>
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
                            {/* Perfil en la parte superior */}
                            <div className="creative-profile">
                                <img
                                    src={creative.profilePicture || "/multimedia/usuarioDefault.jpg"}
                                    alt={creative.username}
                                    className="profile-picture"
                                />
                                <div className="creative-details">
                                    <h3>{creative.username}</h3>
                                    {creative.country && (
                                        <div className="creative-location">
                                            <FaMapMarkerAlt className="location-icon" />
                                            <span>{creative.country}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Imagen del post en el medio */}
                            <div className="creative-post-image">
                                {creative.lastPost ? (
                                    <img
                                        src={creative.lastPost.mainImage}
                                        alt={creative.lastPost.title || "Proyecto creativo"}
                                    />
                                ) : (
                                    <div className="no-post-placeholder">
                                        <span>Sin proyectos</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Etiquetas en la parte inferior */}
                            <div className="creative-tags">
                                {creative.professionalAreas && creative.professionalAreas.length > 0 ? (
                                    creative.professionalAreas.slice(0, 3).map((area, idx) => (
                                        <span key={idx} className="tag">{area}</span>
                                    ))
                                ) : (
                                    <span className="tag">Fotografía</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="creatives-container">
            <div className="creatives-content">
                <aside className="creatives-sidebar">
                    {renderFilters()}
                </aside>
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
