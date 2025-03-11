import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/MyComunity.css';

const MyComunity = () => {
    const [activeTab, setActiveTab] = useState('seguidos'); // 'seguidos' o 'seguidores'
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Estado para la paginación
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10; // Número de perfiles por página

    const navigate = useNavigate();

    // Efecto para cargar perfiles según la pestaña activa y la página actual
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem('authToken');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const endpoint = activeTab === 'seguidos' ? 'following' : 'followers';
                const response = await axios.get(`${backendUrl}/api/users/${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page, limit }
                });

                const data = response.data;
                const profilesList = activeTab === 'seguidos' ? data.following : data.followers;
                const total = activeTab === 'seguidos' ? data.totalFollowing : data.totalFollowers;

                setProfiles(profilesList);
                setTotalCount(total);
                setTotalPages(data.totalPages);
                setLoading(false);
            } catch (error) {
                console.error(`Error al cargar ${activeTab}:`, error);
                setError(`No se pudieron cargar los ${activeTab}. Por favor, intenta de nuevo más tarde.`);
                setLoading(false);
            }
        };

        fetchProfiles();
    }, [activeTab, page, navigate]);

    // Cambiar pestaña y resetear la página
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1); // Resetear la página al cambiar de pestaña
    };

    // Navegar al perfil de usuario
    const navigateToProfile = (username) => {
        navigate(`/ControlPanel/profile/${username}`);
    };

    return (
        <div className="mycomunity-container">
            <h1 className="mycomunity-title">
                Mi comunidad &gt; {activeTab === 'seguidos' ? 'Perfiles que sigues' : 'Perfiles que te siguen'}
            </h1>

            {/* Contenedor de pestañas centrado */}
            <div className="mycomunity-tabs">
                <button
                    className={`mycomunity-tab ${activeTab === 'seguidos' ? 'active' : ''}`}
                    onClick={() => handleTabChange('seguidos')}
                >
                    Mis seguidos ({totalCount !== null ? totalCount : '...'})
                </button>
                <button
                    className={`mycomunity-tab ${activeTab === 'seguidores' ? 'active' : ''}`}
                    onClick={() => handleTabChange('seguidores')}
                >
                    Mis seguidores ({totalCount !== null ? totalCount : '...'})
                </button>
            </div>

            {loading ? (
                <div className="mycomunity-loading">Cargando perfiles...</div>
            ) : error ? (
                <div className="mycomunity-error">{error}</div>
            ) : profiles.length === 0 ? (
                <div className="mycomunity-empty">
                    {activeTab === 'seguidos'
                        ? 'No sigues a ningún perfil. Explora la plataforma para encontrar perfiles interesantes.'
                        : 'No tienes seguidores. Comparte tu perfil para que otros usuarios puedan descubrirte.'}
                </div>
            ) : (
                <>
                    {/* Contenedor de perfiles usando flex */}
                    <div className="mycomunity-flex">
                        {profiles.map((user) => (
                            <div
                                key={user._id}
                                className="mycomunity-card"
                                onClick={() => navigateToProfile(user.username)}
                            >
                                <img
                                    src={user.profile?.profilePicture || '/multimedia/usuarioDefault.jpg'}
                                    alt={user.fullName}
                                    className="mycomunity-profile-img"
                                />
                                <h3 className="mycomunity-user-name">{user.fullName || user.username}</h3>
                                <p className="mycomunity-user-role">
                                    {user.professionalTitle || (user.role === 'Creativo' ? 'Creativo' : 'Profesional')}
                                </p>
                                <p className="mycomunity-user-location">
                                    {user.city && user.country ? `${user.city}, ${user.country}` : ''}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Controles de paginación */}
                    {totalPages > 1 && (
                        <div className="mycomunity-pagination">
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="pagination-button"
                            >
                                Anterior
                            </button>
                            <span className="pagination-info">
                                Página {page} de {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className="pagination-button"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyComunity;
