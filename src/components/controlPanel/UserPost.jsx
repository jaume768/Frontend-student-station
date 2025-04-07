import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    FaArrowLeft,
    FaChevronLeft,
    FaChevronRight,
    FaBookmark,
    FaRegBookmark,
    FaShareAlt,
    FaUserCircle,
    FaTrash,
    FaTimes
} from 'react-icons/fa';
import './css/UserPost.css';

const UserPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const clickedImageUrl = location.state?.clickedImageUrl;
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const [savedImages, setSavedImages] = useState(new Map());
    const [saveFeedback, setSaveFeedback] = useState({ show: false, imageUrl: null, text: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Obtener el ID del usuario autenticado.
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showFullScreenPreview, setShowFullScreenPreview] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                // Obtener datos del usuario actual
                const userResponse = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (userResponse.data && userResponse.data._id) {
                    setCurrentUserId(userResponse.data._id);
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                // 1. Obtenemos el post
                const response = await axios.get(`${backendUrl}/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPost(response.data.post);
                
                // Si tenemos una URL de imagen clickeada, buscamos su índice
                if (clickedImageUrl && response.data.post.images) {
                    const clickedIndex = response.data.post.images.findIndex(img => img === clickedImageUrl);
                    if (clickedIndex !== -1) {
                        setCurrentImageIndex(clickedIndex);
                    }
                }

                // 2. Obtenemos la lista de favoritos del usuario
                const favResponse = await axios.get(`${backendUrl}/api/users/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                // 3. Creamos un mapa de imágenes guardadas
                const savedImagesMap = new Map();
                const favorites = favResponse.data.favorites || [];
                
                favorites.forEach(fav => {
                    if (fav.postId && fav.savedImage) {
                        // Usar una clave compuesta de postId + imageUrl
                        const key = `${fav.postId}-${fav.savedImage}`;
                        savedImagesMap.set(key, true);
                    }
                });
                
                setSavedImages(savedImagesMap);
                
                console.log("Imágenes guardadas:", Array.from(savedImagesMap.keys()));
                console.log("Post ID actual:", id);
                console.log("Imágenes del post:", response.data.post.images);
            } catch (error) {
                console.error('Error al cargar la publicación o favoritos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return (
        <div className="modern-loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando publicación</p>
        </div>
    );
    if (!post) return <div>No hay datos de la publicación</div>;

    const images = post.images || [];
    const mainImage = images[currentImageIndex] || '';

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        // Obtener la imagen actual
        const currentImage = images[currentImageIndex];
        if (!currentImage) return;
        
        // Crear una clave compuesta para verificar si esta imagen específica está guardada
        const key = `${id}-${currentImage}`;
        const isImageSaved = savedImages.has(key);
        
        try {
            if (!isImageSaved) {
                // Guardar la imagen específica
                await axios.post(
                    `${backendUrl}/api/users/favorites/${id}`,
                    { imageUrl: currentImage },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Actualizar el estado local
                setSavedImages(prev => {
                    const newMap = new Map(prev);
                    newMap.set(key, true);
                    return newMap;
                });
                
                setSaveFeedback({ show: true, imageUrl: currentImage, text: "¡Guardado!" });
            } else {
                // Eliminar esta imagen específica de favoritos
                await axios.delete(`${backendUrl}/api/users/favorites/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { imageUrl: currentImage }
                });
                
                // Actualizar el estado local
                setSavedImages(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(key);
                    return newMap;
                });
                
                setSaveFeedback({ show: true, imageUrl: currentImage, text: "Eliminado de guardados" });
            }
            
            // Ocultar el feedback después de 2 segundos
            setTimeout(() => {
                setSaveFeedback({ show: false, imageUrl: null, text: "" });
            }, 2000);
        } catch (error) {
            console.error('Error al actualizar favoritos:', error);
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        console.log('Compartir post', post._id);
        // Lógica para compartir el post
    };

    const handleDeletePost = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.delete(`${backendUrl}/api/posts/${post._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Redirige o actualiza la UI después de eliminar el post
            navigate(-1);
        } catch (error) {
            console.error('Error al eliminar el post:', error);
        }
    };

    // Eventos para swipe en móviles
    const onTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) {
            handleNext();
        } else if (distance < -minSwipeDistance) {
            handlePrevious();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <div className="perfil">
            <header className="perfil__header">
                <button className="perfil__volver" onClick={() => navigate(-1)}>
                    <FaArrowLeft size={20} />
                    <p>Volver</p>
                </button>
            </header>
            <section className="perfil__contenido">
                <div className="perfil__imagenes">
                    <div
                        className="perfil__imagen"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <button className="anterior" onClick={handlePrevious}>
                            <FaChevronLeft size={24} />
                        </button>
                        <img
                            src={mainImage}
                            alt="Imagen principal"
                            className="perfil__imagen-principal"
                            onClick={() => setShowFullScreenPreview(true)}
                            style={{ cursor: 'pointer' }}
                        />
                        <div className="options">
                            <button
                                className={`save-button-post ${savedImages.has(`${id}-${mainImage}`) ? 'saved' : ''}`}
                                onClick={handleSave}
                                title={savedImages.has(`${id}-${mainImage}`) ? "Quitar de guardados" : "Guardar"}
                            >
                                {savedImages.has(`${id}-${mainImage}`) ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                                {saveFeedback.show && saveFeedback.imageUrl === mainImage && (
                                    <span className="saved-text">{saveFeedback.text}</span>
                                )}
                            </button>
                            <button className="compartir" onClick={handleShare}>
                                <FaShareAlt size={20} />
                            </button>
                            {post.user?._id === currentUserId && (
                                <button
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    <FaTrash size={20} />
                                </button>
                            )}
                        </div>
                        <button className="siguiente" onClick={handleNext}>
                            <FaChevronRight size={24} />
                        </button>
                    </div>
                    <div className="perfil__galeria">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Miniatura ${index + 1}`}
                                className={`perfil__miniatura ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(index)}
                            />
                        ))}
                    </div>
                </div>
                <div className="perfil__info">
                    <div 
                        className="perfil__usuario" 
                        onClick={() => navigate(`/ControlPanel/profile/${post.user.username}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        {post.user?.profile?.profilePicture ? (
                            <img
                                src={post.user.profile.profilePicture}
                                alt="Avatar"
                                className="perfil__avatar"
                            />
                        ) : (
                            <FaUserCircle size={50} />
                        )}
                        <div className="perfil__datos">
                            <h2 className="perfil__nombre">@{post.user.username}</h2>
                            <p className="perfil__ubicacion">
                                {post.user.city}, {post.user.country}
                            </p>
                        </div>
                    </div>
                    <div 
                        className={`perfil__publicacion ${
                            !post.imageTags || 
                            !post.imageTags[currentImageIndex] || 
                            post.imageTags[currentImageIndex].length === 0 
                                ? 'no-image-tags' 
                                : ''
                        }`}
                    >
                        <h1 className="publicacion__titulo">{post.title}</h1>
                        <p className="publicacion__descripcion">{post.description}</p>
                        {Array.isArray(post.peopleTags) &&
                            post.peopleTags.length > 0 &&
                            post.peopleTags.some(person => person.name && person.name.trim() !== '') && (
                                <div className="perfil__personas">
                                    <h3 className="personas__titulo">Personas que aparecen</h3>
                                    <ul className="personas__lista">
                                        {post.peopleTags
                                            .filter(person => person.name && person.name.trim() !== '')
                                            .map((person, idx) => (
                                                <li key={idx} className="personas__item">
                                                    {person.role}:{' '}
                                                    <a
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigate(`/ControlPanel/profile/${person.name}`);
                                                        }}
                                                        className="personas__enlace"
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        @{person.name}
                                                    </a>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                    </div>
                    {post.imageTags &&
                        post.imageTags[currentImageIndex] &&
                        post.imageTags[currentImageIndex].length > 0 && (
                            <div className="perfil__image-tags">
                                <h3 className="image-tags__titulo">Etiquetas</h3>
                                <div className="image-tags__lista">
                                    {post.imageTags[currentImageIndex].map((tag, idx) => (
                                        <span key={idx} className="image-tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    {post.tags && post.tags.length > 0 && (
                        <div className="perfil__etiquetas">
                            <h3 className="etiquetas__titulo">Etiquetas de la imagen</h3>
                            <div className="etiquetas__lista">
                                {post.tags.map((tag, index) => (
                                    <span key={index} className="etiqueta">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal de confirmación para eliminar el post */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>¿Estás seguro de eliminar esta publicación?</p>
                        <div className="modal-actions">
                            <button onClick={handleDeletePost}>Confirmar</button>
                            <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de vista previa a pantalla completa */}
            {showFullScreenPreview && (
                <div className="fullscreen-preview-overlay" 
                     onClick={() => setShowFullScreenPreview(false)}
                     onTouchStart={onTouchStart}
                     onTouchMove={onTouchMove}
                     onTouchEnd={onTouchEnd}>
                    <div className="fullscreen-preview-content">
                        <button className="fullscreen-close-btn" onClick={() => setShowFullScreenPreview(false)}>
                            <FaTimes size={24} />
                        </button>
                        <button className="fullscreen-prev-btn" onClick={(e) => {
                            e.stopPropagation();
                            handlePrevious();
                        }}>
                            <FaChevronLeft size={30} />
                        </button>
                        <img
                            src={mainImage}
                            alt="Vista previa a pantalla completa"
                            className="fullscreen-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button className="fullscreen-next-btn" onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}>
                            <FaChevronRight size={30} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPost;
