import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaPencilAlt, FaTimes, FaCheck, FaFolder, FaEdit } from 'react-icons/fa';
import './css/Guardados.css';

const Guardados = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [folders, setFolders] = useState([]);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);
    const [editingFolderName, setEditingFolderName] = useState({ id: null, name: '' });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [hoveredPost, setHoveredPost] = useState(null);
    const [ideasSinOrganizar, setIdeasSinOrganizar] = useState([]);

    const navigate = useNavigate();
    const folderSelectRef = useRef(null);

    // Función para mostrar el modal de edición de post
    const handleEditPost = (post, e) => {
        e.stopPropagation();
        setSelectedPost(post);
        setShowEditModal(true);
    };
    
    // Función para navegar al post
    const navigateToPost = (post) => {
        if (!post) return;
        const postIdToNavigate = post.postId || post._id;
        navigate(`/ControlPanel/post/${postIdToNavigate}`);
    };
    
    // Función para abrir el contenido de una carpeta/tablero
    const openFolderContent = (folderId) => {
        navigate(`/ControlPanel/guardados/folder/${folderId}`);
    };

    // Función para filtrar posts que ya están en carpetas
    const filterOrganizedPosts = (allPosts, allFolders) => {
        // Crear un conjunto con todos los IDs de posts que están en carpetas
        const organizedPostIds = new Set();
        
        allFolders.forEach(folder => {
            if (folder.items && folder.items.length > 0) {
                folder.items.forEach(item => {
                    if (item.postId) {
                        organizedPostIds.add(item.postId.toString());
                    }
                });
            }
        });
        
        // Filtrar los posts que NO están en carpetas
        return allPosts.filter(post => {
            const postId = post.postId || post._id;
            return !organizedPostIds.has(postId.toString());
        });
    };

    // Cargamos los datos (posts y carpetas)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                // Obtener posts guardados
                const postsRes = await axios.get(`${backendUrl}/api/users/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                // Obtener carpetas
                const foldersRes = await axios.get(`${backendUrl}/api/folders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (postsRes.data.favorites && foldersRes.data.folders) {
                    const allPosts = postsRes.data.favorites;
                    const allFolders = foldersRes.data.folders;
                    
                    setSavedPosts(allPosts);
                    setFolders(allFolders);
                    
                    // Filtrar solo los posts que no están en carpetas
                    const unorganizedPosts = filterOrganizedPosts(allPosts, allFolders);
                    setIdeasSinOrganizar(unorganizedPosts);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setNotification({
                    show: true,
                    message: 'Error al cargar los datos',
                    type: 'error'
                });
                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
            }
        };
        fetchData();
    }, []);

    // Ya no necesitamos este useEffect para carpetas porque lo hemos combinado con el de arriba

    // Crear nueva carpeta (tablero)
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            setNotification({
                show: true,
                message: 'Creando tablero...',
                type: 'info'
            });

            const res = await axios.post(
                `${backendUrl}/api/folders`,
                { name: newFolderName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.folder) {
                setFolders(prev => [...prev, res.data.folder]);
                setNewFolderName('');
                setIsCreatingFolder(false);
                
                setNotification({
                    show: true,
                    message: 'Tablero creado correctamente',
                    type: 'success'
                });
                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error('Error al crear tablero:', error);
            setNotification({
                show: true,
                message: 'Error al crear el tablero',
                type: 'error'
            });
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        }
    };

    // Eliminar carpeta
    const handleDeleteFolder = async (folderId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            await axios.delete(`${backendUrl}/api/folders/${folderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFolders(prev => prev.filter(folder => folder._id !== folderId));
            setShowDeleteConfirm(false);
            setFolderToDelete(null);

            setNotification({
                show: true,
                message: 'Tablero eliminado correctamente',
                type: 'success'
            });
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        } catch (error) {
            console.error('Error al eliminar carpeta:', error);
            setNotification({
                show: true,
                message: 'Error al eliminar el tablero',
                type: 'error'
            });
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        }
    };

    // Confirmar eliminación de carpeta
    const confirmDeleteFolder = (folderId, e) => {
        e.stopPropagation();
        setFolderToDelete(folderId);
        setShowDeleteConfirm(true);
    };

    // Cancelar eliminación de carpeta
    const cancelDeleteFolder = () => {
        setFolderToDelete(null);
        setShowDeleteConfirm(false);
    };

    // Iniciar edición de nombre de carpeta
    const startEditFolderName = (folder, e) => {
        e.stopPropagation();
        setEditingFolderName({
            id: folder._id,
            name: folder.name
        });
    };

    // Actualizar nombre de carpeta
    const updateFolderName = async (e) => {
        e.preventDefault();
        
        if (!editingFolderName.id || !editingFolderName.name.trim()) {
            return;
        }
        
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            const res = await axios.put(
                `${backendUrl}/api/folders/${editingFolderName.id}`,
                { name: editingFolderName.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (res.data.folder) {
                setFolders(prev => prev.map(folder => 
                    folder._id === editingFolderName.id 
                        ? { ...folder, name: editingFolderName.name } 
                        : folder
                ));
                
                setEditingFolderName({ id: null, name: '' });
                
                setNotification({
                    show: true,
                    message: 'Nombre de tablero actualizado',
                    type: 'success'
                });
                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error('Error al actualizar nombre de carpeta:', error);
            setNotification({
                show: true,
                message: 'Error al actualizar el nombre',
                type: 'error'
            });
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        }
    };

    // Cancelar edición de nombre
    const cancelEditFolderName = () => {
        setEditingFolderName({ id: null, name: '' });
    };

    // Función para manejar la selección de carpeta en el modal
    const handleSelectFolder = async () => {
        if (!selectedPost || !folderSelectRef.current) return;
        
        const selectedFolderId = folderSelectRef.current.value;
        if (!selectedFolderId) return;
        
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            setNotification({
                show: true,
                message: 'Moviendo la imagen al tablero...',
                type: 'info'
            });
            
            await axios.post(
                `${backendUrl}/api/folders/add`,
                { 
                    folderId: selectedFolderId, 
                    postId: selectedPost.postId || selectedPost._id,
                    imageUrl: selectedPost.mainImage || selectedPost.savedImage
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Obtener datos actualizados
            // Obtener posts guardados
            const postsRes = await axios.get(`${backendUrl}/api/users/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Obtener carpetas actualizadas
            const foldersRes = await axios.get(`${backendUrl}/api/folders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (postsRes.data.favorites && foldersRes.data.folders) {
                const allPosts = postsRes.data.favorites;
                const allFolders = foldersRes.data.folders;
                
                setSavedPosts(allPosts);
                setFolders(allFolders);
                
                // Filtrar solo los posts que no están en carpetas
                const unorganizedPosts = filterOrganizedPosts(allPosts, allFolders);
                setIdeasSinOrganizar(unorganizedPosts);
            }
            
            setNotification({
                show: true,
                message: 'Imagen movida correctamente',
                type: 'success'
            });
            
            setShowEditModal(false);
            setSelectedPost(null);
            
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        } catch (error) {
            console.error('Error al mover la imagen:', error);
            setNotification({
                show: true,
                message: 'Error al mover la imagen',
                type: 'error'
            });
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        }
    };

    return (
        <div className="guardados-container">
            <div className="guardados-header">
                <h1>Tus ideas guardadas</h1>
            </div>
            <div className="guardados-header-actions">
                <h2>Tus tableros</h2>
                <button
                    className="new-tablero-button"
                    onClick={() => setIsCreatingFolder(true)}
                >
                    <FaPlus /> Crear tablero
                </button>
            </div>

            <div className="tableros-container">
                {isCreatingFolder && (
                    <div className="create-tablero-form">
                        <input 
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Nombre del tablero"
                            className="tablero-name-input"
                        />
                        <div className="form-actions">
                            <button
                                className="confirm-button"
                                onClick={handleCreateFolder}
                                disabled={!newFolderName.trim()}
                            >
                                <FaCheck /> Crear
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => {
                                    setIsCreatingFolder(false);
                                    setNewFolderName('');
                                }}
                            >
                                <FaTimes /> Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <div className="tableros-grid">
                    {folders.map(folder => (
                        <div 
                            key={folder._id} 
                            className="tablero-item"
                            onClick={() => openFolderContent(folder._id)}
                        >
                            <div className="tablero-preview">
                                {folder.items && folder.items.length > 0 ? (
                                    <div className="tablero-images">
                                        {folder.items.slice(0, Math.min(4, folder.items.length)).map((item, index) => (
                                            <div key={index} className="tablero-image-container">
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt="" 
                                                    className="tablero-image"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-tablero">
                                        <FaFolder size={30} />
                                        <p>Tablero vacío</p>
                                    </div>
                                )}
                            </div>
                            <div className="tablero-info">
                                <h3>{folder.name}</h3>
                                <p>
                                    {folder.items ? folder.items.length : 0} {folder.items && folder.items.length === 1 ? 'imagen' : 'imágenes'}
                                </p>
                                <div className="tablero-actions">
                                    <button
                                        className="edit-tablero-button"
                                        onClick={(e) => startEditFolderName(folder, e)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="delete-tablero-button"
                                        onClick={(e) => confirmDeleteFolder(folder._id, e)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ideas sin organizar */}
            {ideasSinOrganizar.length > 0 && (
                <div className="ideas-sin-organizar">
                    <div className="ideas-header">
                        <h2>Ideas sin organizar</h2>
                        <button className="organizar-button">Organizar</button>
                    </div>
                    <div className="ideas-grid">
                        {ideasSinOrganizar.map(post => (
                            <div 
                                key={post._id} 
                                className="idea-item"
                                onClick={() => navigateToPost(post)}
                                onMouseEnter={() => setHoveredPost(`unorganized-${post._id}`)}
                                onMouseLeave={() => setHoveredPost(null)}
                            >
                                <img 
                                    src={post.mainImage || post.savedImage} 
                                    alt="Idea sin organizar" 
                                    className="idea-image"
                                />
                                {hoveredPost === `unorganized-${post._id}` && (
                                    <div className="idea-hover-actions">
                                        <button
                                            className="idea-edit-button"
                                            onClick={(e) => handleEditPost(post, e)}
                                        >
                                            <FaEdit /> Editar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal para editar post */}
            {showEditModal && selectedPost && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                        <h2>Editar este Post</h2>
                        <div className="modal-content">
                            <div className="modal-image">
                                <img 
                                    src={selectedPost.mainImage || selectedPost.savedImage} 
                                    alt="Imagen a editar" 
                                />
                            </div>
                            <div className="modal-form">
                                <div className="form-group">
                                    <label>Tablero</label>
                                    <select ref={folderSelectRef}>
                                        <option value="">Selecciona un tablero</option>
                                        {folders.map(folder => (
                                            <option key={folder._id} value={folder._id}>
                                                {folder.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button 
                                        className="modal-save-button"
                                        onClick={handleSelectFolder}
                                    >
                                        Guardar
                                    </button>
                                    <button 
                                        className="modal-cancel-button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedPost(null);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmar eliminación */}
            {showDeleteConfirm && (
                <div className="confirm-delete-overlay">
                    <div className="confirm-delete-modal">
                        <h3>¿Eliminar este tablero?</h3>
                        <p>Esta acción no se puede deshacer.</p>
                        <div className="confirm-actions">
                            <button 
                                className="confirm-delete-button"
                                onClick={() => handleDeleteFolder(folderToDelete)}
                            >
                                Eliminar
                            </button>
                            <button 
                                className="cancel-delete-button"
                                onClick={cancelDeleteFolder}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificación */}
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    <p>{notification.message}</p>
                </div>
            )}
        </div>
    );
};

export default Guardados;
