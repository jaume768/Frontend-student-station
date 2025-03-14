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
import './css/control-panel.css';

const ControlPanel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [postImages, setPostImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);

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
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        if (location.state?.activeMenu !== 'explorer' && location.state?.activeMenu) return;

        const fetchPostImages = async () => {
            setLoading(true);
            setError(null);
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem('authToken');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(`${backendUrl}/api/posts/random-images`, {
                    headers,
                    params: { page, limit: 20 }
                });

                setPostImages(prev => {
                    // Merge with previous images for infinite scrolling
                    const newImages = response.data.images;
                    // Check for duplicates to prevent showing the same image twice
                    const uniqueNewImages = newImages.filter(newImg =>
                        !prev.some(oldImg => oldImg.imageUrl === newImg.imageUrl)
                    );
                    return [...prev, ...uniqueNewImages];
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
    }, [page, navigate, location.state?.activeMenu]);

    const activeMenu = location.state?.activeMenu || 'explorer';

    const isUserPost = location.pathname.includes('/post/');
    const contentClassName = isUserPost
        ? 'no-padding'
        : (activeMenu === 'editProfile' ? 'overflow-hidden-desktop' : '');

    const handleImageClick = (postId) => {
        navigate(`/ControlPanel/post/${postId}`);
    };

    const handleSaveClick = (e, imageId) => {
        e.stopPropagation(); // Para que no navegue al post
        // Lógica para guardar la imagen (se implementará más adelante)
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
                                    {(item.user.city || item.user.country) && (
                                        <div className="location-info">
                                            <i className="location-icon fas fa-map-marker-alt"></i>
                                            <span>
                                                {[item.user.city, item.user.country].filter(Boolean).join(', ')}
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
        return (
            <Routes>
                <Route path="post/:id" element={<UserPost />} />
                <Route path="profile/:username" element={<UserProfile />} />
                <Route path="guardados/folder/:folderId" element={<FolderContent />} />
                <Route
                    path="*"
                    element={
                        (() => {
                            switch (activeMenu) {
                                case 'explorer':
                                    return renderExplorer();
                                case 'creatives':
                                    return <div><h1>Contenido de Creativos</h1></div>;
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
                                    return <EditProfile />;
                                case 'profile':
                                    return <MiPerfil />;
                                case 'community':
                                    return <MyComunity />;
                                case 'createPost':
                                    return <CreatePost />;
                                case 'guardados':
                                    return <Guardados />;
                                default:
                                    return <div><h1>Contenido por defecto</h1></div>;
                            }
                        })()
                    }
                />
            </Routes>
        );
    };

    return (
        <Layout contentClassName={`dashboard-content ${contentClassName}`}>
            {renderContent()}
        </Layout>
    );
};

export default ControlPanel;
