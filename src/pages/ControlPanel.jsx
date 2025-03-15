import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
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
    const [postImages, setPostImages] = useState([]);
    const [postImagesByPage, setPostImagesByPage] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [savedPosts, setSavedPosts] = useState({});
    const [showSavedTextMap, setShowSavedTextMap] = useState({});
    const [activeMenu, setActiveMenu] = useState('explorer');
    const [scrollDebug, setScrollDebug] = useState("Esperando scroll...");

    // Verificar autenticación y cargar activeMenu desde localStorage si está disponible
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
        
        // Si hay un activeMenu en sessionStorage, lo usamos
        const savedActiveMenu = sessionStorage.getItem('activeMenu');
        
        // Si hay un state en location, tiene prioridad
        if (location.state?.activeMenu) {
            setActiveMenu(location.state.activeMenu);
            sessionStorage.setItem('activeMenu', location.state.activeMenu);
        } else if (savedActiveMenu) {
            // Si no hay state pero hay un valor guardado, lo usamos
            setActiveMenu(savedActiveMenu);
        }
        
        // Si estamos en una ruta específica como /post/:id
        if (location.pathname.includes('/post/')) {
            // No necesitamos cambiar el activeMenu
        } else if (location.pathname.includes('/profile/')) {
            // No necesitamos cambiar el activeMenu
        }
        
    }, [location.pathname, location.state]);

    // Verificación de autenticación para rutas protegidas
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        // Lista de secciones protegidas que requieren autenticación
        const protectedMenus = [
            'editProfile', 'misOfertas', 'configuracion', 
            'profile', 'community', 'createPost', 'guardados'
        ];
        
        // Si estamos en una sección protegida y no hay token, redirigir al home
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

    // Cargar imágenes para la sección explorar
    useEffect(() => {
        const fetchPostImages = async () => {
            setLoading(true);
            setError(null);
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                // Reducir el limit para cargar menos imágenes inicialmente
                const limit = 8; 
                const response = await axios.get(`${backendUrl}/api/posts/explorer?page=${page}&limit=${limit}`);

                const newImages = response.data.images;
                
                // Almacenar las imágenes por página
                setPostImagesByPage(prev => ({
                    ...prev,
                    [page]: newImages
                }));
                
                // También actualizar el array completo para compatibilidad
                setPostImages(prev => {
                    // Si es la primera página, reemplazar todas las imágenes
                    if (page === 1) {
                        return newImages;
                    } else {
                        // Eliminar duplicados antes de agregar las nuevas imágenes
                        const uniqueNewImages = newImages.filter(newImg =>
                            !prev.some(oldImg => oldImg.imageUrl === newImg.imageUrl)
                        );
                        return [...prev, ...uniqueNewImages];
                    }
                });

                setHasMore(response.data.hasMore);
            } catch (err) {
                console.error('Error fetching post images:', err);
                setError('No se pudieron cargar las imágenes. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        // Solo cargar imágenes si estamos en la sección explorer
        if (activeMenu === 'explorer' || location.pathname.includes('/explorer')) {
            fetchPostImages();
        }
    }, [page, activeMenu, location.pathname]);

    // Detectar scroll al final de la ventana
    useEffect(() => {
        // Función para detectar scroll (con throttle para evitar llamadas excesivas)
        let scrollTimer = null;
        function handleScroll() {
            if (scrollTimer) return;
            
            scrollTimer = setTimeout(() => {
                if (loading || !hasMore) {
                    scrollTimer = null;
                    return;
                }
                
                // Calcular posiciones de forma simplificada
                const scrolledToBottom = window.innerHeight + window.scrollY >= 
                    document.documentElement.scrollHeight - 500;
                
                if (scrolledToBottom) {
                    console.log("Cargando más imágenes - Página:", page + 1);
                    setPage(prevPage => prevPage + 1);
                }
                
                scrollTimer = null;
            }, 200);
        }
        
        // También cargar más al llegar al final de la ventana inicial si hay espacio
        function checkInitialScroll() {
            if (!loading && hasMore && 
                window.innerHeight >= document.documentElement.scrollHeight - 200) {
                console.log("Carga inicial - ventana grande, se necesitan más imágenes");
                setPage(prevPage => prevPage + 1);
            }
        }
        
        // Comprobar después de que las imágenes se hayan cargado
        setTimeout(checkInitialScroll, 500);
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimer) clearTimeout(scrollTimer);
        };
    }, [loading, hasMore, page]);

    // Reset pagination when changing sections
    useEffect(() => {
        setPage(1);
        setPostImages([]);
        setHasMore(true);
    }, [activeMenu]);

    const isUserPost = location.pathname.includes('/post/');
    const contentClassName = isUserPost
        ? 'no-padding'
        : (activeMenu === 'editProfile' ? 'overflow-hidden-desktop' : '');

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
                // Guardar post
                await axios.post(
                    `${backendUrl}/api/users/favorites/${postId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setSavedPosts(prev => ({ ...prev, [postId]: true }));
                
                // Mostrar texto "Guardado" por 2 segundos
                setShowSavedTextMap(prev => ({ ...prev, [postId]: true }));
                setTimeout(() => {
                    setShowSavedTextMap(prev => ({ ...prev, [postId]: false }));
                }, 2000);
            } else {
                // Eliminar post de guardados
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

    const renderExplorer = () => {
        return (
            <div className="explorer-container">
                {/* Mostramos cada página por separado para mantener el orden visual */}
                {Object.keys(postImagesByPage).map(pageNum => (
                    <div key={`page-${pageNum}`} className="explorer-page">
                        <div className="explorer-gallery">
                            {postImagesByPage[pageNum].map((item, index) => {
                                const isPostSaved = savedPosts[item.postId];
                                const showSavedText = showSavedTextMap[item.postId];
                                
                                return (
                                    <div
                                        className="masonry-item"
                                        key={`${item.postId}-${index}-${pageNum}`}
                                        onClick={() => handleImageClick(item.postId)}
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
                                                {showSavedText && <span className="saved-text">Guardado</span>}
                                            </button>
                                            <div className="user-info">
                                                <img
                                                    src={item.user.profilePicture || "/multimedia/usuarioDefault.jpg"}
                                                    alt={item.user.username}
                                                    loading="lazy"
                                                />
                                                <span>{item.user.username}</span>
                                            </div>
                                            {(item.user.country) && (
                                                <div className="location-info">
                                                    <i className="location-icon fas fa-map-marker-alt"></i>
                                                    <span>
                                                        {item.user.country}
                                                    </span>
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
                        </div>
                    </div>
                ))}
                
                {/* Indicadores de estado y debug */}
                <div style={{ padding: '20px', textAlign: 'center', clear: 'both' }}>
                    <div style={{ 
                        marginBottom: '10px', 
                        fontFamily: 'monospace', 
                        fontSize: '12px',
                        backgroundColor: '#f8f9fa',
                        padding: '5px',
                        borderRadius: '4px'
                    }}>
                        {scrollDebug}
                    </div>
                    
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
                    
                    {!loading && hasMore && (
                        <button 
                            onClick={() => setPage(p => p + 1)}
                            style={{ 
                                padding: '8px 15px', 
                                background: '#4e73df', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Cargar más imágenes
                        </button>
                    )}
                </div>
            </div>
        );
    };

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
                <Route path="explorer" element={renderExplorer()} />
                <Route path="creatives" element={<Creatives />} />
                <Route path="fashion" element={
                    <ProtectedRoute><div><h1>Contenido de Estudiar Moda</h1></div></ProtectedRoute>
                } />
                <Route path="blog" element={
                    <ProtectedRoute><div><h1>Contenido de Blog</h1></div></ProtectedRoute>
                } />
                <Route path="magazine" element={
                    <ProtectedRoute><div><h1>Contenido de Revista</h1></div></ProtectedRoute>
                } />
                <Route path="info" element={
                    <div><h1>Información</h1></div>
                } />
                <Route path="editProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="misOfertas" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="configuracion" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><MiPerfil /></ProtectedRoute>} />
                <Route path="community" element={<ProtectedRoute><MyComunity /></ProtectedRoute>} />
                <Route path="createPost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="guardados" element={<ProtectedRoute><Guardados /></ProtectedRoute>} />
                
                {/* Ruta por defecto - redirige a explorer */}
                <Route path="*" element={<Navigate to="/ControlPanel/explorer" replace />} />
            </Routes>
        );
    };

    return (
        <Layout activeMenu={activeMenu} contentClassName={contentClassName}>
            {renderContent()}
        </Layout>
    );
};

export default ControlPanel;
