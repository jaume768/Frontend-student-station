import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import './css/Creatives.css';

const Creatives = () => {
    const [creatives, setCreatives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
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
                
                {/* Ciudad */}
                <div className="filter-input">
                    <input 
                        type="text" 
                        placeholder="Ciudad" 
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                    />
                </div>
                
                {/* País - Usando los países disponibles del backend */}
                <div className="filter-select">
                    <select
                        value={filters.country}
                        onChange={(e) => handleFilterChange('country', e.target.value)}
                    >
                        <option value="">País</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>{country}</option>
                        ))}
                    </select>
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
                
                {/* Habilidades */}
                <div className="filter-input">
                    <input 
                        type="text" 
                        placeholder="Habilidades" 
                        value={filters.skills}
                        onChange={(e) => handleFilterChange('skills', e.target.value)}
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
                
                {/* Perfil profesional */}
                <div className="filter-select">
                    <select
                        value={filters.professionalProfile}
                        onChange={(e) => handleFilterChange('professionalProfile', e.target.value)}
                    >
                        <option value="">Perfil profesional</option>
                        <option value="Diseñador">Diseñador</option>
                        <option value="Fotógrafo">Fotógrafo</option>
                        <option value="Estilista">Estilista</option>
                        <option value="Modelista">Modelista</option>
                    </select>
                </div>
                
                {/* Software */}
                <div className="filter-select">
                    <select
                        value={filters.software}
                        onChange={(e) => handleFilterChange('software', e.target.value)}
                    >
                        <option value="">Software</option>
                        <option value="Photoshop">Photoshop</option>
                        <option value="Illustrator">Illustrator</option>
                        <option value="InDesign">InDesign</option>
                        <option value="CLO 3D">CLO 3D</option>
                    </select>
                </div>
                
                {/* Disponibilidad */}
                <div className="filter-select">
                    <select
                        value={filters.availability}
                        onChange={(e) => handleFilterChange('availability', e.target.value)}
                    >
                        <option value="">Disponibilidad</option>
                        <option value="Inmediata">Inmediata</option>
                        <option value="1 mes">1 mes</option>
                        <option value="3 meses">3 meses</option>
                    </select>
                </div>
                
                {/* Prácticas */}
                <div className="filter-select">
                    <select
                        value={filters.internships ? "true" : ""}
                        onChange={(e) => handleFilterChange('internships', e.target.value === "true")}
                    >
                        <option value="">Prácticas</option>
                        <option value="true">Disponible para prácticas</option>
                        <option value="false">No disponible para prácticas</option>
                    </select>
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
                                    <h3>{creative.username}</h3>
                                    {creative.country && (
                                        <div className="creative-location">
                                            <FaMapMarkerAlt className="location-icon" />
                                            <span>{creative.country}</span>
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

    return (
        <div className="creatives-container">
            <div className="offers-header">
                <h1>Creativos</h1>
                <p className="offers-description">
                    Descubre los nuevos talentos de la industria de la moda. Usa los filtros para descubrir perfiles según
                    tus estudios, ciudad, especialización, disponibilidad para prácticas, colaboraciones y más.
                </p>
            </div>
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
