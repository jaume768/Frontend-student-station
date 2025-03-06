import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPost.css';

const UserPost = ({ post }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!post) return <div>No hay datos de la publicación</div>;

    const images = post.images || [];
    const mainImage = images[currentImageIndex] || '';

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    // Funciones para las opciones de guardar y compartir (se pueden ampliar)
    const handleSave = (e) => {
        e.stopPropagation();
        console.log('Guardar post', post._id);
        // Aquí iría la lógica para guardar el post
    };

    const handleShare = (e) => {
        e.stopPropagation();
        console.log('Compartir post', post._id);
        // Aquí iría la lógica para compartir el post
    };

    return (
        <div className="perfil">
            <header className="perfil__header">
                <button className="perfil__volver" onClick={() => navigate(-1)}>
                    <img src="/multimedia/flecha_atras.svg" alt="Volver" />
                    <p>Volver</p>
                </button>
            </header>
            <section className="perfil__contenido">
                <div className="perfil__imagenes">
                    <div className="perfil__imagen">
                        <button className="anterior" onClick={handlePrevious}>
                            <img src="/multimedia/flecha_drc.svg" alt="Anterior" />
                        </button>
                        <img
                            src={mainImage}
                            alt="Imagen principal"
                            className="perfil__imagen-principal"
                        />
                        <div className="options">
                            <button className="save-button" onClick={handleSave}>
                                <img src="/multimedia/bookmark.svg" alt="Guardar" />
                            </button>
                            <button className="compartir" onClick={handleShare}>
                                <img src="/multimedia/doble_flecha_izq.svg" alt="Compartir" />
                            </button>
                        </div>
                        <button className="siguiente" onClick={handleNext}>
                            <img src="/multimedia/flecha_izq.svg" alt="Siguiente" />
                        </button>
                    </div>
                    <div className="perfil__galeria">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Miniatura ${index + 1}`}
                                className="perfil__miniatura"
                                onClick={() => handleThumbnailClick(index)}
                            />
                        ))}
                    </div>
                </div>
                <div className="perfil__info">
                    <div className="perfil__usuario">
                        <img
                            src={post.user.profile?.profilePicture || "/multimedia/usuarioDefault.jpg"}
                            alt="Avatar"
                            className="perfil__avatar"
                        />
                        <div className="perfil__datos">
                            <h2 className="perfil__nombre">@{post.user.username}</h2>
                            <p className="perfil__ubicacion">
                                {post.user.city}, {post.user.country}
                            </p>
                        </div>
                    </div>
                    <div className="perfil__presentacion">
                        <div className="perfil__publicacion">
                            <h1 className="publicacion__titulo">{post.title}</h1>
                            <p className="publicacion__descripcion">{post.description}</p>
                        </div>
                        {post.peopleTags && post.peopleTags.length > 0 && (
                            <div className="perfil__personas">
                                <h3 className="personas__titulo">Personas que aparecen</h3>
                                <ul className="personas__lista">
                                    {post.peopleTags.map((person, idx) => (
                                        <li key={idx} className="personas__item">
                                            {person.role}:{" "}
                                            <a href={`/profile/${person.name}`} className="personas__enlace">
                                                @{person.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="perfil__etiquetas">
                            <h3 className="etiquetas__titulo">Etiquetas</h3>
                            <div className="etiquetas__lista">
                                {post.tags.map((tag, index) => (
                                    <span key={index} className="etiqueta">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default UserPost;
