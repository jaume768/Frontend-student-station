import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/UserProfile.css';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Importar componentes
import UserProfileHeader from './userProfile/UserProfileHeader';
import UserBiographySection from './userProfile/UserBiographySection';
import UserProfessionalExperienceSection from './userProfile/UserProfessionalExperienceSection';
import UserSkillsSection from './userProfile/UserSkillsSection';
import UserSoftwareSection from './userProfile/UserSoftwareSection';
import UserEducationSection from './userProfile/UserEducationSection';
import UserSocialSection from './userProfile/UserSocialSection';
import UserDownloadableFilesSection from './userProfile/UserDownloadableFilesSection';
import UserProjectsSection from './userProfile/UserProjectsSection';
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
    const [activeTab, setActiveTab] = useState('perfil');
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

        const fetchCompanyOffers = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const { data } = await axios.get(`${backendUrl}/api/offers/user/${username}`);
                setCompanyOffers(data);
            } catch (error) {
                console.error("Error al cargar las ofertas de trabajo", error);
            }
        };
        
        // Nueva función para obtener ofertas educativas
        const fetchEducationalOffers = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                console.log("Fetching educational offers for user:", username);
                const { data } = await axios.get(`${backendUrl}/api/offers/educational/user-external/${username}`);
                setCompanyOffers(data); // Usamos el mismo estado para ofertas educativas
            } catch (error) {
                console.error("Error al cargar las ofertas educativas", error);
            }
        };

        fetchUserProfile();
        fetchUserPosts();
        
        // Verificamos qué tipo de ofertas debemos cargar según el tipo de usuario
        const checkUserTypeAndFetchOffers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const headers = { Authorization: `Bearer ${token}` };
                const res = await axios.get(`${backendUrl}/api/users/profile/${username}`, { headers });
                
                if (res.data.professionalType === 4) {
                    fetchEducationalOffers();
                } else if ([1, 2, 3].includes(res.data.professionalType)) {
                    fetchCompanyOffers();
                }
            } catch (error) {
                console.error("Error al verificar tipo de usuario", error);
            }
        };
        
        checkUserTypeAndFetchOffers();
    }, [username]);

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
            await axios.delete(`${backendUrl}/api/users/unfollow/${profile._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsFollowing(false);
            setIsNotificationActive(false);

            // Actualizar el contador de seguidores
            const updatedProfile = { ...profile };
            updatedProfile.followers = updatedProfile.followers.filter(
                id => id !== "currentUserId" // Placeholder
            );
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
            <UserProfileHeader
                profile={profile}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isFollowing={isFollowing}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
                isNotificationActive={isNotificationActive}
                toggleNotification={toggleNotification}
            />

            <div className="user-profile-content">
                <div className={`user-profile-left-content ${activeTab === 'perfil' ? 'active' : ''}`}>
                    {isCompany ? (
                        <>
                            <UserCompanyTagsSection companyTags={profile?.companyTags} offersPractices={profile?.offersPractices} />
                            <UserBiographySection biography={profile?.biography} />
                            <UserMilestoneSection professionalMilestones={profile?.professionalMilestones} />
                            <UserSkillsSection skills={profile?.skills} />
                            <UserSocialSection social={profile?.social} />
                        </>
                    ) : isEducationalInstitution ? (
                        <>
                            <UserBiographySection biography={profile?.biography} />
                            <UserSkillsSection skills={profile?.skills} />
                            <UserSocialSection social={profile?.social} />
                        </>
                    ) : (
                        <>
                            <UserBiographySection biography={profile?.biography} />

                            {profile?.professionalFormation && profile.professionalFormation.some(item =>
                                item.trainingName?.trim() || item.institution?.trim()
                            ) && (
                                    <UserProfessionalExperienceSection professionalFormation={profile.professionalFormation} />
                                )}

                            <UserSoftwareSection software={profile?.software} />

                            {profile?.education && profile.education.some(item =>
                                item.formationName?.trim() || item.institution?.trim() || item.otherInstitution?.trim()
                            ) && (
                                    <UserEducationSection education={profile.education} />
                                )}

                            <UserSkillsSection skills={profile?.skills} />

                            {(profile?.cvUrl || profile?.portfolioUrl) && (
                                <UserDownloadableFilesSection cvUrl={profile.cvUrl} portfolioUrl={profile.portfolioUrl} />
                            )}
                            <UserSocialSection social={profile?.social} />
                        </>
                    )}
                </div>

                <div className={`user-profile-right-content ${activeTab === 'publicaciones' || activeTab === 'ofertas' ? 'active' : ''}`}>
                    {isCompany ? (
                        <>
                            <div className="company-tabs-user-profile">
                                <button
                                    className={`company-tab-user-profile ${companyRightTab === 'ofertas' ? 'active' : ''}`}
                                    onClick={() => setCompanyRightTab('ofertas')}
                                >
                                    Ofertas de trabajo ({companyOffers.length})
                                </button>
                                <button
                                    className={`company-tab-user-profile ${companyRightTab === 'publicaciones' ? 'active' : ''}`}
                                    onClick={() => setCompanyRightTab('publicaciones')}
                                >
                                    Publicaciones ({userPosts.length})
                                </button>
                            </div>

                            {companyRightTab === 'publicaciones' ? (
                                <UserProjectsSection
                                    isGalleryView={isGalleryView}
                                    toggleView={toggleView}
                                    userPosts={userPosts}
                                />
                            ) : (
                                <UserCompanyOffersSection offers={companyOffers} />
                            )}
                        </>
                    ) : isEducationalInstitution ? (
                        <>
                            <div className="company-tabs-user-profile">
                                <button
                                    className={`company-tab-user-profile ${companyRightTab === 'ofertas' ? 'active' : ''}`}
                                    onClick={() => setCompanyRightTab('ofertas')}
                                >
                                    Ofertas educativas ({companyOffers.length})
                                </button>
                                <button
                                    className={`company-tab-user-profile ${companyRightTab === 'publicaciones' ? 'active' : ''}`}
                                    onClick={() => setCompanyRightTab('publicaciones')}
                                >
                                    Publicaciones ({userPosts.length})
                                </button>
                            </div>

                            {companyRightTab === 'publicaciones' ? (
                                <UserProjectsSection
                                    isGalleryView={isGalleryView}
                                    toggleView={toggleView}
                                    userPosts={userPosts}
                                />
                            ) : (
                                <UserEducationalOffersSection offers={companyOffers} />
                            )}
                        </>
                    ) : (
                        <UserProjectsSection
                            isGalleryView={isGalleryView}
                            toggleView={toggleView}
                            userPosts={userPosts}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
