import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaPencilAlt, FaTimes, FaCheck } from 'react-icons/fa';
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
                navigate(`/ControlPanel/post/${post._id}`);
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
        } catch (error) {
            console.error('Error al eliminar carpeta:', error);
        }
    };

    // Guardar posts seleccionados en la carpeta
    const handleSaveToFolder = async () => {
        if (!selectedFolder || selectedPosts.length === 0) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            // Para cada post seleccionado, llamamos al endpoint para añadirlo a la carpeta
            const promises = selectedPosts.map(postId =>
                axios.post(
                    `${backendUrl}/api/folders/add`,
                    { folderId: selectedFolder, postId },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            );

            await Promise.all(promises);

            // Actualizamos la lista de carpetas para reflejar los cambios
            const res = await axios.get(`${backendUrl}/api/folders`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.folders) {
                setFolders(res.data.folders);
            }

            // Limpiamos la selección
            setSelectedPosts([]);
            setIsSelecting(false);
        } catch (error) {
            console.error('Error al guardar en carpeta:', error);
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
                            className="folder-action-button"
                            onClick={() => setIsEditingFolders(!isEditingFolders)}
                        >
                            <FaPencilAlt /> Editar
                        </button>
                    </div>
                </div>
                <p>
                    Personaliza tus carpetas y organiza tu contenido guardado de la forma que más te guste
                </p>

                {isCreatingFolder && (
                    <div className="new-folder-form">
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Nombre de la carpeta"
                        />
                        <div className="new-folder-actions">
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

                <div className="folder-list">
                    {isEditingFolders ? (
                        // Modo edición: mostrar botones para eliminar carpetas
                        folders.map(folder => (
                            <div key={folder._id} className="folder-card editing">
                                <p>{folder.name}</p>
                                <button
                                    className="delete-folder-button"
                                    onClick={() => handleDeleteFolder(folder._id)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))
                    ) : (
                        // Modo normal: mostrar carpetas sin acciones
                        folders.map(folder => (
                            <div
                                key={folder._id}
                                className={`folder-card ${selectedFolder === folder._id ? 'selected' : ''}`}
                                onClick={() => setSelectedFolder(folder._id)}
                            >
                                <p>{folder.name}</p>
                                <span className="folder-count">{folder.posts?.length || 0} fotos</span>
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
        </div>
    );
};

export default Guardados;