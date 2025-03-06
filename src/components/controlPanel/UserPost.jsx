import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaBookmark, FaShareAlt, FaUserCircle } from 'react-icons/fa';
import './css/UserPost.css';

const UserPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPost(response.data.post);
            } catch (error) {
                console.error("Error al cargar la publicación:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
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

    const handleSave = (e) => {
        e.stopPropagation();
        console.log('Guardar post', post._id);
        // Aquí la lógica para guardar el post
    };

    const handleShare = (e) => {
        e.stopPropagation();
        console.log('Compartir post', post._id);
        // Aquí la lógica para compartir el post
    };

    return (
        <div className="perfil">
            <header className="perfil__header">
                <button className="perfil__volver" onClick={() => navigate(-1)}>
                    <FaArrowLeft size={20} />
                    <p>Volver</p>
                </button>
            </header>
            <section className="perfil__contenido">
                <div className="perfil__imagenes">
                    <div className="perfil__imagen">
                        <button className="anterior" onClick={handlePrevious}>
                            <FaChevronLeft size={24} />
                        </button>
                        {/* Se conserva la imagen principal real del post */}
                        <img
                            src={mainImage}
                            alt="Imagen principal"
                            className="perfil__imagen-principal"
                        />
                        <div className="options">
                            <button className="save-button" onClick={handleSave}>
                                <FaBookmark size={20} />
                            </button>
                            <button className="compartir" onClick={handleShare}>
                                <FaShareAlt size={20} />
                            </button>
                        </div>
                        <button className="siguiente" onClick={handleNext}>
                            <FaChevronRight size={24} />
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
                        {post.user.profile?.profilePicture ? (
                            <img
                                src={post.user.profile.profilePicture}
                                alt="Avatar"
                                className="perfil__avatar"
                            />
                        ) : (
                            <FaUserCircle size={50} />
                        )}
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
