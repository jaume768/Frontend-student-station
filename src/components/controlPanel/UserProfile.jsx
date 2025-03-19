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
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/posts/user/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserPosts(res.data.posts);
                setPostsLoading(false);
            } catch (error) {
                console.error("Error al cargar las publicaciones del usuario", error);
                setUserPosts([]);
                setPostsLoading(false);
            }
        };
        
        fetchUserProfile();
        fetchUserPosts();
    }, [username]);

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
                    <UserBiographySection biography={profile?.biography} />
                    <UserProfessionalExperienceSection professionalFormation={profile?.professionalFormation} />
                    <UserSkillsSection skills={profile?.skills} />
                    <UserSoftwareSection software={profile?.software} />
                    <UserEducationSection education={profile?.education} />
                    <UserSocialSection social={profile?.social} />
                    <UserDownloadableFilesSection cvUrl={profile?.cvUrl} portfolioUrl={profile?.portfolioUrl} />
                </div>

                <div className={`user-profile-right-content ${activeTab === 'publicaciones' ? 'active' : ''}`}>
                    <UserProjectsSection 
                        isGalleryView={isGalleryView}
                        toggleView={toggleView}
                        userPosts={userPosts}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
