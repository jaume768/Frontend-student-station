import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaPencilAlt, FaTimes, FaCheck, FaFolder } from 'react-icons/fa';
import './css/Guardados.css';

const LONG_PRESS_TIME = 500; // milisegundos para considerar "long press"

const Guardados = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false); // Modo selección activo
    const [selectedPosts, setSelectedPosts] = useState([]); // IDs de posts seleccionados
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [isEditingFolders, setIsEditingFolders] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [clickStarted, setClickStarted] = useState(false); // Para controlar el inicio del click
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);
    const [editingFolderName, setEditingFolderName] = useState({ id: null, name: '' });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const navigate = useNavigate();
    const totalSlots = 15;
    const pressTimer = useRef(null); // Referencia para el timeout del long press

    // Generamos alturas aleatorias para cada slot (placeholder) [100..250 px]
    const randomHeights = useMemo(() => {
        return Array.from({ length: totalSlots }).map(
            () => Math.floor(100 + Math.random() * 150)
        );
    }, [totalSlots]);

    // Cargamos los posts guardados
    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/users/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.favorites) {
                    setSavedPosts(res.data.favorites);
                }
            } catch (error) {
                console.error('Error fetching saved posts:', error);
            }
        };
        fetchSavedPosts();
    }, []);

    // Cargamos las carpetas del usuario
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/folders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.folders) {
                    setFolders(res.data.folders);
                    // Establecer la carpeta "principal" como seleccionada por defecto si existe
                    const mainFolder = res.data.folders.find(folder => folder.name === 'Carpeta principal');
                    if (mainFolder) {
                        setSelectedFolder(mainFolder._id);
                    }
                }
            } catch (error) {
                console.error('Error fetching folders:', error);
            }
        };
        fetchFolders();
    }, []);

    // Si se quitan todas las selecciones, salimos del modo selección
    useEffect(() => {
        if (selectedPosts.length === 0) {
            setIsSelecting(false);
        }
    }, [selectedPosts]);

    // -------- LÓGICA DE PULSACIÓN LARGA (para iniciar selección) --------
    const handlePressDown = (post) => {
        if (!post) return;

        // Marcamos que el click ha iniciado
        setClickStarted(true);

        // Si ya estamos en modo selección, no necesitamos otro long press
        if (isSelecting) return;

        setLongPressTriggered(false); // Resetea la bandera
        pressTimer.current = setTimeout(() => {
            // Si pasan LONG_PRESS_TIME ms sin soltar, se activa modo selección
            setLongPressTriggered(true);
            setIsSelecting(true);
            toggleSelectPost(post?._id);
        }, LONG_PRESS_TIME);
    };

    const handlePressUp = () => {
        // Marcamos que el click ha terminado
        setClickStarted(false);

        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    };

    // -------- LÓGICA DE PULSACIÓN CORTA (click) --------
    const handleClick = (post) => {
        if (!post) return;

        // Si acaba de dispararse un long press, ignoramos el click para no duplicar acciones
        if (longPressTriggered) {
            // Reset para siguientes pulsaciones
            setLongPressTriggered(false);
            return;
        }

        // Si estamos en modo selección, togglear el post
        if (isSelecting) {
            toggleSelectPost(post?._id);
        } else {
            // Si NO estamos en modo selección y NO fue un long press, abrimos el post
            if (post?._id && !longPressTriggered) {
                // Usar postId si existe, sino usar _id (para compatibilidad con datos antiguos)
                const postIdToNavigate = post.postId || post._id;
                navigate(`/ControlPanel/post/${postIdToNavigate}`);
            }
        }
    };

    // Alterna el ID en la lista de seleccionados
    const toggleSelectPost = (postId) => {
        if (!postId) return;
        setSelectedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    // Crear nueva carpeta
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const res = await axios.post(
                `${backendUrl}/api/folders`,
                { name: newFolderName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.folder) {
                setFolders(prev => [...prev, res.data.folder]);
                setNewFolderName('');
                setIsCreatingFolder(false);
            }
        } catch (error) {
            console.error('Error al crear carpeta:', error);
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
            if (selectedFolder === folderId) {
                setSelectedFolder(null);
            }
            
            // Resetear estados
            setShowDeleteConfirm(false);
            setFolderToDelete(null);
        } catch (error) {
            console.error('Error al eliminar carpeta:', error);
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
                // Actualizar el folder en el estado local
                setFolders(prev => prev.map(folder => 
                    folder._id === editingFolderName.id 
                        ? { ...folder, name: editingFolderName.name } 
                        : folder
                ));
                
                // Resetear el estado de edición
                setEditingFolderName({ id: null, name: '' });
            }
        } catch (error) {
            console.error('Error al actualizar nombre de carpeta:', error);
        }
    };

    // Cancelar edición de nombre
    const cancelEditFolderName = () => {
        setEditingFolderName({ id: null, name: '' });
    };

    // Guardar posts seleccionados en la carpeta
    const handleSaveToFolder = async () => {
        if (!selectedFolder || selectedPosts.length === 0) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            // Para cada post seleccionado, llamamos al endpoint para añadirlo a la carpeta
            const promises = selectedPosts.map(postId => {
                // Buscar el post completo para obtener su información
                const post = savedPosts.find(p => p._id === postId);
                
                return axios.post(
                    `${backendUrl}/api/folders/add`,
                    { 
                        folderId: selectedFolder, 
                        postId: post.postId || post._id,
                        imageUrl: post.mainImage
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            });

            const results = await Promise.all(promises);
            
            // Mostrar notificación de éxito
            setNotification({
                show: true,
                message: 'Imágenes movidas a la carpeta',
                type: 'success'
            });
            
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);

            // Actualizamos la lista de carpetas para reflejar los cambios
            const res = await axios.get(`${backendUrl}/api/folders`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.folders) {
                setFolders(res.data.folders);
            }
            
            // Actualizamos la lista de posts guardados (ya que se eliminaron de favoritos)
            const favRes = await axios.get(`${backendUrl}/api/users/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (favRes.data.favorites) {
                setSavedPosts(favRes.data.favorites);
            }

            // Limpiamos la selección
            setSelectedPosts([]);
            setIsSelecting(false);
        } catch (error) {
            console.error('Error al guardar en carpeta:', error);
            setNotification({
                show: true,
                message: 'Error al mover las imágenes',
                type: 'error'
            });
            
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        }
    };

    // Para ver el contenido completo de la carpeta
    const openFolderContent = (folderId) => {
        if (!isEditingFolders) {
            navigate(`/ControlPanel/guardados/folder/${folderId}`);
        }
    };

    return (
        <div className="guardados-container">
            {/* Columna Izquierda */}
            <div className="guardados-left">
                <h2>Ordena tus fotos</h2>
                <p>
                    Guarda tus fotos favoritas desde el explorador y organízalas en tus carpetas personalizadas.
                    Selecciona las imágenes y elige las carpetas donde deseas guardarlas.
                </p>

                <div className="guardados-step">
                    <h3>Paso 1</h3>
                    <p>Selecciona la carpeta donde deseas guardar fotos</p>
                    <div className="guardados-folders-tags">
                        {folders.length > 0 ? (
                            folders.map(folder => (
                                <div
                                    key={folder._id}
                                    className={`folder-tag ${selectedFolder === folder._id ? 'selected' : ''}`}
                                    onClick={() => setSelectedFolder(folder._id)}
                                >
                                    {folder.name}
                                </div>
                            ))
                        ) : (
                            <p className="no-folders-message">No tienes carpetas creadas. Crea una para comenzar.</p>
                        )}
                    </div>
                </div>

                <div className="guardados-step">
                    <h3>Paso 2</h3>
                    <p>
                        - Mantén pulsado para iniciar la selección.
                        <br />
                        - Una vez en selección, toca/clic en otras imágenes para (de)seleccionarlas.
                    </p>

                    {/* Contenedor con efecto masonry (5 columnas en desktop, menos en móvil) */}
                    <div className="guardados-masonry">
                        {Array.from({ length: totalSlots }).map((_, index) => {
                            const post = index < savedPosts.length ? savedPosts[index] : null;
                            const isSelected = post && selectedPosts.includes(post._id);
                            const itemHeight = randomHeights[index];

                            return (
                                <div
                                    key={index}
                                    className={`guardados-masonry-item 
                                        ${!post ? 'placeholder' : ''} 
                                        ${isSelected ? 'selected' : ''}`
                                    }
                                    style={{
                                        height: post ? 'auto' : `${itemHeight}px`,
                                    }}
                                    onContextMenu={(e) => e.preventDefault()} // Evita menú contextual en móviles
                                    onMouseDown={() => handlePressDown(post)}
                                    onMouseUp={() => handlePressUp()}
                                    onMouseLeave={() => {
                                        // Si el mouse sale, cancelamos el timeout
                                        if (pressTimer.current) {
                                            clearTimeout(pressTimer.current);
                                            pressTimer.current = null;
                                        }
                                    }}
                                    onTouchStart={() => handlePressDown(post)}
                                    onTouchEnd={() => handlePressUp()}
                                    onClick={() => {
                                        // Solo procesamos el click si no estamos en modo selección
                                        // o si estamos en modo selección pero no viene de un long press
                                        // Esto evita que se deseleccione en desktop
                                        if (!isSelecting || !clickStarted) {
                                            handleClick(post);
                                        }
                                    }}
                                >
                                    {post ? (
                                        <img
                                            src={post.mainImage}
                                            alt={`Post guardado ${index + 1}`}
                                            className="guardados-masonry-img"
                                            draggable={false} // Evitar arrastrar las imágenes
                                        />
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>

                    {isSelecting && selectedPosts.length > 0 && selectedFolder && (
                        <div className="save-to-folder-button-container">
                            <button
                                className="save-to-folder-button"
                                onClick={handleSaveToFolder}
                            >
                                Guardar {selectedPosts.length} {selectedPosts.length === 1 ? 'imagen' : 'imágenes'} en esta carpeta
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Columna Derecha */}
            <div className="guardados-right">
                <div className="folder-header">
                    <h2>Tus carpetas</h2>
                    <div className="folder-actions">
                        <button
                            className="folder-action-button"
                            onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                        >
                            <FaPlus /> Nueva carpeta
                        </button>
                        <button
                            className={`folder-action-button ${isEditingFolders ? 'active' : ''}`}
                            onClick={() => setIsEditingFolders(!isEditingFolders)}
                        >
                            <FaPencilAlt /> {isEditingFolders ? 'Terminar' : 'Editar'}
                        </button>
                    </div>
                </div>
                <p>
                    Personaliza tus carpetas y organiza tu contenido guardado de la forma que más te guste
                </p>

                {isCreatingFolder && (
                    <div className="folder-form">
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Nombre de la carpeta"
                            className="folder-name-input"
                        />
                        <div className="folder-form-actions">
                            <button
                                className="folder-form-button confirm"
                                onClick={handleCreateFolder}
                                disabled={!newFolderName.trim()}
                            >
                                <FaCheck /> Crear
                            </button>
                            <button
                                className="folder-form-button cancel"
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

                <div className="folder-list">
                    {isEditingFolders ? (
                        // Modo edición: mostrar botones para eliminar carpetas
                        folders.map(folder => (
                            <div key={folder._id} className="folder-card editing">
                                {editingFolderName.id === folder._id ? (
                                    <form onSubmit={updateFolderName} className="edit-folder-form">
                                        <input
                                            type="text"
                                            value={editingFolderName.name}
                                            onChange={(e) => setEditingFolderName({
                                                ...editingFolderName,
                                                name: e.target.value
                                            })}
                                            autoFocus
                                            className="edit-folder-input"
                                        />
                                        <div className="edit-folder-actions">
                                            <button type="submit" className="edit-folder-button save">
                                                <FaCheck />
                                            </button>
                                            <button 
                                                type="button" 
                                                className="edit-folder-button cancel"
                                                onClick={cancelEditFolderName}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <p>{folder.name}</p>
                                        <div className="folder-edit-actions">
                                            <button
                                                className="folder-edit-button rename"
                                                onClick={(e) => startEditFolderName(folder, e)}
                                                title="Renombrar carpeta"
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                className="folder-edit-button delete"
                                                onClick={(e) => confirmDeleteFolder(folder._id, e)}
                                                title="Eliminar carpeta"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        // Modo normal: mostrar carpetas con miniaturas de posts
                        folders.map(folder => (
                            <div
                                key={folder._id}
                                className={`folder-card ${selectedFolder === folder._id ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedFolder(folder._id);
                                    openFolderContent(folder._id);
                                }}
                            >
                                <div className="folder-thumbnail-container">
                                    {folder.items && folder.items.length > 0 ? (
                                        <>
                                            {/* Mostrar hasta 4 miniaturas de posts en un grid */}
                                            <div className="folder-thumbnails-grid">
                                                {folder.items.slice(0, Math.min(4, folder.items.length)).map((item, index) => (
                                                    <div
                                                        key={`${item.postId}-${item.imageUrl}`}
                                                        className={`folder-thumbnail thumbnail-${Math.min(4, folder.items.length)}`}
                                                    >
                                                        <img
                                                            src={item.imageUrl}
                                                            alt=""
                                                            className="folder-thumbnail-img"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        // Placeholder para carpetas vacías
                                        <div className="folder-placeholder">
                                            <div className="folder-placeholder-icon">
                                                <FaFolder size={30} />
                                            </div>
                                            <p>Carpeta vacía</p>
                                        </div>
                                    )}
                                </div>
                                <div className="folder-info">
                                    <p className="folder-name">{folder.name}</p>
                                    <p className="folder-count">
                                        {folder.items ? folder.items.length : 0} {folder.items && folder.items.length === 1 ? 'imagen' : 'imágenes'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isEditingFolders && (
                    <button
                        className="done-editing-button"
                        onClick={() => setIsEditingFolders(false)}
                    >
                        <FaCheck /> Finalizar edición
                    </button>
                )}
            </div>

            {/* Diálogo de confirmación para eliminar carpeta */}
            {showDeleteConfirm && (
                <div className="delete-confirmation-overlay">
                    <div className="delete-confirmation-modal">
                        <h3>¿Eliminar carpeta?</h3>
                        <p>Esta acción no se puede deshacer. Los posts guardados en esta carpeta no se eliminarán, pero ya no estarán organizados en esta carpeta.</p>
                        <div className="confirmation-buttons">
                            <button 
                                className="confirm-button delete" 
                                onClick={() => handleDeleteFolder(folderToDelete)}
                            >
                                Eliminar
                            </button>
                            <button 
                                className="cancel-button" 
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