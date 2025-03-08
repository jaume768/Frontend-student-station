import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Guardados.css';

const LONG_PRESS_TIME = 600; // milisegundos para considerar "long press"

const Guardados = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false); // Modo selección activo
    const [selectedPosts, setSelectedPosts] = useState([]); // IDs de posts seleccionados
    const [longPressTriggered, setLongPressTriggered] = useState(false);

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

    // Si se quitan todas las selecciones, salimos del modo selección
    useEffect(() => {
        if (selectedPosts.length === 0) {
            setIsSelecting(false);
        }
    }, [selectedPosts]);

    // -------- LÓGICA DE PULSACIÓN LARGA (para iniciar selección) --------
    const handlePressDown = (post) => {
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
        // Se suelta el ratón/touch => cancelamos el timer
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
        // Aquí no hacemos nada más, el short press se maneja en handleClick
    };

    // -------- LÓGICA DE PULSACIÓN CORTA (click) --------
    const handleClick = (post) => {
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
            // Si NO estamos en modo selección, abrimos el post
            if (post?._id) {
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
                                    onClick={() => handleClick(post)}
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
