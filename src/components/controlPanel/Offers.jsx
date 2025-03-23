import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/offers.css';

const Offers = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedStudyField, setSelectedStudyField] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');
    const [selectedGradYear, setSelectedGradYear] = useState('');

    // Cargar todas las ofertas aceptadas
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/offers?status=accepted`);
                setOffers(response.data.offers || []);
            } catch (error) {
                console.error('Error cargando ofertas:', error);
                setError('No se pudieron cargar las ofertas');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const handleOfferClick = (offer) => {
        navigate(`/ControlPanel/JobOfferDetail/${offer._id}`);
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    // Aplicar filtros a las ofertas
    const filteredOffers = offers.filter(offer => {
        // Filtro por botones principales
        if (activeFilter === 'internship' && offer.jobType !== 'Prácticas') return false;
        
        // Filtro por ciudad
        if (selectedCity && offer.city !== selectedCity) return false;
        
        // Filtro por campo de estudio (esto dependerá de cómo estén estructurados los datos)
        if (selectedStudyField && !offer.tags?.includes(selectedStudyField)) return false;
        
        // Filtro por tipo de trabajo
        if (selectedJobType && offer.jobType !== selectedJobType) return false;
        
        // Filtro por búsqueda en título o descripción
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                offer.position.toLowerCase().includes(query) ||
                offer.description.toLowerCase().includes(query) ||
                offer.companyName.toLowerCase().includes(query)
            );
        }
        
        return true;
    });

    if (loading) {
        return (
            <div className="offers-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Cargando ofertas...</span>
            </div>
        );
    }

    if (error) {
        return <div className="offers-error">{error}</div>;
    }

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Lista de ciudades únicas para el filtro
    const cities = [...new Set(offers.map(offer => offer.city))];
    
    // Lista de tipos de trabajo únicos para el filtro
    const jobTypes = [...new Set(offers.map(offer => offer.jobType))];

    return (
        <div className="offers-page-container">
            <div className="offers-header">
                <h1>Ofertas de empleo</h1>
                <p className="offers-description">
                    Descubre los nuevos talentos de la industria de la moda. Usa los filtros para descubrir perfiles según
                    tus estudios, ciudad, especialización, disponibilidad para prácticas, colaboraciones y más.
                </p>
                <div className="offers-filters-tabs">
                    <button 
                        className={`offer-filter-tab ${activeFilter === 'all' ? 'offer-active' : ''}`}
                        onClick={() => handleFilterChange('all')}
                    >
                        Todos
                    </button>
                    <button 
                        className={`offer-filter-tab ${activeFilter === 'internship' ? 'offer-active' : ''}`}
                        onClick={() => handleFilterChange('internship')}
                    >
                        Prácticas
                    </button>
                </div>
            </div>

            <div className="offers-main-content">
                <div className="offers-sidebar">
                    <h2>Filtros</h2>
                    <div className="offer-filter-section">
                        <div className="offer-search-filter">
                            <label htmlFor="search-input">
                                <i className="fas fa-search"></i>
                            </label>
                            <input
                                id="search-input"
                                type="text"
                                placeholder="Buscar"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Ciudad</h3>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="offer-filter-select"
                        >
                            <option value="">Todas las ciudades</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Centro de estudios</h3>
                        <select
                            value={selectedStudyField}
                            onChange={(e) => setSelectedStudyField(e.target.value)}
                            className="offer-filter-select"
                        >
                            <option value="">Todos los centros</option>
                            <option value="Diseño">Diseño</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Comunicación">Comunicación</option>
                            <option value="Negocios">Negocios</option>
                        </select>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Tipo de trabajo</h3>
                        <select
                            value={selectedJobType}
                            onChange={(e) => setSelectedJobType(e.target.value)}
                            className="offer-filter-select"
                        >
                            <option value="">Todos los tipos</option>
                            {jobTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Año de graduación</h3>
                        <div className="offer-year-filter-options">
                            <div className="offer-year-checkbox">
                                <input type="checkbox" id="year-all" />
                                <label htmlFor="year-all">Antes de 2020</label>
                            </div>
                            {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => (
                                <div key={year} className="offer-year-checkbox">
                                    <input 
                                        type="checkbox" 
                                        id={`year-${year}`} 
                                        checked={selectedGradYear === year.toString()}
                                        onChange={() => setSelectedGradYear(selectedGradYear === year.toString() ? '' : year.toString())}
                                    />
                                    <label htmlFor={`year-${year}`}>{year}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Perfil profesional</h3>
                        <div className="offer-tag-filters">
                            <span className="offer-filter-tag">Diseño</span>
                            <span className="offer-filter-tag">Patronaje</span>
                            <span className="offer-filter-tag">Marketing</span>
                            <span className="offer-filter-tag">Comunicación</span>
                        </div>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Software</h3>
                        <div className="offer-tag-filters">
                            <span className="offer-filter-tag">Adobe</span>
                            <span className="offer-filter-tag">Illustrator</span>
                            <span className="offer-filter-tag">Photoshop</span>
                        </div>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Organización</h3>
                        <div className="offer-tag-filters">
                            <span className="offer-filter-tag">Desigual</span>
                            <span className="offer-filter-tag">Inditex</span>
                            <span className="offer-filter-tag">Mango</span>
                        </div>
                    </div>

                    <div className="offer-filter-section">
                        <h3>Prácticas</h3>
                        <div className="offer-tag-filters">
                            <span className="offer-filter-tag">Disponible</span>
                        </div>
                    </div>

                    <button className="offer-apply-filters-button">
                        Aplicar filtros
                    </button>
                </div>

                <div className="offers-grid">
                    {filteredOffers.length === 0 ? (
                        <div className="no-offers-message">
                            <i className="fas fa-search"></i>
                            <p>No se encontraron ofertas con los filtros seleccionados</p>
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
                                            src={offer.companyLogo || "/multimedia/company-default.png"} 
                                            alt={offer.companyName}
                                            className="offer-company-logo"
                                        />
                                    </div>
                                    <div className="offer-card-title">
                                        <h3>{offer.position}</h3>
                                        <p className="offer-company-name">{offer.companyName}</p>
                                    </div>
                                </div>
                                
                                <div className="offer-card-tags">
                                    <div className="offer-tag offer-job-type">
                                        <span>Tipo de contrato</span>
                                        <p>{offer.jobType}</p>
                                    </div>
                                    <div className="offer-tag offer-location-type">
                                        <span>Ubicación</span>
                                        <p>{offer.city}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Offers;
