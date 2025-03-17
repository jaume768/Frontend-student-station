import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Masonry from 'react-masonry-css';

const Explorer = () => {
    const navigate = useNavigate();
    const [postImages, setPostImages] = useState(() => {
        const saved = sessionStorage.getItem('explorerImages');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(() => {
        const saved = sessionStorage.getItem('explorerPage');
        return saved ? parseInt(saved) : 1;
    });
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

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
            // Si ya tenemos imágenes guardadas, no las volvemos a cargar
            if (postImages.length > 0 && page === 1) {
                return;
            }

            setLoading(true);
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const limit = 3;
                const viewedPosts = getViewedPosts();
                
                const response = await axios.get(
                    `${backendUrl}/api/posts/explorer?page=${page}&limit=${limit}&exclude=${viewedPosts.join(',')}`
                );
                
                // Marcar los nuevos posts como vistos
                response.data.images.forEach(img => {
                    addViewedPost(img.postId);
                });

                const newImages = page === 1 ? response.data.images : [...postImages, ...response.data.images];
                setPostImages(newImages);
                setHasMore(response.data.hasMore);

                // Guardar el estado en sessionStorage
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
            // Solo limpiamos si estamos navegando fuera del explorer
            if (!window.location.pathname.includes('/explorer')) {
                sessionStorage.removeItem('explorerImages');
                sessionStorage.removeItem('explorerPage');
                sessionStorage.removeItem('viewedPosts'); // También limpiamos los posts vistos
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
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.postTitle || 'Imagen de post'}
                            loading="lazy"
                        />
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
