import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/offers.css';

const Fashion = () => {
    const navigate = useNavigate();
    const [educationalOffers, setEducationalOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        location: '',
        studyType: '',
        modality: '',
        knowledgeArea: ''
    });
    const [filteredOffers, setFilteredOffers] = useState([]);
    
    // Obtener todas las ofertas educativas
    useEffect(() => {
        const fetchEducationalOffers = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/offers/educational`);
                // Ordenar las ofertas por fecha de publicación (más recientes primero)
                const sortedOffers = response.data.offers.sort((a, b) => 
                    new Date(b.publicationDate) - new Date(a.publicationDate)
                );
                setEducationalOffers(sortedOffers);
                setFilteredOffers(sortedOffers);
            } catch (error) {
                console.error('Error al cargar las ofertas educativas:', error);
                setError('Ocurrió un error al cargar las ofertas educativas. Por favor, inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchEducationalOffers();
    }, []);

    // Actualizar filteredOffers cuando cambien los filtros o las ofertas
    useEffect(() => {
        const applyFilters = () => {
            let results = [...educationalOffers];
            
            // Filtrar por ubicación
            if (filters.location) {
                results = results.filter(offer => 
                    offer.location && 
                    offer.location.city && 
                    offer.location.city.toLowerCase().includes(filters.location.toLowerCase())
                );
            }
            
            // Filtrar por tipo de estudio
            if (filters.studyType) {
                results = results.filter(offer => 
                    offer.studyType && 
                    offer.studyType.toLowerCase().includes(filters.studyType.toLowerCase())
                );
            }
            
            // Filtrar por modalidad
            if (filters.modality) {
                results = results.filter(offer => 
                    offer.modality && 
                    offer.modality.toLowerCase().includes(filters.modality.toLowerCase())
                );
            }
            
            // Filtrar por área de conocimiento
            if (filters.knowledgeArea) {
                results = results.filter(offer => 
                    offer.knowledgeArea && 
                    offer.knowledgeArea.toLowerCase().includes(filters.knowledgeArea.toLowerCase())
                );
            }
            
            setFilteredOffers(results);
        };
        
        applyFilters();
    }, [filters, educationalOffers]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            location: '',
            studyType: '',
            modality: '',
            knowledgeArea: ''
        });
    };

    const handleOfferClick = (offer) => {
        navigate(`/ControlPanel/EducationalOfferDetail/${offer._id}`);
    };

    // Formatea la fecha en un formato legible
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Función para formatear duración
    const formatDuration = (duration) => {
        if (!duration || !duration.value) return 'No especificada';
        return `${duration.value} ${duration.unit}`;
    };

    if (loading) {
        return (
            <div className="offers-page-container">
                <div className="offers-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Cargando ofertas educativas...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="offers-page-container">
                <div className="offers-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="offers-page-container">
            <div className="offers-header">
                <h1>Estudiar moda</h1>
                <p className="offers-description">
                    Explora opciones para estudiar moda y filtra por nivel, modalidad y ubicación para encontrar la formación que mejor se adapte a ti.
                </p>
            </div>

            <div className="offers-main-content">
                <div className="offers-sidebar">
                    <h2>Filtros</h2>
                    <div className="offer-filter-section">
                        <h3>Ubicación</h3>
                        <div className="offer-search-filter">
                            <label htmlFor="location-input">
                                <i className="fas fa-search"></i>
                            </label>
                            <input
                                id="location-input"
                                type="text"
                                className="offer-filter-input"
                                placeholder="Ej: Madrid, Barcelona..."
                                value={filters.location}
                                name="location"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Tipo de estudio</h3>
                        <div className="offer-search-filter">
                            <label htmlFor="studyType-input">
                                <i className="fas fa-search"></i>
                            </label>
                            <input
                                id="studyType-input"
                                type="text"
                                className="offer-filter-input"
                                placeholder="Ej: Máster, Grado..."
                                value={filters.studyType}
                                name="studyType"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Modalidad</h3>
                        <div className="offer-search-filter">
                            <label htmlFor="modality-input">
                                <i className="fas fa-search"></i>
                            </label>
                            <input
                                id="modality-input"
                                type="text"
                                className="offer-filter-input"
                                placeholder="Ej: Presencial, Online..."
                                value={filters.modality}
                                name="modality"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Área</h3>
                        <div className="offer-search-filter">
                            <label htmlFor="knowledgeArea-input">
                                <i className="fas fa-search"></i>
                            </label>
                            <input
                                id="knowledgeArea-input"
                                type="text"
                                className="offer-filter-input"
                                placeholder="Ej: Diseño, Marketing..."
                                value={filters.knowledgeArea}
                                name="knowledgeArea"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <button onClick={handleResetFilters} className="offer-apply-filters-button">
                        <i className="fas fa-undo"></i> Limpiar filtros
                    </button>
                </div>

                <div className="offers-grid">
                    <div className="offers-results-info">
                        <span>Mostrando {filteredOffers.length} ofertas educativas</span>
                    </div>

                    {filteredOffers.length === 0 ? (
                        <div className="no-offers-message">
                            <i className="fas fa-search"></i>
                            <p>No se encontraron ofertas educativas con los filtros seleccionados</p>
                        </div>
                    ) : (
                        filteredOffers.map(offer => (
                            <div 
                                key={offer._id}
                                className="offer-card"
                                onClick={() => handleOfferClick(offer)}
                            >
                                <div className="offer-card-header">
                                    <div className="offer-company-logo-container">
                                        <img 
                                            src={offer.banner || "/multimedia/education-default.png"} 
                                            alt={offer.programName}
                                            className="offer-company-logo"
                                        />
                                    </div>
                                    <div className="offer-card-title">
                                        <h3>{offer.programName}</h3>
                                        <p className="offer-company-name">{offer.studyType}</p>
                                    </div>
                                </div>
                                
                                <div className="offer-card-tags">
                                    <div className="offer-tag">
                                        <span>Duración</span>
                                        <p>{formatDuration(offer.duration)}</p>
                                    </div>
                                    <div className="offer-tag">
                                        <span>Ubicación</span>
                                        <p>{offer.location?.city || 'No especificada'}</p>
                                    </div>
                                    <div className="offer-tag">
                                        <span>Modalidad</span>
                                        <p>{offer.modality || 'No especificada'}</p>
                                    </div>
                                </div>
                                
                                <div className="offer-card-footer">
                                    <div className="offer-date">
                                        <i className="far fa-calendar-alt"></i>
                                        <span>Publicado: {formatDate(offer.publicationDate)}</span>
                                    </div>
                                    <button className="offer-action-button">
                                        Ver detalles
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Fashion;
