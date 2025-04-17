/* src/components/Offers.jsx */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';
import './css/offers.css';

const Offers = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        country: '',
        city: '',
        studyField: '', // Nombre de empresa
        jobType: 'all',
        locationType: '',
        onlyInternships: false,
    });
    const [uniqueCountries, setUniqueCountries] = useState([]);
    const [uniqueCities, setUniqueCities] = useState([]);

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
                setUniqueCountries([
                    ...new Set(sorted.map(o => o.country).filter(Boolean))
                ]);
                setUniqueCities([
                    ...new Set(sorted.map(o => o.city).filter(Boolean))
                ]);
            } catch (e) {
                console.error(e);
                setError('No se pudieron cargar las ofertas.');
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const handleFilterChange = (field, value) => {
        setFilters(f => ({ ...f, [field]: value }));
    };

    const applyFilters = () => {
        // Aquí podrías volver a llamar o solo usar filtered en render
    };

    const filteredOffers = offers.filter(o => {
        const { search, country, city, studyField, jobType, locationType, onlyInternships } = filters;
        if (onlyInternships && o.jobType !== 'Prácticas') return false;
        if (jobType !== 'all' && o.jobType !== jobType) return false;
        if (locationType && o.locationType !== locationType) return false;
        if (country && o.country !== country) return false;
        if (city && o.city !== city) return false;
        if (studyField && !o.companyName.toLowerCase().includes(studyField.toLowerCase())) return false;
        if (search) {
            const q = search.toLowerCase();
            if (
                !(
                    o.position.toLowerCase().includes(q) ||
                    o.companyName.toLowerCase().includes(q)
                )
            ) return false;
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
        <div className="fashion-container">
            {/* ------------------ FILTROS ------------------ */}
            <div className="filters-section">
                <h3>Filtros</h3>

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

                {/* Nombre de empresa en lugar de Centro de estudios */}
                <div className="filter-input">
                    <input
                        placeholder="Nombre de empresa"
                        value={filters.studyField}
                        onChange={e => handleFilterChange('studyField', e.target.value)}
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

                <button className="apply-filters-btn" onClick={applyFilters}>
                    Aplicar filtros
                </button>
            </div>

            {/* ============= CONTENIDO PRINCIPAL ============= */}
            <main className="main-content">
                <h1 className="page-title">Ofertas de empleo</h1>
                <p className="page-description">
                    Descubre nuevos talentos y oportunidades. Filtra por ubicación, tipo y más.
                </p>

                <div className="institutions-list">
                    {filteredOffers.length === 0 ? (
                        <div className="no-results">
                            No se encontraron ofertas con los filtros seleccionados
                        </div>
                    ) : (
                        filteredOffers.map(o => (
                            <article
                                key={o._id}
                                className="institution-card"
                                onClick={() =>
                                    navigate(`/ControlPanel/JobOfferDetail/${o._id}`)
                                }
                            >
                                <img
                                    src={o.companyLogo || 'https://via.placeholder.com/80'}
                                    alt={o.companyName}
                                    className="institution-logo"
                                />
                                <div className="institution-info">
                                    <h3>{o.position}</h3>
                                    <div className="subtitle">
                                        <FaMapMarkerAlt /> {o.city}, {o.country} ·{' '}
                                        {formatDate(o.publicationDate)}
                                    </div>
                                    <div className="tags">
                                        <span className="tag">{o.jobType}</span>
                                        <span className="tag">{o.companyName}</span>
                                    </div>
                                </div>
                                <span
                                    className={`institution-tag ${o.jobType === 'Prácticas' ? 'public' : 'private'
                                        }`}
                                >
                                    {o.jobType === 'Prácticas' ? 'Prácticas' : 'Contrato'}
                                </span>
                            </article>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Offers;
