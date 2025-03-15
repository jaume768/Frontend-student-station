import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

// Librería de Masonry
import Masonry from 'react-masonry-css';

import Layout from '../components/controlPanel/Layout';
import EditProfile from '../components/controlPanel/EditProfile';
import MiPerfil from '../components/controlPanel/MiPerfil';
import MyComunity from '../components/controlPanel/MyComunity';
import CreatePost from '../components/controlPanel/CreatePost';
import UserPost from '../components/controlPanel/UserPost';
import Guardados from '../components/controlPanel/Guardados';
import UserProfile from '../components/controlPanel/UserProfile';
import FolderContent from '../components/controlPanel/FolderContent';
import Creatives from '../components/controlPanel/Creatives';
import './css/control-panel.css';

const ControlPanel = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [postImages, setPostImages] = useState([]);     // Todas las imágenes
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [savedPosts, setSavedPosts] = useState({});
    const [showSavedTextMap, setShowSavedTextMap] = useState({});

    const [activeMenu, setActiveMenu] = useState('explorer');
    // Estado para acumular los IDs de posts ya mostrados (para no repetirlos)
    const [excludedIds, setExcludedIds] = useState([]);

    // Verificar autenticación y cargar activeMenu desde sessionStorage/localStorage
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);

        const savedActiveMenu = sessionStorage.getItem('activeMenu');
        if (location.state?.activeMenu) {
            setActiveMenu(location.state.activeMenu);
            sessionStorage.setItem('activeMenu', location.state.activeMenu);
        } else if (savedActiveMenu) {
            setActiveMenu(savedActiveMenu);
        }
    }, [location.pathname, location.state]);

    // Verificación de autenticación para rutas protegidas
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const protectedMenus = [
            'editProfile', 'misOfertas', 'configuracion',
            'profile', 'community', 'createPost', 'guardados'
        ];
        if (protectedMenus.includes(activeMenu) && !token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }
    }, [activeMenu, navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    // Obtener los posts guardados del usuario
    useEffect(() => {
        const fetchSavedPosts = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const favResponse = await axios.get(`${backendUrl}/api/users/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const favorites = favResponse.data.favorites || [];
                const savedPostsMap = {};
                favorites.forEach(post => {
                    savedPostsMap[post._id] = true;
                });
                setSavedPosts(savedPostsMap);
            } catch (error) {
                console.error('Error al cargar posts guardados:', error);
            }
        };
        if (isAuthenticated) {
            fetchSavedPosts();
        }
    }, [isAuthenticated]);

    // Cargar imágenes para la sección explorer
    useEffect(() => {
        const fetchPostImages = async () => {
            setLoading(true);
            setError(null);
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const limit = 5;

                // Aunque excludedIds ya no está en la lista de dependencias,
                // podemos seguir usándolo aquí para construir el query
                const excludeQuery = excludedIds.length
                    ? `&exclude=${excludedIds.join(",")}`
                    : "";

                const response = await axios.get(
                    `${backendUrl}/api/posts/explorer?page=${page}&limit=${limit}${excludeQuery}`
                );
                const newImages = response.data.images;

                // Evitar duplicados
                setPostImages(prev => {
                    if (page === 1) {
                        return newImages;
                    } else {
                        const uniqueNewImages = newImages.filter(newImg =>
                            !prev.some(oldImg => oldImg.postId === newImg.postId)
                        );
                        return [...prev, ...uniqueNewImages];
                    }
                });

                // Actualizar excludedIds con los nuevos postIds
                const newPostIds = newImages.map(img => img.postId);
                setExcludedIds(prev => {
                    const combined = [...prev];
                    newPostIds.forEach(id => {
                        if (!combined.includes(id)) {
                            combined.push(id);
                        }
                    });
                    return combined;
                });

                setHasMore(response.data.hasMore);
            } catch (err) {
                console.error('Error fetching post images:', err);
                setError('No se pudieron cargar las imágenes. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        // Solo se dispara si estamos en la sección explorer
        if (activeMenu === 'explorer' || location.pathname.includes('/explorer')) {
            fetchPostImages();
        }
        // IMPORTANTE: quitamos excludedIds del array de dependencias
    }, [page, activeMenu, location.pathname]);


    // Reset al cambiar de sección
    useEffect(() => {
        if (activeMenu === 'explorer' || location.pathname.includes('/explorer')) {
            setPage(1);
            setPostImages([]);
            setHasMore(true);
            setExcludedIds([]);
            if (observer.current) observer.current.disconnect();
            if (window.innerWidth > 768) {
                window.scrollTo(0, 0);
            }
        }
    }, [activeMenu, location.pathname]);

    // Intersection Observer para el scroll infinito
    const observer = useRef();
    const lastImageRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prevPage => prevPage + 1);
            }
        }, { rootMargin: '500px' });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, page]);

    // Handlers
    const handleImageClick = (postId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }
        navigate(`/ControlPanel/post/${postId}`);
    };

    const handleSaveClick = async (e, postId) => {
        e.stopPropagation();
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!savedPosts[postId]) {
                await axios.post(
                    `${backendUrl}/api/users/favorites/${postId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSavedPosts(prev => ({ ...prev, [postId]: true }));
                setShowSavedTextMap(prev => ({ ...prev, [postId]: true }));
                setTimeout(() => {
                    setShowSavedTextMap(prev => ({ ...prev, [postId]: false }));
                }, 2000);
            } else {
                await axios.delete(`${backendUrl}/api/users/favorites/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSavedPosts(prev => {
                    const newSavedPosts = { ...prev };
                    delete newSavedPosts[postId];
                    return newSavedPosts;
                });
                setShowSavedTextMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[postId];
                    return newMap;
                });
            }
        } catch (error) {
            console.error('Error al actualizar favoritos:', error);
        }
    };

    // Configuración de breakpoints para Masonry
    const breakpointColumnsObj = {
        default: 6,
        1400: 5,
        1200: 4,
        992: 3,
        768: 2,
        480: 2
    };

    // Componente que renderiza la galería con Masonry
    const Explorer = () => {
        return (
            <div className="explorer-container">
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"           // clase contenedor
                    columnClassName="my-masonry-grid_column" // clase para columnas
                >
                    {postImages.map((item, index) => {
                        const isLastItem = (index === postImages.length - 1);
                        const isPostSaved = savedPosts[item.postId];
                        const showSavedText = showSavedTextMap[item.postId];

                        return (
                            <div
                                className="masonry-item"
                                key={`${item.postId}-${index}`}
                                onClick={() => handleImageClick(item.postId)}
                                ref={isLastItem ? lastImageRef : null}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.postTitle || 'Imagen de post'}
                                    loading="lazy"
                                />
                                <div className="overlay">
                                    <button
                                        className={`save-btn ${isPostSaved ? 'saved' : ''}`}
                                        onClick={(e) => handleSaveClick(e, item.postId)}
                                    >
                                        Guardar
                                        {showSavedText && (
                                            <span className="saved-text">Guardado</span>
                                        )}
                                    </button>
                                    <div className="user-info">
                                        <img
                                            src={item.user.profilePicture || "/multimedia/usuarioDefault.jpg"}
                                            alt={item.user.username}
                                            loading="lazy"
                                        />
                                        <span>{item.user.username}</span>
                                    </div>
                                    {item.user.country && (
                                        <div className="location-info">
                                            <i className="location-icon fas fa-map-marker-alt"></i>
                                            <span>{item.user.country}</span>
                                        </div>
                                    )}
                                    {item.peopleTags && item.peopleTags.length > 0 && (
                                        <div className="tag-label">
                                            {item.peopleTags[0].role || 'Colaborador'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </Masonry>

                <div style={{ padding: '20px', textAlign: 'center', clear: 'both' }}>
                    {loading && (
                        <div className="loading-spinner">
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>Cargando imágenes...</span>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    {!loading && !error && !hasMore && postImages.length > 0 && (
                        <div className="end-message">No hay más imágenes para mostrar</div>
                    )}
                </div>
            </div>
        );
    };

    // Rutas
    const renderContent = () => {
        const ProtectedRoute = ({ children }) => {
            if (!isAuthenticated) {
                navigate('/', { state: { showRegister: true } });
                return null;
            }
            return children;
        };

        return (
            <Routes>
                <Route path="post/:id" element={<ProtectedRoute><UserPost /></ProtectedRoute>} />
                <Route path="profile/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="guardados/folder/:folderId" element={<ProtectedRoute><FolderContent /></ProtectedRoute>} />

                {/* Aquí utilizamos nuestro componente Explorer con Masonry */}
                <Route path="explorer" element={<Explorer />} />

                <Route path="creatives" element={<Creatives />} />
                <Route
                    path="fashion"
                    element={<ProtectedRoute><div><h1>Contenido de Estudiar Moda</h1></div></ProtectedRoute>}
                />
                <Route
                    path="blog"
                    element={<ProtectedRoute><div><h1>Contenido de Blog</h1></div></ProtectedRoute>}
                />
                <Route
                    path="magazine"
                    element={<ProtectedRoute><div><h1>Contenido de Revista</h1></div></ProtectedRoute>}
                />
                <Route path="info" element={<div><h1>Información</h1></div>} />
                <Route path="editProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="misOfertas" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="configuracion" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><MiPerfil /></ProtectedRoute>} />
                <Route path="community" element={<ProtectedRoute><MyComunity /></ProtectedRoute>} />
                <Route path="createPost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="guardados" element={<ProtectedRoute><Guardados /></ProtectedRoute>} />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/ControlPanel/explorer" replace />} />
            </Routes>
        );
    };

    // Determinar clases para el contenido según la ruta actual
    const isUserPost = location.pathname.includes('/post/');
    const contentClassName = isUserPost
        ? 'no-padding'
        : (activeMenu === 'editProfile' ? 'overflow-hidden-desktop' : '');

    return (
        <Layout activeMenu={activeMenu} contentClassName={contentClassName}>
            {renderContent()}
        </Layout>
    );
};

export default ControlPanel;
