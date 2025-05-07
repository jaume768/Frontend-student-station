import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';
import { MdTune } from 'react-icons/md';
import Draggable from 'react-draggable';
import './css/fashion.css';
import './css/explorer.css';

const Fashion = () => {
    const navigate = useNavigate();
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        country: '',
        city: '',
        centerType: 'all',
        educationLevel: '',
        modality: '',
        category: '',
        visibility: 'all',       // <-- añadido
    });
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [hoveredInstitution, setHoveredInstitution] = useState(null);

    // Estados y lógica para mobile filters
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const initialPosRef = useRef({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const educationLevelsList = [
        'Grado o licenciatura',
        'Máster o posgrado',
        'Doctorado o investigación',
        'FP',
        'Cursos talleres',
        'Certificaciones',
    ];
    const modalityList = ['Presencial', 'Online', 'Híbrido'];
    const categoriesList = ['Moda', 'Diseño gráfico', 'Fotografía'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(
                    `${backendUrl}/api/offers/educational/institutions`
                );
                const data = res.data.institutions || [];
                setInstitutions(data);

                setCountries([
                    ...new Set(
                        data.map((i) => i.location?.country).filter(Boolean)
                    ),
                ]);
                setCities([
                    ...new Set(data.map((i) => i.location?.city).filter(Boolean)),
                ]);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar las instituciones.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (field, value) => {
        setFilters((f) => ({ ...f, [field]: value }));
    };

    const applyFilters = () => {
        // Si quisieras volver a llamar al backend, aquí iría.
    };

    const clearAllFilters = () => {
        setFilters({
            search: '',
            country: '',
            city: '',
            centerType: 'all',
            educationLevel: '',
            modality: '',
            category: '',
            visibility: 'all',
        });
    };

    const filteredInstitutions = institutions.filter((inst) => {
        const {
            search,
            country,
            city,
            centerType,
            educationLevel,
            modality,
            category,
            visibility,
        } = filters;
        if (
            search &&
            !`${inst.name} ${inst.location?.city}`
                .toLowerCase()
                .includes(search.toLowerCase())
        )
            return false;
        if (country && inst.location?.country !== country) return false;
        if (city && inst.location?.city !== city) return false;
        if (centerType !== 'all' && inst.type !== centerType) return false;
        if (
            educationLevel &&
            !inst.programs.some((p) => p.educationType === educationLevel)
        )
            return false;
        if (modality && !inst.programs.some((p) => p.modality === modality))
            return false;
        if (category && !inst.programs.some((p) => p.category === category))
            return false;
        if (visibility !== 'all' && inst.type !== visibility) return false;
        return true;
    });

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="fashion-container">
            {/* ------------------ FILTROS ------------------ */}
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
                        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                            setDragging(true);
                        }
                    }}
                    onStop={(e, data) => {
                        if (!dragging) setShowMobileFilters((prev) => !prev);
                    }}
                >
                    <button className="explorer-filter-button">
                        <MdTune />
                    </button>
                </Draggable>
            )}
            {!isMobile && (
                <div className="filters-section">
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
                            list="countries"
                            placeholder="País"
                            value={filters.country}
                            onChange={(e) => handleFilterChange('country', e.target.value)}
                        />
                        <datalist id="countries">
                            {countries.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </div>

                    {/* Ciudad */}
                    <div className="filter-input">
                        <input
                            list="cities"
                            placeholder="Ciudad"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                        />
                        <datalist id="cities">
                            {cities.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </div>

                    {/* Tipo de centro */}
                    <div className="filter-select">
                        <select
                            value={filters.centerType}
                            onChange={(e) =>
                                handleFilterChange('centerType', e.target.value)
                            }
                        >
                            <option value="all">Tipo de centro</option>
                            <option value="all">Todos</option>
                            <option value="public">Público</option>
                            <option value="private">Privado</option>
                        </select>
                        <FaChevronDown className="chevron-icon" />
                    </div>

                    {/* Nivel de estudios */}
                    <div className="filter-select">
                        <select
                            value={filters.educationLevel}
                            onChange={(e) =>
                                handleFilterChange('educationLevel', e.target.value)
                            }
                        >
                            <option value="">Nivel de estudios</option>
                            {educationLevelsList.map((l) => (
                                <option key={l} value={l}>
                                    {l}
                                </option>
                            ))}
                        </select>
                        <FaChevronDown className="chevron-icon" />
                    </div>

                    {/* Tipo de formación */}
                    <div className="filter-select">
                        <select
                            value={filters.modality}
                            onChange={(e) => handleFilterChange('modality', e.target.value)}
                        >
                            <option value="">Tipo de formación</option>
                            {modalityList.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                        <FaChevronDown className="chevron-icon" />
                    </div>

                    {/* Categoría */}
                    <div className="filter-select">
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <option value="">Categoría</option>
                            {categoriesList.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        <FaChevronDown className="chevron-icon" />
                    </div>

                    <button className="apply-filters-btn" onClick={applyFilters}>
                        Aplicar filtros
                    </button>
                </div>
            )}
            {isMobile && showMobileFilters && (
                <div
                    className="explorer-mobile-filters-modal"
                    onClick={(e) => {
                        if (e.target.className === 'explorer-mobile-filters-modal') {
                            setShowMobileFilters(false);
                        }
                    }}
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
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                    />
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.country}
                                        onChange={(e) => handleFilterChange('country', e.target.value)}
                                    >
                                        <option value="" disabled>País</option>
                                        {countries.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.city}
                                        onChange={(e) => handleFilterChange('city', e.target.value)}
                                    >
                                        <option value="" disabled>Ciudad</option>
                                        {cities.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.centerType}
                                        onChange={(e) => handleFilterChange('centerType', e.target.value)}
                                    >
                                        <option value="all">Tipo de centro</option>
                                        <option value="public">Público</option>
                                        <option value="private">Privado</option>
                                    </select>
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.educationLevel}
                                        onChange={(e) => handleFilterChange('educationLevel', e.target.value)}
                                    >
                                        <option value="">Nivel de estudios</option>
                                        {educationLevelsList.map((l) => (
                                            <option key={l} value={l}>
                                                {l}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.modality}
                                        onChange={(e) => handleFilterChange('modality', e.target.value)}
                                    >
                                        <option value="">Tipo de formación</option>
                                        {modalityList.map((m) => (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="explorer-filter-select">
                                    <select
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                    >
                                        <option value="">Categoría</option>
                                        {categoriesList.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                className="explorer-apply-filters-btn"
                                onClick={() => {
                                    applyFilters();
                                    setShowMobileFilters(false);
                                }}
                            >
                                Aplicar filtros
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============= CONTENIDO PRINCIPAL ============= */}
            <main className="main-content">
                <h1 className="page-title">Estudiar moda</h1>
                <p className="page-description">
                    Explora opciones para estudiar moda y filtra por nivel, modalidad y
                    ubicación para encontrar la formación que mejor se adapte a ti.
                </p>

                {/* Toggle de visibilidad */}
                <div className="view-toggle-group">
                    <button
                        className={`toggle ${filters.visibility === 'all' ? 'active' : ''
                            }`}
                        onClick={() => handleFilterChange('visibility', 'all')}
                    >
                        Todo
                    </button>
                    <button
                        className={`toggle ${filters.visibility === 'public' ? 'active' : ''
                            }`}
                        onClick={() => handleFilterChange('visibility', 'public')}
                    >
                        Pública
                    </button>
                    <button
                        className={`toggle ${filters.visibility === 'private' ? 'active' : ''
                            }`}
                        onClick={() => handleFilterChange('visibility', 'private')}
                    >
                        Privada
                    </button>
                </div>

                {/* Lista de instituciones */}
                <div className="institutions-list">
                    {filteredInstitutions.length === 0 ? (
                        <div className="no-results">
                            No se encontraron instituciones con los filtros seleccionados
                        </div>
                    ) : (
                        filteredInstitutions.map((inst) => {
                            // preparar tags de categoría
                            const cats = [
                                ...new Set(inst.programs.map((p) => p.category).filter(Boolean)),
                            ];
                            const visibleCats = cats.slice(0, 2);
                            const extra = cats.length - visibleCats.length;

                            return (
                                <article
                                    key={inst._id}
                                    className="institution-card"
                                    onMouseEnter={() => setHoveredInstitution(inst._id)}
                                    onMouseLeave={() => setHoveredInstitution(null)}
                                    onClick={() =>
                                        inst.username &&
                                        navigate(`/ControlPanel/profile/${inst.username}`)
                                    }
                                >
                                    <img
                                        src={inst.logo || 'https://via.placeholder.com/80'}
                                        alt={inst.name}
                                        className="institution-logo"
                                    />
                                    <div className="institution-info">
                                        <h3>{inst.name}</h3>
                                        <div className="subtitle">
                                            {inst.location.city}, {inst.location.country} |
                                            {inst.type === 'public' ? 'Presencial' : 'Híbrido'}
                                        </div>
                                        <div className="tags">
                                            {visibleCats.map((c) => (
                                                <span key={c} className="tag">
                                                    {c}
                                                </span>
                                            ))}
                                            {extra > 0 && (
                                                <span className="tag more">+ {extra} más</span>
                                            )}
                                        </div>
                                    </div>
                                    <span
                                        className={`institution-tag ${inst.type === 'public' ? 'public' : 'private'
                                            }`}
                                    >
                                        {inst.type === 'public' ? 'Pública' : 'Privada'}
                                    </span>
                                </article>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};

export default Fashion;