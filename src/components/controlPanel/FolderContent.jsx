import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTrash, FaEllipsisV } from 'react-icons/fa';
import './css/FolderContent.css';

const FolderContent = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [folder, setFolder] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePostMenu, setActivePostMenu] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    useEffect(() => {
        const fetchFolderContent = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                // Obtener información de la carpeta
                const folderRes = await axios.get(`${backendUrl}/api/folders/${folderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setFolder(folderRes.data.folder);

                // Si la carpeta tiene posts, cargar los detalles de cada uno
                if (folderRes.data.folder && Array.isArray(folderRes.data.folder.posts) && folderRes.data.folder.posts.length > 0) {
                    // Para asegurarnos de que estamos trabajando con IDs (strings) y no objetos
                    const postIds = folderRes.data.folder.posts.map(post =>
                        typeof post === 'string' ? post : post._id ? post._id : post.toString()
                    );

                    // Cargar los detalles de cada post usando los IDs correctos
                    const postsPromises = postIds.map(postId =>
                        axios.get(`${backendUrl}/api/posts/${postId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                            .then(res => res.data.post)
                            .catch(err => {
                                console.error(`Error al cargar post ${postId}:`, err);
                                return null;
                            })
                    );

                    const postsWithDetails = await Promise.all(postsPromises);
                    // Filtrar posts nulos (que pueden ocurrir si hay errores en la solicitud)
                    const validPosts = postsWithDetails.filter(post => post !== null);
                    setPosts(validPosts);
                    console.log("Posts cargados correctamente:", validPosts.length);
                } else {
                    console.log("No se encontraron posts en la carpeta");
                    setPosts([]);
                }
            } catch (error) {
                console.error('Error fetching folder content:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        if (folderId) {
            fetchFolderContent();
        }
    }, [folderId, navigate]);

    // Cerrar menú cuando se hace clic en otra parte
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activePostMenu && !event.target.closest('.post-menu-container')) {
                setActivePostMenu(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [activePostMenu]);

    const goBack = () => {
        // Usar window.history para volver a la página anterior en lugar de una ruta fija
        navigate(-1);
    };

    const openPost = (postId) => {
        navigate(`/ControlPanel/post/${postId}`);
    };

    const togglePostMenu = (postId, e) => {
        e.stopPropagation();
        setActivePostMenu(activePostMenu === postId ? null : postId);
    };

    const confirmDeletePost = (postId, e) => {
        e.stopPropagation();
        setPostToDelete(postId);
        setShowDeleteConfirm(true);
        setActivePostMenu(null);
    };

    const cancelDelete = () => {
        setPostToDelete(null);
        setShowDeleteConfirm(false);
    };

    const removePostFromFolder = async () => {
        if (!postToDelete || !folderId) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            // Eliminar post de la carpeta
            await axios.post(
                `${backendUrl}/api/folders/remove`,
                { 
                    folderId: folderId,
                    postId: postToDelete 
                },
                { 
                    headers: { Authorization: `Bearer ${token}` } 
                }
            );

            // Actualizar el estado local
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postToDelete));
            
            // Cerrar el diálogo de confirmación
            setShowDeleteConfirm(false);
            setPostToDelete(null);
            
        } catch (error) {
            console.error('Error al eliminar post de la carpeta:', error);
        }
    };

    if (loading) {
        return (
            <div className="folder-content-container">
                <div className="folder-content-loading">Cargando contenido...</div>
            </div>
        );
    }

    return (
        <div className="folder-content-container">
            <div className="folder-content-header">
                <button className="back-button" onClick={goBack}>
                    <FaArrowLeft /> Volver
                </button>
                <h1>{folder ? folder.name : 'Carpeta'}</h1>
                <div className="folder-stats">
                    {posts.length} {posts.length === 1 ? 'post guardado' : 'posts guardados'}
                </div>
            </div>

            {posts.length > 0 ? (
                <div className="folder-content-masonry">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="masonry-item"
                            onClick={() => openPost(post._id)}
                        >
                            <img
                                src={post.mainImage}
                                alt={post.title || 'Post guardado'}
                                className="masonry-img"
                            />
                            
                            <div className="overlay"></div>
                            
                            {/* Menú de opciones */}
                            <div className="post-menu-container">
                                <button 
                                    className="post-menu-button"
                                    onClick={(e) => togglePostMenu(post._id, e)}
                                >
                                    <FaEllipsisV />
                                </button>
                                
                                {activePostMenu === post._id && (
                                    <div className="post-menu-dropdown">
                                        <button 
                                            className="post-menu-option delete"
                                            onClick={(e) => confirmDeletePost(post._id, e)}
                                        >
                                            <FaTrash /> Quitar de la carpeta
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="user-info">
                                <img
                                    src={post.author?.profilePicture || "/multimedia/usuarioDefault.jpg"}
                                    alt={post.author?.username || "Usuario"}
                                    className="user-avatar"
                                />
                                <span className="username">{post.author?.username || "Usuario"}</span>
                            </div>
                            
                            {post.location && (
                                <div className="location-info">
                                    <i className="location-icon fas fa-map-marker-alt"></i>
                                    <span>{post.location}</span>
                                </div>
                            )}
                            
                            {post.category && <div className="tag-label">{post.category}</div>}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-folder-message">
                    Esta carpeta está vacía. Guarda posts para verlos aquí.
                </div>
            )}

            {/* Confirmación de eliminación */}
            {showDeleteConfirm && (
                <div className="delete-confirmation-overlay">
                    <div className="delete-confirmation-modal">
                        <h3>¿Quitar post de la carpeta?</h3>
                        <p>Esta acción solo eliminará el post de la carpeta, no lo eliminará del sistema.</p>
                        <div className="confirmation-buttons">
                            <button 
                                className="confirm-button delete" 
                                onClick={removePostFromFolder}
                            >
                                Quitar
                            </button>
                            <button 
                                className="cancel-button" 
                                onClick={cancelDelete}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FolderContent;
