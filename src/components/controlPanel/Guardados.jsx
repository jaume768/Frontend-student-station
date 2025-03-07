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

    // Generamos alturas aleatorias para cada slot (placeholder)  [100..250 px]
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

    // Referencia para guardar el timeout del long press
    const pressTimer = useRef(null);
    // Bandera para saber si ya se ejecutó el long press
    const [longPressTriggered, setLongPressTriggered] = useState(false);

    // Al hacer "mousedown/touchstart" guardamos un timeout que activa el modo selección
    const handlePressDown = (post, slotIndex) => {
        // Si ya estamos en modo selección, no necesitamos long press
        if (isSelecting) return;

        setLongPressTriggered(false);
        pressTimer.current = setTimeout(() => {
            setLongPressTriggered(true);
            setIsSelecting(true); // Activamos el modo selección
            toggleSelectPost(post?._id); // Seleccionamos el post (si existe)
        }, LONG_PRESS_TIME);
    };

    // Al soltar el click/touch
    const handlePressUp = (post, slotIndex) => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
        // Si NO se disparó el long press y no estamos en modo selección => click normal
        if (!longPressTriggered && !isSelecting) {
            if (post?._id) {
                // Navegar al post
                navigate(`/ControlPanel/post/${post._id}`);
            }
        } else if (isSelecting && post?._id) {
            // Si ya estamos en modo selección, cada click/soltar togglea la selección
            toggleSelectPost(post._id);
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
                    <p>Selecciona tus fotos (mantén pulsado para selección múltiple)</p>

                    {/* Contenedor con efecto masonry (5 columnas) */}
                    <div className="guardados-masonry">
                        {Array.from({ length: totalSlots }).map((_, index) => {
                            // Si hay un post guardado para este "slot", lo mostramos
                            const post = index < savedPosts.length ? savedPosts[index] : null;
                            const isSelected = post && selectedPosts.includes(post._id);
                            const itemHeight = randomHeights[index];

                            return (
                                <div
                                    key={index}
                                    className={`guardados-masonry-item ${!post ? 'placeholder' : ''
                                        } ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        // Si es placeholder, le damos altura aleatoria
                                        height: post ? 'auto' : `${itemHeight}px`,
                                    }}
                                    onMouseDown={() => handlePressDown(post, index)}
                                    onMouseUp={() => handlePressUp(post, index)}
                                    onMouseLeave={() => {
                                        // Si el ratón sale antes de soltar, cancela el long press
                                        if (pressTimer.current) {
                                            clearTimeout(pressTimer.current);
                                            pressTimer.current = null;
                                        }
                                    }}
                                    onTouchStart={() => handlePressDown(post, index)}
                                    onTouchEnd={() => handlePressUp(post, index)}
                                >
                                    {post ? (
                                        <img
                                            src={post.mainImage}
                                            alt={`Post guardado ${index + 1}`}
                                            className="guardados-masonry-img"
                                        />
                                    ) : (
                                        // Placeholder vacío
                                        <></>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {isSelecting && (
                        <div style={{ marginTop: '1rem' }}>
                            <button onClick={handleMoveToFolder}>
                                Mover {selectedPosts.length} imágenes a una carpeta
                            </button>
                            <button
                                style={{ marginLeft: '1rem' }}
                                onClick={() => {
                                    setIsSelecting(false);
                                    setSelectedPosts([]);
                                }}
                            >
                                Cancelar selección
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
