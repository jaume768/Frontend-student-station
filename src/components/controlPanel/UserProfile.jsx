import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/UserProfileExtern.css';
import { FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaUserPlus, FaUserCheck, FaBell, FaBellSlash, FaEnvelope, FaShareAlt, FaTh, FaList, FaGlobe, FaUpload, FaExternalLinkAlt } from 'react-icons/fa';

// Importar componentes
import UserProfileHeader from './userProfile/UserProfileHeader';
import UserBiographySection from './userProfile/UserBiographySection';
import UserProfessionalTitleSection from './userProfile/UserProfessionalTitleSection';
import UserProfessionalExperienceSection from './userProfile/UserProfessionalExperienceSection';
import UserSkillsSection from './userProfile/UserSkillsSection';
import UserSoftwareSection from './userProfile/UserSoftwareSection';
import UserEducationSection from './userProfile/UserEducationSection';
import UserLanguagesSection from './userProfile/UserLanguagesSection';
import UserSocialSection from './userProfile/UserSocialSection';
import UserDownloadableFilesSection from './userProfile/UserDownloadableFilesSection';
import UserCompanyTagsSection from './userProfile/UserCompanyTagsSection';
import UserMilestoneSection from './userProfile/UserMilestoneSection';
import UserCompanyOffersSection from './userProfile/UserCompanyOffersSection';
import UserEducationalOffersSection from './userProfile/UserEducationalOffersSection';

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isNotificationActive, setIsNotificationActive] = useState(false);
    const [isGalleryView, setIsGalleryView] = useState(true);
    const [activeTab, setActiveTab] = useState('publicaciones');
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followLoading, setFollowLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [isCompany, setIsCompany] = useState(false);
    const [isEducationalInstitution, setIsEducationalInstitution] = useState(false);
    const [companyRightTab, setCompanyRightTab] = useState('ofertas');
    const [companyOffers, setCompanyOffers] = useState([]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const headers = { Authorization: `Bearer ${token}` };
                const res = await axios.get(`${backendUrl}/api/users/profile/${username}`, { headers });
                console.log('Datos del perfil:', res.data);
                setProfile(res.data);

                // Verificar si el usuario actual sigue al usuario del perfil
                const currentUser = await axios.get(`${backendUrl}/api/users/profile`, { headers });
                const isFollowingUser = currentUser.data.following.includes(res.data._id);
                setIsFollowing(isFollowingUser);

                // Verificar si es una empresa o institución educativa
                const userIsCompany =
                    res.data.professionalType === 1 ||
                    res.data.professionalType === 2 ||
                    res.data.professionalType === 3;
                const userIsEducationalInstitution = res.data.professionalType === 4;
                setIsCompany(userIsCompany);
                setIsEducationalInstitution(userIsEducationalInstitution);

                // Verificar si las notificaciones están activas
                if (isFollowingUser && currentUser.data.notifications) {
                    const notificationActive = currentUser.data.notifications.some(
                        notif => notif.userId === res.data._id && notif.active
                    );
                    setIsNotificationActive(notificationActive);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error al cargar el perfil del usuario", error);
                setError("No se pudo cargar el perfil del usuario. El usuario puede no existir o haber ocurrido un error en el servidor.");
                setLoading(false);
            }
        };

        const fetchUserPosts = async () => {
            try {
                setPostsLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const { data } = await axios.get(`${backendUrl}/api/posts/user/${username}`);
                setUserPosts(data.posts || []);
                setPostsLoading(false);
            } catch (error) {
                console.error("Error al cargar las publicaciones del usuario", error);
                setPostsLoading(false);
            }
        };

        const fetchCompanyOffers = async (userId) => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const { data } = await axios.get(`${backendUrl}/api/job-offers/company/${userId}`);
                setProfile(prev => ({
                    ...prev,
                    jobOffers: data
                }));
            } catch (error) {
                console.error("Error al cargar las ofertas de trabajo", error);
            }
        };

        // Nueva función para obtener ofertas educativas
        const fetchEducationalOffers = async (userId) => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const { data } = await axios.get(`${backendUrl}/api/educational-offers/institution/${userId}`);
                setProfile(prev => ({
                    ...prev,
                    educationalOffers: data
                }));
            } catch (error) {
                console.error("Error al cargar las ofertas educativas", error);
            }
        };

        fetchUserProfile();
        fetchUserPosts();

        // Verificamos qué tipo de ofertas debemos cargar según el tipo de usuario
        const checkUserTypeAndFetchOffers = async () => {
            if (profile) {
                if (profile.professionalType === 1 || profile.professionalType === 2 || profile.professionalType === 3) {
                    // Es una empresa, cargamos ofertas de trabajo
                    fetchCompanyOffers(profile._id);
                } else if (profile.professionalType === 4) {
                    // Es una institución educativa, cargamos ofertas educativas
                    fetchEducationalOffers(profile._id);
                }
            }
        };

        checkUserTypeAndFetchOffers();
    }, [username]);

    // Efecto para manejar el scroll en dispositivos móviles
    useEffect(() => {
        const handleScroll = () => {
            // Solo aplicamos esta lógica en dispositivos móviles
            if (window.innerWidth <= 480) {
                const leftColumn = document.querySelector('.user-extern-left-column');
                if (leftColumn) {
                    // Si el scroll es mayor a 100px, añadimos la clase 'scrolled'
                    if (window.scrollY > 100) {
                        leftColumn.classList.add('scrolled');
                    } else {
                        leftColumn.classList.remove('scrolled');
                    }
                }
            }
        };

        // Añadimos el evento de scroll
        window.addEventListener('scroll', handleScroll);

        return () => {
            // Limpiamos el evento al desmontar el componente
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!isCompany && !isEducationalInstitution) return;
        if (!profile) return;

        const fetchOffers = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                let endpoint = `${backendUrl}/api/offers/user/${username}`;

                if (isEducationalInstitution) {
                    endpoint = `${backendUrl}/api/offers/educational/user-external/${username}`;
                }

                const res = await axios.get(endpoint);
                setCompanyOffers(res.data.offers || []);
            } catch (error) {
                console.error("Error al cargar las ofertas:", error);
                setCompanyOffers([]);
            }
        };

        fetchOffers();
    }, [profile, isCompany, isEducationalInstitution]);

    const handleFollow = async () => {
        try {
            setFollowLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.post(
                `${backendUrl}/api/users/follow/${profile._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsFollowing(true);
            setIsNotificationActive(true); // Por defecto, las notificaciones se activan al seguir

            // Actualizar el contador de seguidores
            const updatedProfile = { ...profile };
            updatedProfile.followers = [...updatedProfile.followers, "currentUserId"]; // Placeholder
            setProfile(updatedProfile);

            // Mostrar mensaje de éxito al usuario
            const message = 'Ahora sigues a este usuario';

            // Mostrar notificación visual de éxito
            showNotification('success', message);
        } catch (error) {
            console.error("Error al seguir al usuario", error);
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

    const handleUnfollow = async () => {
        try {
            setFollowLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            // Corregir la URL para usar la ruta correcta: /follow/ en lugar de /unfollow/
            await axios.delete(`${backendUrl}/api/users/follow/${profile._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsFollowing(false);
            setIsNotificationActive(false);

            // Actualizar el contador de seguidores de manera segura
            const updatedProfile = { ...profile };
            // Verificar que followers existe y es un array antes de filtrar
            if (updatedProfile.followers && Array.isArray(updatedProfile.followers)) {
                // Obtener el ID del usuario actual para filtrar correctamente
                const currentUserResponse = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const currentUserId = currentUserResponse.data._id;

                updatedProfile.followers = updatedProfile.followers.filter(
                    id => id !== currentUserId
                );
            }
            setProfile(updatedProfile);

            // Mostrar mensaje de éxito al usuario
            const message = 'Has dejado de seguir a este usuario';

            // Mostrar notificación visual de éxito
            showNotification('success', message);
        } catch (error) {
            console.error("Error al dejar de seguir al usuario", error);
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

    const toggleNotification = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            if (isNotificationActive) {
                // Desactivar notificaciones
                await axios.post(
                    `${backendUrl}/api/users/notifications/deactivate/${profile._id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Activar notificaciones
                await axios.post(
                    `${backendUrl}/api/users/notifications/activate/${profile._id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setIsNotificationActive(!isNotificationActive);
        } catch (error) {
            console.error("Error al cambiar el estado de las notificaciones", error);
        }
    };

    const toggleView = () => {
        setIsGalleryView(prev => !prev);
    };

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        // Esconder la notificación después de 3 segundos
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 3000);
    };

    if (loading) {
        return (
            <div className="user-extern-loading">
                <p>Cargando perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-extern-error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/ControlPanel/explorer')}>Volver al explorador</button>
            </div>
        );
    }

    return (
        <div className="user-extern-container">
            {notification.show && (
                <div className={`user-extern-notification ${notification.type}`}>
                    {notification.type === 'success' ? (
                        <FaCheckCircle className="user-extern-notification-icon" />
                    ) : (
                        <FaExclamationCircle className="user-extern-notification-icon" />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}
            <div className="user-extern-content">
                {/* Columna izquierda con información del perfil */}
                <div className="user-extern-left-column">
                    {/* Foto de perfil */}
                    <div className="user-extern-profile-photo-container">
                        <img
                            src={profile?.profile?.profilePicture || "/multimedia/usuarioDefault.jpg"}
                            alt={profile?.fullName || "Usuario"}
                            className="user-extern-profile-photo"
                        />
                    </div>

                    {/* Información básica del perfil */}
                    <div className="user-extern-profile-info">
                        <h1 className="user-extern-fullname">
                            {isCompany || isEducationalInstitution
                                ? profile?.companyName || "Nombre de la Empresa/Institución"
                                : profile?.fullName || "Nombre Completo"}
                        </h1>
                        <p className="user-extern-username">@{profile?.username || "username"}</p>

                        {(profile?.city || profile?.country) && (
                            <p className="user-extern-location">
                                {profile?.city && profile?.country
                                    ? `${profile.city}, ${profile.country}`
                                    : profile?.city || profile?.country}
                            </p>
                        )}
                        
                        {profile?.bio && (
                            <p className="user-extern-bio">
                                {profile.bio}
                            </p>
                        )}
                        
                        {profile?.professionalTitle && (<p className="user-extern-title">{profile.professionalTitle}</p>)}
                        
                        {profile?.professionalTags && Array.isArray(profile.professionalTags) && profile.professionalTags.length > 0 && (
                            <div className="user-extern-tags">
                                {profile.professionalTags.map((tag, index) => (
                                    <span key={index} className="creative-type">{tag}</span>
                                ))}
                            </div>
                        )}

                        {/* Sitio web */}
                        {profile?.social?.sitioWeb && (
                            <div className="user-extern-website">
                                <a href={profile.social.sitioWeb} target="_blank" rel="noopener noreferrer">
                                    {profile.social.sitioWeb}
                                </a>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="user-extern-action-buttons">
                            <button
                                className={`user-extern-follow-button ${isFollowing ? 'following' : ''}`}
                                onClick={isFollowing ? handleUnfollow : handleFollow}
                                disabled={followLoading}
                            >
                                {followLoading ? (
                                    "Cargando..."
                                ) : isFollowing ? (
                                    <>
                                        <FaUserCheck /> Siguiendo
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus /> Seguir
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Iconos de contacto y compartir */}
                        <div className="user-extern-contact-share">
                            <button 
                                className="user-extern-contact-button" 
                                title="Contactar"
                                onClick={() => {
                                    if (profile?.email) {
                                        window.location.href = `mailto:${profile.email}`;
                                    } else {
                                        setNotification({
                                            show: true,
                                            type: 'error',
                                            message: 'No hay dirección de correo disponible para este usuario.'
                                        });
                                        setTimeout(() => setNotification({ show: false }), 3000);
                                    }
                                }}
                            >
                                <FaEnvelope />
                                <span>Contactar</span>
                            </button>
                            <button 
                                className="user-extern-share-button" 
                                title="Compartir perfil"
                                onClick={() => {
                                    const profileUrl = window.location.href;
                                    navigator.clipboard.writeText(profileUrl);
                                    setNotification({
                                        show: true,
                                        type: 'success',
                                        message: 'URL del perfil copiada al portapapeles'
                                    });
                                    setTimeout(() => setNotification({ show: false }), 3000);
                                }}
                            >
                                <FaExternalLinkAlt />
                                <span>Compartir perfil</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columna derecha con pestañas */}
                <div className="user-extern-right-column">
                    {/* Pestañas superiores */}
                    <div className="user-extern-tabs">
                        <button
                            className={`user-extern-tab ${activeTab === 'publicaciones' ? 'active' : ''}`}
                            onClick={() => setActiveTab('publicaciones')}
                        >
                            Portfolio
                        </button>
                        <button
                            className={`user-extern-tab ${activeTab === 'perfil' ? 'active' : ''}`}
                            onClick={() => setActiveTab('perfil')}
                        >
                            About
                        </button>
                        {(isCompany || isEducationalInstitution) && (
                            <button
                                className={`user-extern-tab ${activeTab === 'ofertas' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ofertas')}
                            >
                                {isEducationalInstitution ? 'Ofertas educativas' : 'Ofertas de trabajo'}
                            </button>
                        )}
                    </div>

                    {/* Opciones de visualización para Portfolio */}
                    {activeTab === 'publicaciones' && (
                        <div className="user-extern-view-options">
                            <div className="user-extern-view-container">
                                <button
                                    className={`user-extern-view-button ${isGalleryView ? 'active' : ''}`}
                                    onClick={() => setIsGalleryView(true)}
                                    title="Vista de galería"
                                >
                                    <span>Galería</span>
                                    <FaTh />
                                </button>
                                <button
                                    className={`user-extern-view-button ${!isGalleryView ? 'active' : ''}`}
                                    onClick={() => setIsGalleryView(false)}
                                    title="Vista individual"
                                >
                                    <span>Individual</span>
                                    <FaList />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Contenido de las pestañas */}
                    <div className="user-extern-tab-content">
                        {/* Contenido de Portfolio */}
                        {activeTab === 'publicaciones' && (
                            <div className="user-extern-portfolio-content">
                                {postsLoading ? (
                                    <div className="user-extern-loading">Cargando publicaciones...</div>
                                ) : userPosts.length === 0 ? (
                                    <div className="user-extern-no-content">
                                        Este perfil todavía no tiene publicaciones.
                                        <div className="user-extern-projects gallery-view">
                                            {Array.from({ length: 3 }).map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className="user-extern-project-card user-extern-project-card-placeholder"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`user-extern-projects ${isGalleryView ? 'gallery-view' : 'list-view'}`}>
                                        {userPosts.map((post, index) => (
                                            <div
                                                key={index}
                                                className="user-extern-project-card"
                                                onClick={() => navigate(`/ControlPanel/post/${post._id}`)}
                                            >
                                                <img
                                                    src={post.mainImage}
                                                    alt={`Publicación ${index + 1}`}
                                                    className="user-extern-project-image"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contenido de About */}
                        {activeTab === 'perfil' && (
                            <div className="user-extern-about-content">
                                {isCompany ? (
                                    <div className="user-extern-company-profile">
                                        <UserCompanyTagsSection companyTags={profile?.companyTags} offersPractices={profile?.offersPractices} />
                                        <UserBiographySection biography={profile?.biography} />
                                        <UserMilestoneSection professionalMilestones={profile?.professionalMilestones} />
                                        <UserSkillsSection skills={profile?.skills} />
                                        <UserSocialSection social={profile?.social} />
                                    </div>
                                ) : isEducationalInstitution ? (
                                    <div className="user-extern-institution-profile">
                                        <UserBiographySection biography={profile?.biography} />
                                        <UserSkillsSection skills={profile?.skills} />
                                        <UserSocialSection social={profile?.social} />
                                    </div>
                                ) : (
                                    <div className="user-extern-creative-profile">
                                        <UserBiographySection biography={profile?.biography} />
                                        <UserProfessionalExperienceSection professionalFormation={profile?.professionalFormation} />
                                        <UserEducationSection education={profile?.education} />
                                        <UserSkillsSection skills={profile?.skills} />
                                        <UserSoftwareSection software={profile?.software} />
                                        <UserLanguagesSection languages={profile?.languages} />
                                        <UserSocialSection social={profile?.social} />
                                        <UserDownloadableFilesSection cvUrl={profile?.cvUrl} portfolioUrl={profile?.portfolioUrl} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contenido de Ofertas */}
                        {activeTab === 'ofertas' && (
                            <div className="user-extern-offers-content">
                                {isCompany ? (
                                    <UserCompanyOffersSection offers={companyOffers} />
                                ) : isEducationalInstitution ? (
                                    <UserEducationalOffersSection offers={companyOffers} />
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
