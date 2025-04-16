import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { MdTune } from 'react-icons/md';
import './css/explorer.css';

const Explorer = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('explorer'); // Opciones: 'explorer', 'staffPicks', 'following'
    const [tabDisabled, setTabDisabled] = useState(false); // Para evitar cambios rápidos de pestaña
    const [showFilters, setShowFilters] = useState(false); // Para mostrar/ocultar el panel de filtros
    const [showMobileFilters, setShowMobileFilters] = useState(false); // Para mostrar/ocultar el modal de filtros en móvil
    const [isMobile, setIsMobile] = useState(false); // Para detectar si estamos en móvil

    // Al montar el componente se limpian algunos storage
    useEffect(() => {
        sessionStorage.removeItem('explorerImages');
        sessionStorage.removeItem('explorerPage');
        sessionStorage.removeItem('viewedPosts');
    }, []);

    const [postImages, setPostImages] = useState([]);
    const [savedPosts, setSavedPosts] = useState(new Map());
    const [saveFeedback, setSaveFeedback] = useState({ show: false, postId: null, imageUrl: null, text: "" });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    // Detectar si estamos en móvil
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Cargar posts guardados
    useEffect(() => {
        const fetchSavedPosts = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/users/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const savedImagesMap = new Map();
                if (response.data.favorites) {
                    response.data.favorites.forEach(fav => {
                        if (fav.postId && fav.mainImage) {
                            const key = `${fav.postId}-${fav.mainImage}`;
                            savedImagesMap.set(key, true);
                        }
                    });
                }
                setSavedPosts(savedImagesMap);
            } catch (error) {
                console.error('Error cargando posts guardados:', error);
            }
        };
        fetchSavedPosts();
    }, []);

    const getViewedPosts = () => {
        const viewed = sessionStorage.getItem('viewedPosts');
        return viewed ? JSON.parse(viewed) : [];
    };

    const addViewedPost = (postId) => {
        const viewed = getViewedPosts();
        if (!viewed.includes(postId)) {
            if (viewed.length >= 1000) viewed.shift();
            viewed.push(postId);
            sessionStorage.setItem('viewedPosts', JSON.stringify(viewed));
        }
    };

    // Al cambiar de pestaña, reiniciamos la paginación, la lista de posts y limpiamos los posts vistos
    useEffect(() => {
        sessionStorage.removeItem('viewedPosts'); // Resetea los posts vistos
        setPage(1);
        setPostImages([]);
        setHasMore(true);
    }, [activeTab]);

    // Cargar imágenes según la pestaña activa
    useEffect(() => {
        let cancelled = false; // Bandera para ignorar respuestas si la pestaña cambia rápidamente

        const fetchImages = async () => {
            if (!hasMore) return;
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const limit = 8;
            // Para "explorer" y "following" usamos el parámetro exclude; en Staff Picks lo dejamos vacío
            const viewedPosts = getViewedPosts();
            let url = '';

            if (activeTab === 'explorer') {
                url = `${backendUrl}/api/posts/explorer?page=${page}&limit=${limit}&exclude=${viewedPosts.join(',')}`;
            } else if (activeTab === 'staffPicks') {
                url = `${backendUrl}/api/posts/staff-picks?page=${page}&limit=${limit}&exclude=`;
            } else if (activeTab === 'following') {
                url = `${backendUrl}/api/posts/following?page=${page}&limit=${limit}&exclude=${viewedPosts.join(',')}`;
            }

            try {
                const response = await axios.get(url, {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                if (cancelled) return;
                if (activeTab === 'explorer' || activeTab === 'following') {
                    response.data.images.forEach(img => addViewedPost(img.postId));
                }
                // Función para mezclar aleatoriamente
                const shuffleArray = (array) => {
                    const shuffled = [...array];
                    for (let i = shuffled.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    return shuffled;
                };
                const randomizedNewImages = shuffleArray(response.data.images);
                const newImages = page === 1 ? randomizedNewImages : [...postImages, ...randomizedNewImages];
                setPostImages(newImages);
                // En Staff Picks, para que solo se cargue una vez y se reinicie (sin infinite scroll)...
                if (activeTab === 'staffPicks') {
                    setHasMore(false);
                } else {
                    setHasMore(response.data.hasMore);
                }
            } catch (error) {
                console.error('Error cargando imágenes:', error);
                if (error.response && error.response.status === 401) {
                    setHasMore(false);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchImages();

        return () => {
            cancelled = true;
        };
    }, [page, activeTab]);

    // Configurar IntersectionObserver para el infinite scroll
    useEffect(() => {
        // Si estamos en Staff Picks, no configuramos el observer para evitar más peticiones
        if (activeTab === 'staffPicks') return;

        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        }, { rootMargin: '1000px' });

        if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [loading, hasMore, activeTab]);

    const handlePostClick = (postId, imageUrl) => {
        navigate(`/ControlPanel/post/${postId}`, { state: { clickedImageUrl: imageUrl } });
    };

    const handleSavePost = async (e, postId, imageUrl) => {
        e.stopPropagation();
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const key = `${postId}-${imageUrl}`;
            const isSaved = savedPosts.has(key);
            if (isSaved) {
                await axios.delete(`${backendUrl}/api/users/favorites/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { imageUrl }
                });
                setSavedPosts(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(key);
                    return newMap;
                });
                setSaveFeedback({ show: true, postId, imageUrl, text: "Eliminado de guardados" });
            } else {
                await axios.post(`${backendUrl}/api/users/favorites/${postId}`,
                    { imageUrl },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSavedPosts(prev => {
                    const newMap = new Map(prev);
                    newMap.set(key, true);
                    return newMap;
                });
                setSaveFeedback({ show: true, postId, imageUrl, text: "¡Guardado!" });
            }
            setTimeout(() => {
                setSaveFeedback({ show: false, postId: null, imageUrl: null, text: "" });
            }, 2000);
        } catch (error) {
            console.error('Error al guardar/desguardar post:', error);
        }
    };

    const breakpointColumns = {
        default: 6,
        1400: 5,
        1200: 4,
        992: 3,
        768: 2,
        480: 2
    };

    return (
        <div className="explorer-container">
            {/* Encabezado */}
            <div className="explorer-header">
                <h1>Explorador</h1>
                <p className="explorer-description">
                    Explora las imágenes subidas por creativos. Selecciona <span className="highlight">Staff Picks</span> para ver las imágenes destacadas o <span className="highlight">Fotos aleatorias</span> para ver todo el contenido. Usa <span className="highlight">los filtros</span> para refinar la búsqueda.
                </p>

                <div className="explorer-tabs-container">
                    <button
                        className="explorer-filter-button"
                        onClick={() => isMobile ? setShowMobileFilters(!showMobileFilters) : setShowFilters(!showFilters)}
                        disabled={tabDisabled}
                    >
                        <MdTune />
                    </button>

                    <div className="explorer-tabs">
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
                    </div>
                </div>
            </div>

            {/* Panel de filtros (puedes mantenerlo igual) */}
            {/* … Código del panel de filtros … */}

            <div className={`explorer-content ${showFilters ? 'with-filters' : ''}`}>
                <Masonry
                    breakpointCols={breakpointColumns}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {postImages.map((item, index) => (
                        <div
                            className="masonry-item"
                            key={`${item.postId}-${index}`}
                            onClick={() => handlePostClick(item.postId, item.imageUrl)}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.postTitle || 'Imagen de post'}
                                loading="lazy"
                            />
                            <button
                                className={`save-button-explorer ${savedPosts.has(`${item.postId}-${item.imageUrl}`) ? 'saved' : ''}`}
                                onClick={(e) => handleSavePost(e, item.postId, item.imageUrl)}
                                title={savedPosts.has(`${item.postId}-${item.imageUrl}`) ? "Quitar de guardados" : "Guardar"}
                            >
                                {savedPosts.has(`${item.postId}-${item.imageUrl}`) ? <FaBookmark /> : <FaRegBookmark />}
                            </button>
                            {saveFeedback.show &&
                                saveFeedback.postId === item.postId &&
                                saveFeedback.imageUrl === item.imageUrl && (
                                    <div className={`save-feedback ${saveFeedback.show ? 'show' : ''}`}>
                                        {saveFeedback.text}
                                    </div>
                                )}
                            <div className="overlay">
                                <div className="user-info">
                                    <img
                                        src={item.user.profilePicture || "/multimedia/usuarioDefault.jpg"}
                                        alt={item.user.username}
                                        loading="lazy"
                                    />
                                    <span>{item.user.username}</span>
                                </div>
                            </div>
                            {item.user.country && (
                                <div className="country-tag">
                                    {item.user.country}
                                </div>
                            )}
                        </div>
                    ))}
                </Masonry>

                <div ref={sentinelRef} style={{ height: '1px' }} />

                {loading && (
                    <div className="loading-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explorer;
