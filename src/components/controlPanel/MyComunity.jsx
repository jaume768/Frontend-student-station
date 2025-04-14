import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './css/MyComunity.css';

const MyComunity = () => {
    const [activeTab, setActiveTab] = useState('seguidos'); // 'seguidos' o 'seguidores'
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Estado para la paginación
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Contador separado para cada tipo
    const [followingCount, setFollowingCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    
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
                
                // Actualizar contadores específicos
                if (activeTab === 'seguidos') {
                    setFollowingCount(data.totalFollowing || 0);
                } else {
                    setFollowersCount(data.totalFollowers || 0);
                }
                
                setProfiles(profilesList);
                setFilteredProfiles(profilesList);
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

    // Cargar ambos contadores al inicio
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem('authToken');

                if (!token) return;

                // Obtener contador de seguidos
                const followingResponse = await axios.get(`${backendUrl}/api/users/following`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: 1, limit: 1 } // Solo necesitamos el total
                });
                
                if (followingResponse.data && followingResponse.data.totalFollowing !== undefined) {
                    setFollowingCount(followingResponse.data.totalFollowing);
                }
                
                // Obtener contador de seguidores
                const followersResponse = await axios.get(`${backendUrl}/api/users/followers`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: 1, limit: 1 } // Solo necesitamos el total
                });
                
                if (followersResponse.data && followersResponse.data.totalFollowers !== undefined) {
                    setFollowersCount(followersResponse.data.totalFollowers);
                }
                
            } catch (error) {
                console.error("Error al cargar contadores:", error);
            }
        };
        
        fetchCounts();
    }, []);

    // Cambiar pestaña y resetear la página
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1); // Resetear la página al cambiar de pestaña
        setSearchTerm(''); // Limpiar búsqueda al cambiar de pestaña
    };

    // Navegar al perfil de usuario
    const navigateToProfile = (username) => {
        navigate(`/ControlPanel/profile/${username}`);
    };
    
    // Filtrar perfiles basado en el término de búsqueda
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        if (term.trim() === '') {
            setFilteredProfiles(profiles);
            return;
        }
        
        const filtered = profiles.filter(user => {
            const fullName = (user.fullName || '').toLowerCase();
            const companyName = (user.companyName || '').toLowerCase(); // Añadir companyName
            const username = (user.username || '').toLowerCase();
            const professionalTitle = (user.professionalTitle || '').toLowerCase();
            const city = (user.city || '').toLowerCase();
            const country = (user.country || '').toLowerCase();
            
            return fullName.includes(term) || 
                   companyName.includes(term) || // Incluir companyName en la búsqueda
                   username.includes(term) || 
                   professionalTitle.includes(term) ||
                   city.includes(term) ||
                   country.includes(term);
        });
        
        setFilteredProfiles(filtered);
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
                    Mis seguidos ({followingCount})
                </button>
                <button
                    className={`mycomunity-tab ${activeTab === 'seguidores' ? 'active' : ''}`}
                    onClick={() => handleTabChange('seguidores')}
                >
                    Mis seguidores ({followersCount})
                </button>
            </div>
            
            {/* Buscador */}
            <div className="mycomunity-search-container">
                <div className="mycomunity-search">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={`Buscar en ${activeTab === 'seguidos' ? 'mis seguidos' : 'mis seguidores'}...`}
                        value={searchTerm}
                        onChange={handleSearch}
                        className="mycomunity-search-input"
                    />
                </div>
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
            ) : filteredProfiles.length === 0 && searchTerm ? (
                <div className="mycomunity-empty">
                    No se encontraron resultados para "{searchTerm}"
                </div>
            ) : (
                <>
                    {/* Contenedor de perfiles usando flex */}
                    <div className="mycomunity-flex">
                        {filteredProfiles.map((user) => (
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
                                <h3 className="mycomunity-user-name">
                                    {user.professionalType === 1 || user.professionalType === 2 || user.professionalType === 4 
                                        ? user.companyName || `@${user.username}` 
                                        : user.fullName || `@${user.username}`}
                                </h3>
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
