import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { FaBookmark, FaRegBookmark, FaTrash } from 'react-icons/fa';
import { MdTune, MdClose } from 'react-icons/md';
import Draggable from 'react-draggable';
import './css/explorer.css';

const Explorer = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('explorer');
    const [tabDisabled, setTabDisabled] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Para evitar recarga inicial al montar
    const initialExplorerRef = useRef(true);

    // Limpieza al montar
    useEffect(() => {
        sessionStorage.removeItem('explorerImages');
        sessionStorage.removeItem('explorerPage');
        sessionStorage.removeItem('viewedPosts');
    }, []);

    // Detectar móvil
    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Recarga al volver de otra pestaña
    useEffect(() => {
        if (activeTab === 'explorer') {
            if (initialExplorerRef.current) {
                initialExplorerRef.current = false;
            } else {
                window.location.reload();
            }
        }
    }, [activeTab]);

    // Estado de imágenes, guardados, feedback, paginación...
    const [postImages, setPostImages] = useState([]);
    const [savedPosts, setSavedPosts] = useState(new Map());
    const [saveFeedback, setSaveFeedback] = useState({ show: false, postId: null, imageUrl: null, text: '' });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    // Funciones de favoritos (carga, toggle)...
    useEffect(() => {
        const fetchSavedPosts = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/users/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const map = new Map();
                (response.data.favorites || []).forEach(fav => {
                    const key = `${fav.postId}-${fav.mainImage || fav.savedImage}`;
                    map.set(key, true);
                });
                setSavedPosts(map);
            } catch (err) {
                console.error('Error cargando posts guardados:', err);
            }
        };
        fetchSavedPosts();
    }, []);

    const getViewedPosts = () => JSON.parse(sessionStorage.getItem('viewedPosts') || '[]');
    const addViewedPost = postId => {
        const viewed = getViewedPosts();
        if (!viewed.includes(postId)) {
            if (viewed.length >= 1000) viewed.shift();
            viewed.push(postId);
            sessionStorage.setItem('viewedPosts', JSON.stringify(viewed));
        }
    };

    // Reset cuando cambias de tab
    useEffect(() => {
        sessionStorage.removeItem('viewedPosts');
        setPage(1);
        setPostImages([]);
        setHasMore(true);
    }, [activeTab]);

    // Fetch imágenes + infinite scroll...
    useEffect(() => {
        let cancelled = false;
        const fetchImages = async () => {
            if (!hasMore) return;
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const limit = 14;
            const viewed = getViewedPosts().join(',');
            let url = '';

            if (activeTab === 'explorer') {
                url = `${backendUrl}/api/posts/explorer?page=${page}&limit=${limit}&exclude=${viewed}`;
            } else if (activeTab === 'staffPicks') {
                url = `${backendUrl}/api/posts/staff-picks?page=${page}&limit=${limit}&exclude=`;
            } else {
                url = `${backendUrl}/api/posts/following?page=${page}&limit=${limit}&exclude=${viewed}`;
            }

            try {
                const res = await axios.get(url, { headers: { 'Cache-Control': 'no-cache' } });
                if (cancelled) return;
                if (activeTab !== 'staffPicks') {
                    res.data.images.forEach(img => addViewedPost(img.postId));
                }
                const newImgs = res.data.images.sort(() => 0.5 - Math.random());
                setPostImages(prev => page === 1 ? newImgs : [...prev, ...newImgs]);
                setHasMore(activeTab === 'staffPicks' ? false : res.data.hasMore);
            } catch (err) {
                console.error('Error cargando imágenes:', err);
                if (err.response?.status === 401) setHasMore(false);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
        return () => { cancelled = true; };
    }, [page, activeTab]);

    useEffect(() => {
        if (activeTab === 'staffPicks' || loading || !hasMore || postImages.length === 0) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(
            ([entry], obs) => {
                if (entry.isIntersecting && hasMore && !loading) {
                    obs.unobserve(entry.target);
                    setPage(p => p + 1);
                }
            },
            { rootMargin: '0px 0px 200px 0px', threshold: 0.1 }
        );
        if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
        return () => observerRef.current?.disconnect();
    }, [loading, hasMore, activeTab, postImages]);

    const handlePostClick = (postId, imageUrl) => {
        navigate(`/post/${postId}`, { state: { clickedImageUrl: imageUrl } });
    };

    const handleSavePost = async (e, postId, imageUrl) => {
        e.stopPropagation();
        const token = localStorage.getItem('authToken');
        if (!token) return navigate('/', { state: { showRegister: true } });
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const key = `${postId}-${imageUrl}`;
            const isSaved = savedPosts.has(key);
            if (isSaved) {
                await axios.delete(`${backendUrl}/api/users/favorites/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { imageUrl }
                });
                setSavedPosts(m => { m.delete(key); return new Map(m); });
                setSaveFeedback({ show: true, postId, imageUrl, text: 'Eliminado de guardados' });
            } else {
                await axios.post(`${backendUrl}/api/users/favorites/${postId}`, { imageUrl }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSavedPosts(m => { m.set(key, true); return new Map(m); });
                setSaveFeedback({ show: true, postId, imageUrl, text: '¡Guardado!' });
            }
            setTimeout(() => setSaveFeedback({ show: false, postId: null, imageUrl: null, text: '' }), 2000);
        } catch (err) {
            console.error('Error guardando:', err);
        }
    };

    // === Draggable sólo para arrastrar ===
    const initialPosRef = useRef({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    const handleOpenFilters = () => {
        if (isMobile) setShowMobileFilters(true);
        else setShowFilters(true);
    };

    const applyFilters = () => {
        // Aplicar filtros (aquí iría la lógica para filtrar)
        setHasActiveFilters(true);
    };

    const breakpointColumns = { default: 5, 1400: 5, 1200: 4, 992: 3, 768: 2, 480: 2 };

    return (
        <div className="explorer-container">
            {/* --- Header y Tabs --- */}
            <div className="explorer-header">
                <h1>Explorador</h1>
                <p className="explorer-description">
                    Explora las imágenes subidas por creativos. Selecciona <span className="highlight">Staff Picks</span> o <span className="highlight">Fotos aleatorias</span>. Refina con <span className="highlight">filtros</span>.
                </p>
                <div className="explorer-tabs-container">
                    {
                        !showFilters && !showMobileFilters && (
                            <Draggable
                                onStart={(e, data) => {
                                    // guardamos la posición inicial
                                    initialPosRef.current = { x: data.x, y: data.y };
                                }}
                                onStop={(e, data) => {
                                    // calculamos cuánto te has movido
                                    const dx = data.x - initialPosRef.current.x;
                                    const dy = data.y - initialPosRef.current.y;

                                    // si no te has movido más de 3px en ninguna dirección, lo consideramos un click
                                    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
                                        handleOpenFilters();
                                    }
                                }}
                            >
                                <button
                                    className={`explorer-filter-button ${hasActiveFilters ? 'has-filters' : ''}`}
                                    disabled={tabDisabled}
                                    title="Abrir filtros"
                                    aria-label="Abrir filtros"
                                >
                                    <MdTune />
                                </button>
                            </Draggable>
                        )
                    }

                    <div className="explorer-tabs">
                        <button
                            className={`user-extern-tab ${activeTab === 'explorer' ? 'active' : ''}`}
                            disabled={tabDisabled}
                            onClick={() => {
                                if (!tabDisabled) {
                                    setTabDisabled(true);
                                    setActiveTab('explorer');
                                    setTimeout(() => setTabDisabled(false), 500);
                                }
                            }}
                        >
                            Fotos aleatorias
                        </button>
                        <button
                            className={`user-extern-tab ${activeTab === 'staffPicks' ? 'active' : ''}`}
                            disabled={tabDisabled}
                            onClick={() => {
                                if (!tabDisabled) {
                                    setTabDisabled(true);
                                    setActiveTab('staffPicks');
                                    setTimeout(() => setTabDisabled(false), 500);
                                }
                            }}
                        >
                            Staff Picks
                        </button>
                    </div>
                </div>
            </div>

            <div className={`explorer-filters-panel ${showFilters ? 'show' : ''}`}>
                <div className="explorer-filters-container">
                    <div className="explorer-filters-header">
                        <h3>Filtros</h3>
                        <button 
                            className="explorer-filters-header-close" 
                            onClick={() => setShowFilters(false)}
                            title="Cerrar filtros"
                        >
                            <MdClose />
                        </button>
                    </div>
                    <div className="explorer-filters-content">
                        <div className="explorer-filter-group">
                            <div className="explorer-filter-search">
                                <input type="text" placeholder="Buscar" />
                            </div>
                            <div className="explorer-filter-select">
                                <select defaultValue="">
                                    <option value="" disabled>País</option>
                                    <option value="espana">España</option>
                                    <option value="francia">Francia</option>
                                    <option value="alemania">Alemania</option>
                                </select>
                            </div>
                            <div className="explorer-filter-select">
                                <select defaultValue="">
                                    <option value="" disabled>Ciudad</option>
                                    <option value="madrid">Madrid</option>
                                    <option value="barcelona">Barcelona</option>
                                    <option value="valencia">Valencia</option>
                                </select>
                            </div>
                            <div className="explorer-filter-select">
                                <select defaultValue="">
                                    <option value="" disabled>Centro de estudios</option>
                                    <option value="ied">IED</option>
                                    <option value="esdemga">ESDEMGA</option>
                                    <option value="elisava">Elisava</option>
                                </select>
                            </div>
                        </div>
                        <button className="explorer-apply-filters-btn" onClick={applyFilters}>Aplicar filtros</button>
                        <button
                            className="explorer-apply-filters-btn explorer-clear-filters-btn"
                            onClick={() => {
                                document.querySelectorAll('.explorer-filter-select select').forEach(select => {
                                    select.value = "";
                                });
                                document.querySelector('.explorer-filter-search input').value = '';
                                setHasActiveFilters(false);
                            }}
                        >
                            <FaTrash style={{ marginRight: '8px' }} /> Borrar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Modal de filtros (móvil) --- */}
            {showMobileFilters && (
                <div
                    className="explorer-mobile-filters-modal"
                    onClick={e => {
                        if (e.target.className === 'explorer-mobile-filters-modal') {
                            setShowMobileFilters(false);
                        }
                    }}
                >
                    <div className="explorer-mobile-filters-content">
                        {/* Cabecera con título y botón cerrar */}
                        <div className="explorer-mobile-filters-header">
                            <h3>Filtros</h3>
                            <button
                                className="explorer-mobile-filters-close"
                                onClick={() => setShowMobileFilters(false)}
                            >
                                <MdClose />
                            </button>
                        </div>

                        {/* Cuerpo de filtros */}
                        <div className="explorer-filter-group">
                            <div className="explorer-filter-search">
                                <input type="text" placeholder="Buscar" />
                            </div>
                            <div className="explorer-filter-select">
                                <select defaultValue="">
                                    <option value="" disabled>País</option>
                                    <option value="espana">España</option>
                                    <option value="francia">Francia</option>
                                    <option value="alemania">Alemania</option>
                                </select>
                            </div>
                            <div className="explorer-filter-select">
                                <select defaultValue="">
                                    <option value="" disabled>Ciudad</option>
                                    <option value="madrid">Madrid</option>
                                    <option value="barcelona">Barcelona</option>
                                    <option value="valencia">Valencia</option>
                                </select>
                            </div>
                            <div className="explorer-filter-select">
                                <select defaultValue="">
                                    <option value="" disabled>Centro de estudios</option>
                                    <option value="ied">IED</option>
                                    <option value="esdemga">ESDEMGA</option>
                                    <option value="elisava">Elisava</option>
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
            )}

            {/* --- Grid de imágenes --- */}
            <div className={`explorer-content ${showFilters ? 'with-filters' : ''}`}>
                <Masonry
                    breakpointCols={breakpointColumns}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {postImages.map((item, idx) => (
                        <div
                            key={`${item.postId}-${idx}`}
                            className="masonry-item"
                            onClick={() => handlePostClick(item.postId, item.imageUrl)}
                        >
                            <img src={item.imageUrl} alt={item.postTitle || 'Imagen'} loading="lazy" />
                            <button
                                className={`save-button-explorer ${savedPosts.has(`${item.postId}-${item.imageUrl}`) ? 'saved' : ''
                                    }`}
                                onClick={e => handleSavePost(e, item.postId, item.imageUrl)}
                                title={
                                    savedPosts.has(`${item.postId}-${item.imageUrl}`)
                                        ? 'Quitar de guardados'
                                        : 'Guardar'
                                }
                            >
                                {savedPosts.has(`${item.postId}-${item.imageUrl}`) ? <FaBookmark /> : <FaRegBookmark />}
                            </button>
                            {saveFeedback.show &&
                                saveFeedback.postId === item.postId &&
                                saveFeedback.imageUrl === item.imageUrl && (
                                    <div className="save-feedback show">{saveFeedback.text}</div>
                                )}
                            <div className="overlay">
                                <div className="user-profile-hover">
                                    {item.user && item.user.profilePicture && (
                                        <div className="user-avatar-container">
                                            <img 
                                                src={item.user.profilePicture} 
                                                alt={`${item.user.username || 'Usuario'}`} 
                                                className="user-avatar" 
                                            />
                                        </div>
                                    )}
                                    <div className="user-info-hover">
                                        <div className="username">@{item.user?.username || 'usuario'}</div>
                                        {item.user?.city && <div className="user-location">{item.user.city}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Masonry>

                <div ref={sentinelRef} style={{ height: '1px' }} />
                {loading && (
                    <div className="loading-spinner">
                        <i className="fas fa-spinner fa-spin" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explorer;
