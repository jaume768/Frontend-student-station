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
    
    // Estados para la multiselección
    const [selectedImages, setSelectedImages] = useState([]);
    const [showOrganizeModal, setShowOrganizeModal] = useState(false);
    const [showSelectFolderModal, setShowSelectFolderModal] = useState(false);

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
    
    // Función para manejar la selección de imágenes en el modal
    const handleImageSelection = (post) => {
        if (selectedImages.some(img => img._id === post._id)) {
            // Si ya está seleccionada, la quitamos de la selección
            setSelectedImages(prev => prev.filter(img => img._id !== post._id));
        } else {
            // Si no está seleccionada, la añadimos a la selección
            setSelectedImages(prev => [...prev, post]);
        }
    };
    
    // Función para abrir el modal de organización
    const openOrganizeModal = () => {
        setSelectedImages([]);
        setShowOrganizeModal(true);
    };
    
    // Función para cerrar el modal de organización
    const closeOrganizeModal = () => {
        setShowOrganizeModal(false);
        setSelectedImages([]);
    };
    
    // Función para abrir el modal de selección de tablero
    const openSelectFolderModal = () => {
        if (selectedImages.length > 0) {
            setShowSelectFolderModal(true);
        } else {
            setNotification({
                show: true,
                message: 'Selecciona al menos una imagen',
                type: 'error'
            });
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        }
    };
    
    // Función para mover las imágenes seleccionadas a un tablero
    const moveSelectedImagesToFolder = async (folderId) => {
        if (!folderId || selectedImages.length === 0) return;
        
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            setNotification({
                show: true,
                message: 'Moviendo imágenes...',
                type: 'info'
            });
            
            // Mover cada imagen seleccionada al tablero
            for (const image of selectedImages) {
                const imageUrl = image.imageUrl || image.savedImage || image.mainImage;
                await axios.post(
                    `${backendUrl}/api/folders/add`,
                    { 
                        folderId: folderId, 
                        postId: image.postId || image._id,
                        imageUrl: imageUrl
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            
            // Actualizar los datos
            const savedImagesRes = await axios.get(`${backendUrl}/api/users/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            const foldersRes = await axios.get(`${backendUrl}/api/folders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (savedImagesRes.data.favorites && foldersRes.data.folders) {
                const allSavedImages = savedImagesRes.data.favorites;
                const allFolders = foldersRes.data.folders;
                
                // Procesar imágenes
                const processedImages = allSavedImages.map(item => {
                    if (!item.imageUrl && (item.savedImage || item.mainImage)) {
                        return {
                            ...item,
                            imageUrl: item.savedImage || item.mainImage
                        };
                    }
                    return item;
                });
                
                setSavedPosts(processedImages);
                setFolders(allFolders);
                
                // Filtrar imágenes no organizadas
                const unorganizedImages = filterOrganizedImages(processedImages, allFolders);
                setIdeasSinOrganizar(unorganizedImages);
            }
            
            setNotification({
                show: true,
                message: `${selectedImages.length} ${selectedImages.length === 1 ? 'imagen movida' : 'imágenes movidas'} correctamente`,
                type: 'success'
            });
            
            // Cerrar los modales
            setShowSelectFolderModal(false);
            setShowOrganizeModal(false);
            setSelectedImages([]);
            
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        } catch (error) {
            console.error('Error al mover imágenes:', error);
            setNotification({
                show: true,
                message: 'Error al mover las imágenes',
                type: 'error'
            });
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        }
    };
    
    // Función para abrir el contenido de una carpeta/tablero
    const openFolderContent = (folderId) => {
        navigate(`/ControlPanel/guardados/folder/${folderId}`);
    };

    // Función para filtrar imágenes que ya están en carpetas
    const filterOrganizedImages = (allSavedImages, allFolders) => {
        // Crear un conjunto con todas las URLs de imágenes que están en carpetas
        const organizedImageUrls = new Set();
        
        allFolders.forEach(folder => {
            if (folder.items && folder.items.length > 0) {
                folder.items.forEach(item => {
                    if (item.imageUrl) {
                        organizedImageUrls.add(item.imageUrl);
                    }
                });
            }
        });
        
        // Filtrar las imágenes que NO están en carpetas
        return allSavedImages.filter(image => {
            const imageUrl = image.savedImage || image.mainImage || (image.imageUrl ? image.imageUrl : null);
            return imageUrl && !organizedImageUrls.has(imageUrl);
        });
    };

    // Cargamos los datos (imágenes guardadas y carpetas)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                // Obtener imágenes guardadas
                const savedImagesRes = await axios.get(`${backendUrl}/api/users/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                // Obtener carpetas
                const foldersRes = await axios.get(`${backendUrl}/api/folders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (savedImagesRes.data.favorites && foldersRes.data.folders) {
                    const allSavedImages = savedImagesRes.data.favorites;
                    const allFolders = foldersRes.data.folders;
                    
                    // Asegurarse de que cada imagen tenga la propiedad imageUrl
                    const processedImages = allSavedImages.map(item => {
                        // Si ya tiene imageUrl específica guardada, usarla
                        if (!item.imageUrl && (item.savedImage || item.mainImage)) {
                            return {
                                ...item,
                                imageUrl: item.savedImage || item.mainImage
                            };
                        }
                        return item;
                    });
                    
                    setSavedPosts(processedImages);
                    setFolders(allFolders);
                    
                    // Filtrar solo las imágenes que no están en carpetas
                    const unorganizedImages = filterOrganizedImages(processedImages, allFolders);
                    setIdeasSinOrganizar(unorganizedImages);
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
            
            // Cerrar el modal
            setShowEditModal(false);
            
            setNotification({
                show: true,
                message: 'Moviendo la imagen al tablero...',
                type: 'info'
            });
            
            // Obtener la URL de la imagen específica
            const imageUrl = selectedPost.imageUrl || selectedPost.savedImage || selectedPost.mainImage;
            
            await axios.post(
                `${backendUrl}/api/folders/add`,
                { 
                    folderId: selectedFolderId, 
                    postId: selectedPost.postId || selectedPost._id,
                    imageUrl: imageUrl
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Obtener datos actualizados
            // Obtener imágenes guardadas
            const savedImagesRes = await axios.get(`${backendUrl}/api/users/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Obtener carpetas actualizadas
            const foldersRes = await axios.get(`${backendUrl}/api/folders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (savedImagesRes.data.favorites && foldersRes.data.folders) {
                const allSavedImages = savedImagesRes.data.favorites;
                const allFolders = foldersRes.data.folders;
                
                // Asegurarse de que cada imagen tenga la propiedad imageUrl
                const processedImages = allSavedImages.map(item => {
                    // Si ya tiene imageUrl específica guardada, usarla
                    if (!item.imageUrl && (item.savedImage || item.mainImage)) {
                        return {
                            ...item,
                            imageUrl: item.savedImage || item.mainImage
                        };
                    }
                    return item;
                });
                
                setSavedPosts(processedImages);
                setFolders(allFolders);
                
                // Filtrar solo las imágenes que no están en carpetas
                const unorganizedImages = filterOrganizedImages(processedImages, allFolders);
                setIdeasSinOrganizar(unorganizedImages);
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
                        <button 
                            className="organizar-button"
                            onClick={openOrganizeModal}
                        >
                            Organizar
                        </button>
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
                                    src={post.imageUrl || post.savedImage || post.mainImage} 
                                    alt="Idea sin organizar" 
                                    className="idea-image"
                                />
                                <button
                                    className="idea-edit-button"
                                    onClick={(e) => handleEditPost(post, e)}
                                >
                                    <FaPencilAlt />
                                </button>
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

            {/* Modal de organización */}
            {showOrganizeModal && (
                <div className="organize-modal-overlay">
                    <div className="organize-modal">
                        <div className="organize-modal-header">
                            <h2>Organizar imágenes</h2>
                            <button 
                                className="close-modal-button"
                                onClick={closeOrganizeModal}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="organize-modal-content">
                            <p className="organize-instructions">Selecciona las imágenes que quieres organizar</p>
                            
                            <div className="organize-images-grid">
                                {ideasSinOrganizar.map(post => (
                                    <div 
                                        key={post._id} 
                                        className={`organize-image-item ${selectedImages.some(img => img._id === post._id) ? 'selected' : ''}`}
                                        onClick={() => handleImageSelection(post)}
                                    >
                                        <img 
                                            src={post.imageUrl || post.savedImage || post.mainImage} 
                                            alt="Idea sin organizar" 
                                            className="organize-image"
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="organize-modal-footer">
                                <div className="selected-count">
                                    {selectedImages.length} seleccionado{selectedImages.length !== 1 ? 's' : ''}
                                </div>
                                <div className="organize-modal-actions">
                                    <button 
                                        className="cancel-button"
                                        onClick={closeOrganizeModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        className="next-button"
                                        onClick={openSelectFolderModal}
                                        disabled={selectedImages.length === 0}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de selección de tablero */}
            {showSelectFolderModal && (
                <div className="folder-select-modal-overlay">
                    <div className="folder-select-modal">
                        <div className="folder-select-modal-header">
                            <h2>{selectedImages.length} seleccionado{selectedImages.length !== 1 ? 's' : ''}</h2>
                            <button 
                                className="close-modal-button"
                                onClick={() => setShowSelectFolderModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="selected-images-preview">
                            {selectedImages.map(image => (
                                <div key={image._id} className="selected-image-preview">
                                    <img 
                                        src={image.imageUrl || image.savedImage || image.mainImage} 
                                        alt="Imagen seleccionada" 
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <div className="folder-selection">
                            <h3>Guardar en tablero</h3>
                            <select className="folder-select" defaultValue="">
                                <option value="" disabled>Selecciona un tablero</option>
                                {folders.map(folder => (
                                    <option key={folder._id} value={folder._id}>
                                        {folder.name}
                                    </option>
                                ))}
                            </select>
                            
                            <div className="folder-select-modal-actions">
                                <button 
                                    className="cancel-button"
                                    onClick={() => setShowSelectFolderModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className="confirm-button"
                                    onClick={() => {
                                        const select = document.querySelector('.folder-select');
                                        if (select && select.value) {
                                            moveSelectedImagesToFolder(select.value);
                                        } else {
                                            setNotification({
                                                show: true,
                                                message: 'Selecciona un tablero',
                                                type: 'error'
                                            });
                                            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
                                        }
                                    }}
                                >
                                    Guardar
                                </button>
                            </div>
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
