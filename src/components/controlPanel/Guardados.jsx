import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Guardados.css';

const LONG_PRESS_TIME = 600; // milisegundos para considerar "long press"

const Guardados = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false); // Modo selección activo
    const [selectedPosts, setSelectedPosts] = useState([]); // IDs de posts seleccionados

    const navigate = useNavigate();
    const totalSlots = 15;

    // Generamos alturas aleatorias para cada slot (placeholder) [100..250 px]
    const randomHeights = useMemo(() => {
        return Array.from({ length: totalSlots }).map(
            () => Math.floor(100 + Math.random() * 150)
        );
    }, [totalSlots]);

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

    // Si se quitan todas las selecciones, salimos del modo selección
    useEffect(() => {
        if (selectedPosts.length === 0) {
            setIsSelecting(false);
        }
    }, [selectedPosts]);

    // Referencia para guardar el timeout del long press
    const pressTimer = useRef(null);
    // Bandera para saber si ya se ejecutó el long press
    const [longPressTriggered, setLongPressTriggered] = useState(false);

    // Manejo unificado de pulsación (tanto en desktop como en móvil):
    // 1) onMouseDown / onTouchStart -> iniciar timer para long press
    // 2) onMouseUp / onTouchEnd -> según si se disparó el long press o no, abrir o seleccionar
    const handlePressDown = (post) => {
        // Si ya estás en modo selección, no necesitas long press para añadir más
        if (isSelecting) return;

        setLongPressTriggered(false);
        pressTimer.current = setTimeout(() => {
            // Si pasa el LONG_PRESS_TIME sin soltar, se activa modo selección
            setLongPressTriggered(true);
            setIsSelecting(true);
            toggleSelectPost(post?._id);
        }, LONG_PRESS_TIME);
    };

    const handlePressUp = (post) => {
        // Cancelamos el timer del long press
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
        // Si NO hubo long press y no estamos en modo selección => abrir el post
        if (!longPressTriggered && !isSelecting) {
            if (post?._id) {
                navigate(`/ControlPanel/post/${post._id}`);
            }
        }
        // Si SÍ estamos en modo selección y NO fue long press (caso: clic corto en modo selección)
        else if (isSelecting && !longPressTriggered && post?._id) {
            toggleSelectPost(post._id);
        }
        setLongPressTriggered(false);
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

    // Ejemplo de handle para “finalizar selección” y mover a carpeta
    const handleMoveToFolder = () => {
        console.log('Mover estos posts a carpeta:', selectedPosts);
        // Lógica de tu backend para mover a carpeta
        // ...
        // Al terminar, limpiamos la selección
        setIsSelecting(false);
        setSelectedPosts([]);
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
                    <div className="guardados-folders-options">
                        <button>Otra carpeta</button>
                        <button>Añadir otra carpeta</button>
                        <button>Más carpetas</button>
                    </div>
                </div>

                <div className="guardados-step">
                    <h3>Paso 2</h3>
                    <p>
                        Mantén pulsado para iniciar la selección (pulsación corta abre el post)
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
                                    className={`guardados-masonry-item ${!post ? 'placeholder' : ''} ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        height: post ? 'auto' : `${itemHeight}px`,
                                    }}
                                    onContextMenu={(e) => e.preventDefault()} // Evita menú contextual en móviles
                                    onMouseDown={() => handlePressDown(post)}
                                    onMouseUp={() => handlePressUp(post)}
                                    onMouseLeave={() => {
                                        if (pressTimer.current) {
                                            clearTimeout(pressTimer.current);
                                            pressTimer.current = null;
                                        }
                                    }}
                                    onTouchStart={() => handlePressDown(post)}
                                    onTouchEnd={() => handlePressUp(post)}
                                >
                                    {post ? (
                                        <img
                                            src={post.mainImage}
                                            alt={`Post guardado ${index + 1}`}
                                            className="guardados-masonry-img"
                                        />
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>

                    {isSelecting && (
                        <div style={{ marginTop: '1rem' }}>
                            <button onClick={handleMoveToFolder}>
                                Mover {selectedPosts.length} imágenes a una carpeta
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Columna Derecha */}
            <div className="guardados-right">
                <h2>Tus carpetas</h2>
                <p>
                    Personaliza tus carpetas y organiza tu contenido guardado de la forma que más te guste
                </p>
                <div className="guardados-main-folder">
                    <div className="folder-card">
                        <p>Carpeta principal</p>
                    </div>
                    {/* Aquí podrías mapear tus carpetas reales si lo deseas */}
                </div>
            </div>
        </div>
    );
};

export default Guardados;
