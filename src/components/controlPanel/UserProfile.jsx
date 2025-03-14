import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTh, FaList, FaLinkedin, FaInstagram, FaUserPlus, FaUserCheck, FaArrowLeft, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import './css/UserProfile.css';
import { useNavigate, useParams } from 'react-router-dom';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isGalleryView, setIsGalleryView] = useState(true);
    const [activeTab, setActiveTab] = useState('perfil');
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const { username } = useParams();
    const navigate = useNavigate();

    // Función para mostrar notificaciones
    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        // Esconder la notificación después de 3 segundos
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 3000);
    };

    // Función para verificar el estado de seguimiento
    const checkFollowStatus = async (userId) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem('authToken');
            
            if (!token) return false;
            
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(
                `${backendUrl}/api/users/check-follow/${userId}`,
                { headers }
            );
            return response.data.isFollowing;
        } catch (error) {
            console.error("Error verificando estado de seguimiento:", error);
            return false;
        }
    };

    // Cargar perfil del usuario externo
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem('authToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const res = await axios.get(`${backendUrl}/api/users/profile/${username}`, { headers });
                setProfile(res.data);

                // Verificar el estado de seguimiento siempre usando el endpoint específico
                if (token && res.data._id) {
                    const followStatus = await checkFollowStatus(res.data._id);
                    setIsFollowing(followStatus);
                } else {
                    setIsFollowing(false);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error al cargar el perfil del usuario", error);
                setError("No se pudo cargar el perfil del usuario. El usuario puede no existir o haber ocurrido un error en el servidor.");
                setLoading(false);
            }
        };

        if (username) {
            fetchUserProfile();
        }
    }, [username]);

    // Cargar publicaciones del usuario
    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!username || loading) return;

            try {
                setPostsLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/posts/user/${username}`);

                if (res.data && res.data.posts) {
                    setUserPosts(res.data.posts);
                } else {
                    setUserPosts([]);
                }
                setPostsLoading(false);
            } catch (error) {
                console.error("Error al cargar las publicaciones del usuario", error);
                setUserPosts([]);
                setPostsLoading(false);
            }
        };

        fetchUserPosts();
    }, [username, loading]);

    // Función para alternar vista de publicaciones (toggle)
    const toggleView = () => {
        setIsGalleryView(prev => !prev);
    };

    // Función para seguir/dejar de seguir al usuario
    const handleFollowToggle = async () => {
        if (!profile || !profile._id) return;

        try {
            setFollowLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            if (isFollowing) {
                await axios.delete(`${backendUrl}/api/users/follow/${profile._id}`, { headers });
                // Actualizar contador de seguidores inmediatamente
                setProfile(prevProfile => ({
                    ...prevProfile,
                    followersCount: Math.max(0, (prevProfile.followersCount || 0) - 1)
                }));
                setIsFollowing(false); // Actualizar estado UI inmediatamente
            } else {
                await axios.post(`${backendUrl}/api/users/follow/${profile._id}`, {}, { headers });
                // Actualizar contador de seguidores inmediatamente
                setProfile(prevProfile => ({
                    ...prevProfile,
                    followersCount: (prevProfile.followersCount || 0) + 1
                }));
                setIsFollowing(true); // Actualizar estado UI inmediatamente
            }
            
            // Mostrar mensaje de éxito al usuario
            const message = isFollowing 
                ? 'Has dejado de seguir a este usuario'
                : 'Ahora sigues a este usuario';
            
            // Mostrar notificación visual de éxito
            showNotification('success', message);
            
        } catch (error) {
            console.error("Error al seguir/dejar de seguir", error);
            // Mensaje de error más descriptivo para el usuario
            let errorMessage = "Ha ocurrido un error. Por favor, inténtalo de nuevo.";
            
            if (error.response) {
                // El servidor respondió con un código de error
                if (error.response.status === 400) {
                    errorMessage = error.response.data.error || errorMessage;
                } else if (error.response.status === 404) {
                    errorMessage = "Usuario no encontrado.";
                } else if (error.response.status === 401) {
                    errorMessage = "Debes iniciar sesión para realizar esta acción.";
                    navigate('/login');
                }
            } else if (error.request) {
                // La solicitud se realizó pero no se recibió respuesta
                errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
            }
            
            // Mostrar notificación visual de error
            showNotification('error', errorMessage);
        } finally {
            setFollowLoading(false);
        }
    };

    // Se fija un total fijo de elementos (15) para imitar MiPerfil
    const totalGridItems = 15;
    const renderProjectsGrid = () => {
        return [...Array(totalGridItems)].map((_, index) => {
            if (index < userPosts.length) {
                const post = userPosts[index];
                return (
                    <div
                        key={post._id}
                        className="user-profile-project-placeholder"
                        onClick={() => navigate(`/ControlPanel/post/${post._id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={post.mainImage}
                            alt={`Publicación ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </div>
                );
            } else {
                return (
                    <div key={index} className="user-profile-project-placeholder">
                        {/* Placeholder sin imagen */}
                    </div>
                );
            }
        });
    };

    if (loading) {
        return (
            <div className="user-profile-loading">
                <p>Cargando perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-profile-error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/ControlPanel/explorer')}>Volver al explorador</button>
            </div>
        );
    }

    return (
        <div className="user-profile-container">
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' ? (
                        <FaCheckCircle className="notification-icon" />
                    ) : (
                        <FaExclamationCircle className="notification-icon" />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}
            <header className="user-profile-navigation">
                <button className="user-profile-back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft size={20} />
                    <span>Volver</span>
                </button>
            </header>
            <div className="user-profile-header-container">
                <header className="user-profile-header">
                    <img
                        src={profile?.profile?.profilePicture || "/multimedia/usuarioDefault.jpg"}
                        alt="Perfil"
                        className="user-profile-photo"
                    />
                    <div className="user-profile-personal-info">
                        <h1 className="user-profile-name">
                            {profile?.fullName || "Nombre Apellido"}
                        </h1>
                        <p className="user-profile-occupations">
                            {profile?.professionalTitle || "Título profesional no especificado"}
                        </p>
                        <p className="user-profile-location">
                            {profile?.city && profile?.country
                                ? `${profile.city}, ${profile.country}`
                                : "Ubicación no especificada"}
                        </p>
                        <div className="user-profile-stats">
                            <span className="user-profile-stat">
                                <strong>{profile?.followersCount || 0}</strong> seguidores
                            </span>
                            <span className="user-profile-stat">
                                <strong>{profile?.followingCount || 0}</strong> seguidos
                            </span>
                        </div>

                        {profile && profile._id !== localStorage.getItem('userId') && (
                            <button
                                className={`follow-button ${isFollowing ? 'following' : ''}`}
                                onClick={handleFollowToggle}
                                disabled={followLoading}
                            >
                                {followLoading ? (
                                    'Procesando...'
                                ) : isFollowing ? (
                                    <>
                                        <FaUserCheck /> Dejar de seguir
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus /> Seguir
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </header>
                <div className="user-profile-mobile-tabs">
                    <button
                        className={activeTab === 'perfil' ? 'active' : ''}
                        onClick={() => setActiveTab('perfil')}
                    >
                        Perfil
                    </button>
                    <button
                        className={activeTab === 'publicaciones' ? 'active' : ''}
                        onClick={() => setActiveTab('publicaciones')}
                    >
                        Publicaciones
                    </button>
                </div>
            </div>

            <div className="user-profile-content">
                <div className={`user-profile-left-content ${activeTab === 'perfil' ? 'active' : ''}`}>
                    {/* Secciones del perfil */}
                    {profile?.biography && profile.biography.trim() !== "" && (
                        <section className="user-profile-section">
                            <h2>Descripción</h2>
                            <p>{profile.biography}</p>
                        </section>
                    )}
                    
                    {profile?.professionalFormation && profile.professionalFormation.some(exp => 
                        exp.trainingName && exp.trainingName.trim() !== "" && 
                        exp.institution && exp.institution.trim() !== "") && (
                        <section className="user-profile-section">
                            <h2>Experiencia profesional</h2>
                            <ul className="user-profile-list">
                                {profile.professionalFormation
                                    .filter(exp => exp.trainingName && exp.trainingName.trim() !== "" && 
                                                exp.institution && exp.institution.trim() !== "")
                                    .map((exp, index) => (
                                        <li key={index}>
                                            <strong>
                                                {exp.trainingStart ? new Date(exp.trainingStart).toLocaleDateString() : ""}
                                                {" - "}
                                                {exp.trainingEnd ? new Date(exp.trainingEnd).toLocaleDateString() : (exp.currentlyInProgress ? "Actual" : "")}
                                            </strong>
                                            <p>
                                                {exp.trainingName} en {exp.institution}
                                            </p>
                                        </li>
                                    ))
                                }
                            </ul>
                        </section>
                    )}
                    
                    {profile?.skills && profile.skills.length > 0 && profile.skills.some(skill => skill && skill.trim() !== "") && (
                        <section className="user-profile-section">
                            <h2>Habilidades</h2>
                            <div className="user-profile-chips">
                                {profile.skills
                                    .filter(skill => skill && skill.trim() !== "")
                                    .map((skill, index) => (
                                        <span key={index} className="user-profile-chip">{skill}</span>
                                    ))
                                }
                            </div>
                        </section>
                    )}
                    
                    {profile?.software && profile.software.length > 0 && profile.software.some(sw => sw && sw.trim() !== "") && (
                        <section className="user-profile-section">
                            <h2>Software</h2>
                            <div className="user-profile-chips">
                                {profile.software
                                    .filter(sw => sw && sw.trim() !== "")
                                    .map((sw, index) => (
                                        <span key={index} className="user-profile-chip">{sw}</span>
                                    ))
                                }
                            </div>
                        </section>
                    )}
                    
                    {profile?.education && profile.education.some(edu => 
                        edu.formationName && edu.formationName.trim() !== "" && 
                        (edu.institution || edu.otherInstitution)) && (
                        <section className="user-profile-section">
                            <h2>Formación educativa</h2>
                            <ul className="user-profile-list">
                                {profile.education
                                    .filter(edu => edu.formationName && edu.formationName.trim() !== "" && 
                                             (edu.institution || edu.otherInstitution))
                                    .map((edu, index) => (
                                        <li key={index}>
                                            <strong>
                                                {edu.formationStart ? new Date(edu.formationStart).toLocaleDateString() : ""}
                                                {" - "}
                                                {edu.formationEnd ? new Date(edu.formationEnd).toLocaleDateString() : "Actual"}
                                            </strong>
                                            <p>
                                                {edu.formationName} en {edu.institution || edu.otherInstitution}
                                            </p>
                                        </li>
                                    ))
                                }
                            </ul>
                        </section>
                    )}
                    
                    {((profile?.social?.linkedin && profile.social.linkedin.trim() !== "") || 
                      (profile?.social?.instagram && profile.social.instagram.trim() !== "")) && (
                        <section className="user-profile-section user-profile-social">
                            <h2>Redes sociales</h2>
                            <div className="user-profile-social-links">
                                {profile?.social?.linkedin && profile.social.linkedin.trim() !== "" && (
                                    <a
                                        href={profile.social.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FaLinkedin size={24} />
                                    </a>
                                )}
                                {profile?.social?.instagram && profile.social.instagram.trim() !== "" && (
                                    <a
                                        href={profile.social.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FaInstagram size={24} />
                                    </a>
                                )}
                            </div>
                        </section>
                    )}
                    
                    {(profile?.cvUrl || profile?.portfolioUrl) && (
                        <section className="user-profile-section ultima-seccion">
                            <h2>Archivos descargables</h2>
                            <div className="user-profile-downloads">
                                {profile?.cvUrl && (
                                    <a href={profile.cvUrl} download className="user-profile-btn">
                                        CV en PDF
                                    </a>
                                )}
                                {profile?.portfolioUrl && (
                                    <a href={profile.portfolioUrl} download className="user-profile-btn">
                                        Portfolio en PDF
                                    </a>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                <div className={`user-profile-right ${activeTab === 'publicaciones' ? 'active' : ''}`}>
                    <div className="user-profile-projects-controls">
                        <button onClick={toggleView} className="toggle-view-btn">
                            {isGalleryView ? <FaList size={20} /> : <FaTh size={20} />}
                        </button>
                    </div>
                    <div className={`user-profile-projects-grid ${isGalleryView ? 'gallery' : 'individual'}`}>
                        {postsLoading ? (
                            <div className="user-profile-loading">Cargando publicaciones...</div>
                        ) : (
                            renderProjectsGrid()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
