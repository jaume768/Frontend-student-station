import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './css/explorer.css';

const Explorer = () => {
    const navigate = useNavigate();
    const [postImages, setPostImages] = useState(() => {
        const saved = sessionStorage.getItem('explorerImages');
        return saved ? JSON.parse(saved) : [];
    });
    const [savedPosts, setSavedPosts] = useState(new Set());
    const [saveFeedback, setSaveFeedback] = useState({ show: false, postId: null, text: "" });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(() => {
        const saved = sessionStorage.getItem('explorerPage');
        return saved ? parseInt(saved) : 1;
    });
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    // Cargar posts guardados al inicio
    useEffect(() => {
        const fetchSavedPosts = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/users/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSavedPosts(new Set(response.data.map(post => post.postId)));
            } catch (error) {
                console.error('Error cargando posts guardados:', error);
            }
        };

        fetchSavedPosts();
    }, []);

    const handleSavePost = async (e, postId) => {
        e.stopPropagation(); // Evitar que se propague al click del post
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const isSaved = savedPosts.has(postId);
            
            if (isSaved) {
                await axios.delete(`${backendUrl}/api/users/favorites/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSavedPosts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(postId);
                    return newSet;
                });
                setSaveFeedback({ show: true, postId, text: "Eliminado de guardados" });
            } else {
                await axios.post(`${backendUrl}/api/users/favorites`, 
                    { postId },
                    { headers: { Authorization: `Bearer ${token}` }}
                );
                setSavedPosts(prev => new Set([...prev, postId]));
                setSaveFeedback({ show: true, postId, text: "¡Guardado!" });
            }

            // Ocultar el feedback después de 2 segundos
            setTimeout(() => {
                setSaveFeedback({ show: false, postId: null, text: "" });
            }, 2000);
        } catch (error) {
            console.error('Error al guardar/desguardar post:', error);
        }
    };

    // Función para obtener y gestionar los posts vistos (ahora usando sessionStorage)
    const getViewedPosts = () => {
        const viewed = sessionStorage.getItem('viewedPosts');
        return viewed ? JSON.parse(viewed) : [];
    };

    const addViewedPost = (postId) => {
        const viewed = getViewedPosts();
        if (!viewed.includes(postId)) {
            if (viewed.length >= 1000) {
                viewed.shift();
            }
            viewed.push(postId);
            sessionStorage.setItem('viewedPosts', JSON.stringify(viewed));
        }
    };

    // Cargar imágenes
    useEffect(() => {
        const fetchImages = async () => {
            if (postImages.length > 0 && page === 1) return;

            setLoading(true);
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const limit = 8;
                const viewedPosts = getViewedPosts();
                
                const response = await axios.get(
                    `${backendUrl}/api/posts/explorer?page=${page}&limit=${limit}&exclude=${viewedPosts.join(',')}`
                );
                
                response.data.images.forEach(img => {
                    addViewedPost(img.postId);
                });

                const newImages = page === 1 ? response.data.images : [...postImages, ...response.data.images];
                setPostImages(newImages);
                setHasMore(response.data.hasMore);

                sessionStorage.setItem('explorerImages', JSON.stringify(newImages));
                sessionStorage.setItem('explorerPage', page.toString());
            } catch (error) {
                console.error('Error cargando imágenes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [page]);

    // Limpiar sessionStorage cuando se desmonta el componente
    useEffect(() => {
        return () => {
            if (!window.location.pathname.includes('/explorer')) {
                sessionStorage.removeItem('explorerImages');
                sessionStorage.removeItem('explorerPage');
                sessionStorage.removeItem('viewedPosts');
            }
        };
    }, []);

    // Configurar IntersectionObserver
    useEffect(() => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        }, { rootMargin: '500px' });

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [loading, hasMore]);

    const handlePostClick = (postId) => {
        navigate(`/ControlPanel/post/${postId}`);
    };

    // Configuración de breakpoints para Masonry
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
            <Masonry
                breakpointCols={breakpointColumns}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {postImages.map((item, index) => (
                    <div
                        className="masonry-item"
                        key={`${item.postId}-${index}`}
                        onClick={() => handlePostClick(item.postId)}
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.postTitle || 'Imagen de post'}
                            loading="lazy"
                        />
                        <button
                            className={`save-button-explorer ${savedPosts.has(item.postId) ? 'saved' : ''}`}
                            onClick={(e) => handleSavePost(e, item.postId)}
                            title={savedPosts.has(item.postId) ? "Quitar de guardados" : "Guardar"}
                        >
                            {savedPosts.has(item.postId) ? <FaBookmark /> : <FaRegBookmark />}
                        </button>
                        {saveFeedback.show && saveFeedback.postId === item.postId && (
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
                    <span>Cargando imágenes...</span>
                </div>
            )}
        </div>
    );
};

export default Explorer;
