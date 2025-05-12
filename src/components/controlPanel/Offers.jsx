/* src/components/Offers.jsx */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { MdTune } from 'react-icons/md';
import Draggable from 'react-draggable';
import './css/offers.css';
import './css/explorer.css';

const Offers = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        country: '',
        city: '',
        companyName: '',
        jobType: 'all',
        locationType: '',
        onlyInternships: false,
    });
    const [uniqueCountries, setUniqueCountries] = useState([]);
    const [uniqueCities, setUniqueCities] = useState([]);

    // Estados y lógica para filtros móviles
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const initialPosRef = useRef({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    
    // Estados para los filtros en desktop
    const [showFilters, setShowFilters] = useState(false);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/offers?status=accepted`);
                const sorted = res.data.offers.sort(
                    (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
                );
                setOffers(sorted);
                setUniqueCountries([...new Set(sorted.map(o => o.country).filter(Boolean))]);
                setUniqueCities([...new Set(sorted.map(o => o.city).filter(Boolean))]);
            } catch (e) {
                console.error(e);
                setError('No se pudieron cargar las ofertas.');
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleOpenFilters = () => {
        setShowFilters(!showFilters);
    };

    const applyFilters = () => {
        // Verificar si hay algún filtro activo
        const isAnyFilterActive = (
            filters.search !== '' ||
            filters.country !== '' ||
            filters.city !== '' ||
            filters.companyName !== '' ||
            filters.jobType !== 'all' ||
            filters.locationType !== '' ||
            filters.onlyInternships === true
        );
        
        setHasActiveFilters(isAnyFilterActive);
        setShowFilters(false); // Cerrar el panel de filtros al aplicar
        setShowMobileFilters(false); // Cerrar el panel móvil también
    };
    
    const clearFilters = () => {
        setFilters({
            search: '',
            country: '',
            city: '',
            companyName: '',
            jobType: 'all',
            locationType: '',
            onlyInternships: false,
        });
        setHasActiveFilters(false);
    };

    const filteredOffers = offers.filter(o => {
        const { search, country, city, companyName, jobType, locationType, onlyInternships } = filters;
        if (onlyInternships && o.jobType !== 'Prácticas') return false;
        if (jobType !== 'all' && o.jobType !== jobType) return false;
        if (locationType && o.locationType !== locationType) return false;
        if (country && o.country !== country) return false;
        if (city && o.city !== city) return false;
        if (companyName && !o.companyName.toLowerCase().includes(companyName.toLowerCase())) return false;
        if (search) {
            const q = search.toLowerCase();
            if (!o.position.toLowerCase().includes(q) && !o.companyName.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const formatDate = dateString =>
        new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    if (loading) return <div className="loading">Cargando ofertas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="offers-page-container">
            {/* ------------------ FILTROS ------------------ */}
            {/* Botón de filtro para desktop */}
            {!isMobile && (
                <Draggable
                    onStart={(e, data) => {
                        initialPosRef.current = { x: data.x, y: data.y };
                        setDragging(false);
                    }}
                    onDrag={(e, data) => {
                        const dx = data.x - initialPosRef.current.x;
                        const dy = data.y - initialPosRef.current.y;
                        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDragging(true);
                    }}
                    onStop={(e, data) => {
                        if (!dragging) handleOpenFilters();
                    }}
                >
                    <button className={`offers-filter-button ${hasActiveFilters ? 'has-filters' : ''}`}>
                        <MdTune />
                    </button>
                </Draggable>
            )}
            
            {/* Panel de filtros para desktop */}
            <div className={`offers-filters-panel ${showFilters ? 'show' : ''}`}>
                <div className="offers-filters-container">
                    <div className="offers-filters-header">
                        <h3>Filtros</h3>
                        <button 
                            className="offers-filters-close" 
                            onClick={() => setShowFilters(false)}
                            title="Cerrar filtros"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="filter-search">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscador"
                            value={filters.search}
                            onChange={e => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <div className="filter-input">
                        <input
                            list="countries"
                            placeholder="País"
                            value={filters.country}
                            onChange={e => handleFilterChange('country', e.target.value)}
                        />
                        <datalist id="countries">
                            {uniqueCountries.map(c => <option key={c} value={c} />)}
                        </datalist>
                    </div>

                    <div className="filter-input">
                        <input
                            list="cities"
                            placeholder="Ciudad"
                            value={filters.city}
                            onChange={e => handleFilterChange('city', e.target.value)}
                        />
                        <datalist id="cities">
                            {uniqueCities.map(c => <option key={c} value={c} />)}
                        </datalist>
                    </div>

                    <div className="filter-input">
                        <input
                            placeholder="Nombre de empresa"
                            value={filters.companyName}
                            onChange={e => handleFilterChange('companyName', e.target.value)}
                        />
                    </div>

                    <div className="filter-select">
                        <select
                            value={filters.jobType}
                            onChange={e => handleFilterChange('jobType', e.target.value)}
                        >
                            <option value="all">Tipo de contrato</option>
                            <option value="Prácticas">Prácticas</option>
                            <option value="Tiempo completo">Tiempo completo</option>
                            <option value="Tiempo parcial">Tiempo parcial</option>
                        </select>
                        <FaChevronDown className="chevron-icon" />
                    </div>

                    <div className="filter-select">
                        <select
                            value={filters.locationType}
                            onChange={e => handleFilterChange('locationType', e.target.value)}
                        >
                            <option value="">Formato de trabajo</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Remoto">Remoto</option>
                            <option value="Híbrido">Híbrido</option>
                        </select>
                        <FaChevronDown className="chevron-icon" />
                    </div>

                    <div className="filter-checkbox">
                        <input
                            type="checkbox"
                            id="practicas"
                            checked={filters.onlyInternships}
                            onChange={e => handleFilterChange('onlyInternships', e.target.checked)}
                        />
                        <label htmlFor="practicas">Prácticas</label>
                    </div>

                    <div className="filter-buttons">
                        <button className="apply-filters-btn" onClick={applyFilters}>
                            Aplicar filtros
                        </button>
                        {hasActiveFilters && (
                            <button className="clear-filters-btn" onClick={clearFilters}>
                                Limpiar filtros
                            </button>
                        )}
                    </div>
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
                        if (!dragging) setShowMobileFilters((prev) => !prev);
                    }}
                >
                    <button className={`offers-filter-button mobile ${hasActiveFilters ? 'has-filters' : ''}`}>
                        <MdTune />
                    </button>
                </Draggable>
            )}
            
            {/* El panel de filtros antiguo ha sido reemplazado por offers-filters-panel */}
            {isMobile && showMobileFilters && (
                <div
                    className="explorer-mobile-filters-modal"
                    onClick={(e) => { if (e.target.className === 'explorer-mobile-filters-modal') setShowMobileFilters(false); }}
                >
                    <div className="explorer-mobile-filters-content">
                        <div className="explorer-mobile-filters-header">
                            <h3>Filtros</h3>
                            <button
                                className="explorer-mobile-filters-close"
                                onClick={() => setShowMobileFilters(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="explorer-filters-container">
                            <div className="explorer-filter-group">
                                <div className="explorer-filter-search">
                                    <input
                                        type="text"
                                        placeholder="Buscador"
                                        value={filters.search}
                                        onChange={e => handleFilterChange('search', e.target.value)}
                                    />
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.country}
                                        onChange={e => handleFilterChange('country', e.target.value)}
                                    >
                                        <option value="" disabled>País</option>
                                        {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.city}
                                        onChange={e => handleFilterChange('city', e.target.value)}
                                    >
                                        <option value="" disabled>Ciudad</option>
                                        {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="explorer-filter-search">
                                    <input
                                        type="text"
                                        placeholder="Nombre de empresa"
                                        value={filters.companyName}
                                        onChange={e => handleFilterChange('companyName', e.target.value)}
                                    />
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.jobType}
                                        onChange={e => handleFilterChange('jobType', e.target.value)}
                                    >
                                        <option value="all">Tipo de contrato</option>
                                        <option value="Prácticas">Prácticas</option>
                                        <option value="Tiempo completo">Tiempo completo</option>
                                        <option value="Tiempo parcial">Tiempo parcial</option>
                                    </select>
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.locationType}
                                        onChange={e => handleFilterChange('locationType', e.target.value)}
                                    >
                                        <option value="">Formato de trabajo</option>
                                        <option value="Presencial">Presencial</option>
                                        <option value="Remoto">Remoto</option>
                                        <option value="Híbrido">Híbrido</option>
                                    </select>
                                </div>
                                <div className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        id="practicas"
                                        checked={filters.onlyInternships}
                                        onChange={e => handleFilterChange('onlyInternships', e.target.checked)}
                                    />
                                    <label htmlFor="practicas">Prácticas</label>
                                </div>
                            </div>
                            <button
                                className="explorer-apply-filters-btn"
                                onClick={() => { applyFilters(); setShowMobileFilters(false); }}
                            >
                                Aplicar filtros
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------ CONTENIDO PRINCIPAL ------------------ */}
            <div className="offers-main-content">
                <h1 className="page-title">Ofertas de empleo</h1>
                <p className="page-description">
                    Descubre los nuevos talentos de la industria de la moda. Usa los filtros para encontrar la oferta que más te interese.
                </p>

                <div className="offers-grid">
                    {filteredOffers.length === 0 ? (
                        <div className="no-offers-message">
                            No se encontraron ofertas con los filtros seleccionados
                        </div>
                    ) : (
                        filteredOffers.map(o => (
                            <article
                                key={o._id}
                                className="offer-card"
                                onClick={() => navigate(`/ControlPanel/JobOfferDetail/${o._id}`)}
                            >
                                <div className="offer-card-logo">
                                    <img
                                        src={o.companyLogo || '/multimedia/company-default.png'}
                                        alt={o.companyName}
                                    />
                                </div>
                                <div className="offer-card-content">
                                    <div className="offer-card-user">{o.publisherName || o.companyName}</div>
                                    <h2 className="offer-card-title">{o.position}</h2>
                                    <div className="offer-card-meta">
                                        {o.city}, {o.country} <span>│</span> {o.jobType} <span>│</span> {o.locationType}
                                    </div>
                                    <div className="offer-card-date">{formatDate(o.publicationDate)}</div>
                                </div>
                                <div className={`offer-card-badge ${o.jobType === 'Prácticas' ? 'badge-internship' : o.jobType === 'Tiempo completo' ? 'badge-fulltime' : o.jobType === 'Tiempo parcial' ? 'badge-parttime' : 'badge-other'}`}>
                                    {o.jobType}
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Offers;