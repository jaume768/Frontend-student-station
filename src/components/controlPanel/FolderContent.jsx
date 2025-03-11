import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import './css/FolderContent.css';

const FolderContent = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [folder, setFolder] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                
                // Cargar los posts completos para tener acceso a las imágenes principales
                if (folderRes.data.folder && folderRes.data.folder.posts && folderRes.data.folder.posts.length > 0) {
                    const postsWithDetails = await Promise.all(
                        folderRes.data.folder.posts.map(async (postId) => {
                            const postRes = await axios.get(`${backendUrl}/api/posts/${postId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            return postRes.data.post;
                        })
                    );
                    
                    setPosts(postsWithDetails.filter(post => post !== null));
                }
            } catch (error) {
                console.error('Error fetching folder content:', error);
            } finally {
                setLoading(false);
            }
        };

        if (folderId) {
            fetchFolderContent();
        }
    }, [folderId, navigate]);

    const goBack = () => {
        navigate('/ControlPanel/guardados');
    };

    const openPost = (postId) => {
        navigate(`/ControlPanel/post/${postId}`);
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
                    {posts.map(post => (
                        <div 
                            key={post._id} 
                            className="masonry-item"
                            onClick={() => openPost(post._id)}
                        >
                            <img 
                                src={post.mainImage} 
                                alt={`Post guardado`}
                                className="masonry-image"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-folder-message">
                    Esta carpeta está vacía. Guarda posts para verlos aquí.
                </div>
            )}
        </div>
    );
};

export default FolderContent;
