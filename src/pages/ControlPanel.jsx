import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const observer = useRef();
    const lastImageElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        if (location.state?.activeMenu !== 'explorer' && location.state?.activeMenu !== 'creatives' && location.state?.activeMenu) {
            // Si la sección no es el explorador ni creatives y el usuario no está autenticado, redirigir al home
            if (!isAuthenticated && location.state?.activeMenu !== 'explorer' && location.state?.activeMenu !== 'creatives') {
                navigate('/', { state: { showRegister: true } });
                return;
            }
        }

        const fetchPostImages = async () => {
            setLoading(true);
            setError(null);
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/posts/explorer?page=${page}&limit=20`);

                setPostImages(prev => {
                    const newImages = response.data.images;
                    const uniqueNewImages = newImages.filter(newImg =>
                        !prev.some(oldImg => oldImg.imageUrl === newImg.imageUrl)
                    );
                    
                    if (page === 1) {
                        return newImages;
                    } else {
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

        fetchPostImages();
    }, [page, navigate, location.state?.activeMenu, isAuthenticated]);

    const activeMenu = location.state?.activeMenu || 'explorer';

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

    const handleSaveClick = (e, imageId) => {
        e.stopPropagation();
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }
        
        console.log('Guardar imagen:', imageId);
    };

    const renderExplorer = () => {
        return (
            <div>
                <div className="explorer-gallery">
                    {postImages.map((item, index) => {
                        // Determinar si es el último elemento para observador de intersección
                        const isLastElement = index === postImages.length - 1;
                        return (
                            <div
                                className="masonry-item"
                                key={index}
                                ref={isLastElement ? lastImageElementRef : null}
                                onClick={() => handleImageClick(item.postId)}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.postTitle || 'Imagen de post'}
                                />
                                <div className="overlay">
                                    <button
                                        className="save-btn"
                                        onClick={(e) => handleSaveClick(e, item.postId)}
                                    >
                                        Guardar
                                    </button>
                                    <div className="user-info">
                                        <img
                                            src={item.user.profilePicture || "/multimedia/usuarioDefault.jpg"}
                                            alt={item.user.username}
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
                {loading && <div className="loading-indicator">Cargando más imágenes...</div>}
                {error && <div className="error-message">{error}</div>}
                {!hasMore && postImages.length > 0 && (
                    <div className="end-message">No hay más imágenes para mostrar</div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        // Componente para proteger rutas que requieren autenticación
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
                <Route
                    path="*"
                    element={
                        (() => {
                            // Para el explorador y creatives, permitir acceso sin autenticación
                            if (activeMenu === 'explorer' || activeMenu === 'creatives') {
                                if (activeMenu === 'explorer') {
                                    return renderExplorer();
                                } else {
                                    return <Creatives />;
                                }
                            }
                            
                            // Para otras secciones, verificar autenticación
                            if (!isAuthenticated) {
                                navigate('/', { state: { showRegister: true } });
                                return null;
                            }
                            
                            switch (activeMenu) {
                                case 'fashion':
                                    return <div><h1>Contenido de Estudiar Moda</h1></div>;
                                case 'blog':
                                    return <div><h1>Contenido de Blog</h1></div>;
                                case 'magazine':
                                    return <div><h1>Contenido de Revista</h1></div>;
                                case 'info':
                                    return <div><h1>Información</h1></div>;
                                case 'editProfile':
                                case 'misOfertas':
                                case 'configuracion':
                                    return <ProtectedRoute><EditProfile /></ProtectedRoute>;
                                case 'profile':
                                    return <ProtectedRoute><MiPerfil /></ProtectedRoute>;
                                case 'community':
                                    return <ProtectedRoute><MyComunity /></ProtectedRoute>;
                                case 'createPost':
                                    return <ProtectedRoute><CreatePost /></ProtectedRoute>;
                                case 'guardados':
                                    return <ProtectedRoute><Guardados /></ProtectedRoute>;
                                default:
                                    return renderExplorer();
                            }
                        })()
                    }
                />
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
