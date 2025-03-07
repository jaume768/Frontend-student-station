// src/components/controlPanel/Guardados.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Guardados.css'; // Importa el CSS que crearemos a continuación

const Guardados = () => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);

    // Ejemplo de posts/fotos guardadas (puedes adaptarlo a tu backend real)
    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        // Aquí podrías llamar a tu backend para traer las carpetas del usuario
        // y los posts guardados. Ejemplo:
        // axios.get('/api/folders')
        //   .then(res => setFolders(res.data.folders))
        //   .catch(err => console.error(err));

        // axios.get('/api/users/favorites')
        //   .then(res => setSavedPosts(res.data.favorites))
        //   .catch(err => console.error(err));
    }, []);

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
                    <p>Selecciona tus fotos</p>
                    {/* Grid de placeholders, imitando el estilo de MiPerfil */}
                    <div className="guardados-photos-grid">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="guardados-photo-placeholder" />
                        ))}
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
                    {/* Ejemplo de carpeta principal */}
                    <div className="folder-card">
                        <p>Carpeta principal</p>
                    </div>
                    {/* Podrías mapear tus carpetas reales aquí */}
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
