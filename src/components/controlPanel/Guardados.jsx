import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Guardados.css';

const Guardados = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const navigate = useNavigate();

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

    const totalSlots = 15;

    const handleClickPost = (postId) => {
        navigate(`/ControlPanel/post/${postId}`);
    };

    return (
        <div className="guardados-container">
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
                    <p>Selecciona tus fotos</p>

                    {/* Contenedor con efecto masonry (5 columnas) */}
                    <div className="guardados-masonry">
                        {Array.from({ length: totalSlots }).map((_, index) => {
                            // Si hay un post guardado para este "slot", lo mostramos
                            if (index < savedPosts.length) {
                                const post = savedPosts[index];
                                return (
                                    <div
                                        key={index}
                                        className="guardados-masonry-item"
                                        onClick={() => handleClickPost(post._id)}
                                    >
                                        <img
                                            src={post.mainImage}
                                            alt={`Post guardado ${index + 1}`}
                                            className="guardados-masonry-img"
                                        />
                                    </div>
                                );
                            } else {
                                // Si no hay más posts, dejamos un placeholder
                                return (
                                    <div
                                        key={index}
                                        className="guardados-masonry-item placeholder"
                                    />
                                );
                            }
                        })}
                    </div>
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
                    {/* {folders.map(folder => (
              <div key={folder._id} className="folder-card">
                <p>{folder.name}</p>
              </div>
          ))} */}
                </div>
            </div>
        </div>
    );
};

export default Guardados;
