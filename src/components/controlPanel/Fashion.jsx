import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/fashion.css';

const Fashion = () => {
    const navigate = useNavigate();
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        location: [],
        studyType: [],
        modality: [],
        years: [],
        visibility: 'all' // 'all', 'public', 'private'
    });
    const [locations, setLocations] = useState([]);
    const [studyTypes, setStudyTypes] = useState([]);
    const [hoveredInstitution, setHoveredInstitution] = useState(null);
    const hoverPanelRef = useRef(null);
    
    // Obtener datos del backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                // Obtener ofertas educativas agrupadas por institución
                const response = await axios.get(`${backendUrl}/api/offers/educational/institutions`);
                console.log("Datos recibidos:", response.data);
                
                // Procesar los datos
                if (response.data && response.data.institutions) {
                    setInstitutions(response.data.institutions);
                    
                    // Extraer ubicaciones únicas para filtros
                    const uniqueLocations = [...new Set(
                        response.data.institutions
                            .filter(inst => inst.location && inst.location.city)
                            .map(inst => inst.location.city)
                    )];
                    setLocations(uniqueLocations);
                    
                    // Extraer tipos de estudio únicos para filtros
                    const uniqueStudyTypes = [...new Set(
                        response.data.institutions.flatMap(inst => 
                            inst.programs.map(prog => prog.educationType)
                        ).filter(Boolean)
                    )];
                    setStudyTypes(uniqueStudyTypes);
                } else {
                    console.error("Formato de respuesta inválido:", response.data);
                    setError("No se pudieron cargar los datos correctamente");
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener los datos:", err);
                setError("Ocurrió un error al cargar los datos");
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
    // Función para actualizar filtros
    const handleFilterChange = (type, value) => {
        if (type === 'search') {
            setFilters(prev => ({ ...prev, search: value }));
            return;
        }
        
        if (type === 'visibility') {
            setFilters(prev => ({ ...prev, visibility: value }));
            return;
        }
        
        // Para filtros de tipo array (location, studyType, etc.)
        setFilters(prev => {
            const currentValues = [...prev[type]];
            
            if (currentValues.includes(value)) {
                return { ...prev, [type]: currentValues.filter(v => v !== value) };
            } else {
                return { ...prev, [type]: [...currentValues, value] };
            }
        });
    };
    
    // Aplicar filtros a las instituciones
    const filteredInstitutions = institutions.filter(institution => {
        console.log("Evaluando institución:", institution.name);
        
        // Filtro de búsqueda por texto
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase();
            const nameMatch = institution.name?.toLowerCase().includes(searchTerm);
            const locationMatch = institution.location?.city?.toLowerCase().includes(searchTerm);
            
            if (!nameMatch && !locationMatch) {
                console.log(`${institution.name} no pasó el filtro de búsqueda`);
                return false;
            }
        }
        
        // Filtro por visibilidad (público/privado)
        if (filters.visibility !== 'all') {
            if (institution.type !== filters.visibility) {
                console.log(`${institution.name} no pasó el filtro de visibilidad`);
                return false;
            }
        }
        
        // Filtro por ubicación
        if (filters.location.length > 0) {
            if (!institution.location || !filters.location.includes(institution.location.city)) {
                console.log(`${institution.name} no pasó el filtro de ubicación`);
                return false;
            }
        }
        
        // Filtro por tipo de estudio (verifica si la institución ofrece algún programa del tipo seleccionado)
        if (filters.studyType.length > 0) {
            const hasMatchingProgram = institution.programs.some(program => 
                filters.studyType.includes(program.educationType)
            );
            if (!hasMatchingProgram) {
                console.log(`${institution.name} no pasó el filtro de tipo de estudio`);
                return false;
            }
        }
        
        // Filtro por modalidad
        if (filters.modality.length > 0) {
            const hasMatchingModality = institution.programs.some(program => 
                filters.modality.includes(program.modality)
            );
            if (!hasMatchingModality) {
                console.log(`${institution.name} no pasó el filtro de modalidad`);
                return false;
            }
        }
        
        console.log(`${institution.name} pasó todos los filtros`);
        return true;
    });
    
    // Función para limpiar todos los filtros
    const clearAllFilters = () => {
        setFilters({
            search: '',
            location: [],
            studyType: [],
            modality: [],
            years: [],
            visibility: 'all'
        });
    };
    
    // Funciones para manejar el hover
    const handleMouseEnter = (institution) => {
        setHoveredInstitution(institution);
    };
    
    const handleMouseLeave = () => {
        setHoveredInstitution(null);
    };
    
    // Función para navegar al perfil de la institución
    const navigateToProfile = (institution) => {
        // Comprobar primero si hay un username asociado
        console.log(institution);
        if (institution.username) {
            navigate(`/ControlPanel/profile/${institution.username}`);
        } 
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }
    
    if (error) {
        return <div className="error">{error}</div>;
    }
    
    return (
        <div className="fashion-container">
            {/* Sección de filtros */}
            <div className="filters-section">
                <h3>Filtros</h3>
                
                {/* Buscador */}
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar" 
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>
                
                {/* Filtro de visibilidad */}
                <div className="toggle-group">
                    <button 
                        className={`toggle-button ${filters.visibility === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('visibility', 'all')}
                    >
                        Todo
                    </button>
                    <button 
                        className={`toggle-button ${filters.visibility === 'public' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('visibility', 'public')}
                    >
                        Pública
                    </button>
                    <button 
                        className={`toggle-button ${filters.visibility === 'private' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('visibility', 'private')}
                    >
                        Privada
                    </button>
                </div>
                
                {/* Filtro de ubicación */}
                <div className="filter-group">
                    <div className="filter-title">
                        <span>Localización</span>
                        {filters.location.length > 0 && (
                            <small onClick={() => setFilters(prev => ({ ...prev, location: [] }))}>
                                Limpiar
                            </small>
                        )}
                    </div>
                    <div className="filter-tags">
                        {locations.map(location => (
                            <div 
                                key={location} 
                                className={`filter-tag ${filters.location.includes(location) ? 'active' : ''}`}
                                onClick={() => handleFilterChange('location', location)}
                            >
                                {location}
                                {filters.location.includes(location) && <i className="fas fa-times"></i>}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Filtro de tipo de estudio */}
                <div className="filter-group">
                    <div className="filter-title">
                        <span>Centro de estudios</span>
                        {filters.studyType.length > 0 && (
                            <small onClick={() => setFilters(prev => ({ ...prev, studyType: [] }))}>
                                Limpiar
                            </small>
                        )}
                    </div>
                    <div className="filter-tags">
                        {studyTypes.map(type => (
                            <div 
                                key={type} 
                                className={`filter-tag ${filters.studyType.includes(type) ? 'active' : ''}`}
                                onClick={() => handleFilterChange('studyType', type)}
                            >
                                {type}
                                {filters.studyType.includes(type) && <i className="fas fa-times"></i>}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Filtro de modalidad */}
                <div className="filter-group">
                    <div className="filter-title">
                        <span>Modalidad</span>
                        {filters.modality.length > 0 && (
                            <small onClick={() => setFilters(prev => ({ ...prev, modality: [] }))}>
                                Limpiar
                            </small>
                        )}
                    </div>
                    <div className="filter-tags">
                        {['Presencial', 'Online', 'Híbrido'].map(modality => (
                            <div 
                                key={modality} 
                                className={`filter-tag ${filters.modality.includes(modality) ? 'active' : ''}`}
                                onClick={() => handleFilterChange('modality', modality)}
                            >
                                {modality}
                                {filters.modality.includes(modality) && <i className="fas fa-times"></i>}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Filtro de año */}
                <div className="filter-group">
                    <div className="filter-title">
                        <span>Año de grado</span>
                    </div>
                    <div className="year-filter">
                        {['Antes de 2020', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '+ 2028'].map(year => (
                            <label key={year}>
                                <input 
                                    type="checkbox"
                                    checked={filters.years.includes(year)}
                                    onChange={() => handleFilterChange('years', year)}
                                />
                                {year}
                            </label>
                        ))}
                    </div>
                </div>
                
                {/* Botón para aplicar filtros */}
                <button className="filter-button" onClick={clearAllFilters}>
                    Aplicar filtros
                </button>
            </div>
            
            {/* Contenido principal */}
            <div className="main-content">
                <h1 className="page-title">Estudiar moda</h1>
                <p className="page-description">
                    Explora opciones para estudiar moda a nivel local, internacional y ubicación para encontrar la
                    formación en moda que se adapte a ti.
                </p>
                
                {/* Grid de instituciones */}
                <div className="institutions-grid">
                    {filteredInstitutions.length === 0 ? (
                        <div className="no-results">No se encontraron instituciones con los filtros seleccionados</div>
                    ) : (
                        filteredInstitutions.map(institution => (
                            <div 
                                key={institution._id} 
                                className="institution-card"
                                onMouseEnter={() => handleMouseEnter(institution)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => navigateToProfile(institution)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img 
                                    src={institution.logo || 'https://via.placeholder.com/150'} 
                                    alt={institution.name} 
                                    className="institution-logo" 
                                />
                                <div className="institution-details">
                                    <h3 className="institution-name">{institution.name}</h3>
                                    <div className="institution-location">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {institution.location.city}, {institution.location.country}
                                    </div>
                                    <div className="institution-tags">
                                        <div className={`institution-tag ${institution.type}`}>
                                            {institution.type === 'public' ? 'Público' : 'Privado'}
                                        </div>
                                        {institution.programs.length > 0 && (
                                            <div className="institution-tag">
                                                {institution.programs.length} programas
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Panel de hover */}
                                {hoveredInstitution && hoveredInstitution._id === institution._id && (
                                    <div className="hover-panel" ref={hoverPanelRef}>
                                        <div className="panel-header">
                                            <img 
                                                src={institution.logo || 'https://via.placeholder.com/150'} 
                                                alt={institution.name} 
                                                className="panel-logo" 
                                            />
                                            <div className="panel-info">
                                                <h3>{institution.name}</h3>
                                                <p>{institution.location.city}, {institution.location.country}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="panel-courses">
                                            {institution.programs.map((program, index) => (
                                                <div key={program._id || index} className="course-card">
                                                    <div className="course-level">
                                                        {program.educationType}
                                                    </div>
                                                    <h4 className="course-title">{program.programName}</h4>
                                                    <p className="course-description">
                                                        {program.description?.substring(0, 80) || 'Estudia moda y eleva tu carrera profesional con este programa formativo especializado.'}...
                                                    </p>
                                                    <div className="course-links">
                                                        <a href="#" className="course-link" onClick={(e) => {
                                                            e.preventDefault();
                                                            navigate(`/educational-offer/${program._id}`);
                                                        }}>
                                                            Más información
                                                        </a>
                                                        {program.websiteUrl && (
                                                            <a href={program.websiteUrl} target="_blank" rel="noopener noreferrer" className="course-link">
                                                                Web oficial
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Fashion;
