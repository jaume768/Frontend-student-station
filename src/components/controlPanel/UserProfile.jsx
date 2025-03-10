import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTh, FaList, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './css/UserProfile.css';
import { useNavigate, useParams } from 'react-router-dom';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isGalleryView, setIsGalleryView] = useState(true);
    const [activeTab, setActiveTab] = useState('perfil');
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { username } = useParams(); // Captura el nombre de usuario de la URL
    const navigate = useNavigate();

    // Efecto para cargar el perfil del usuario externo
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/users/profile/${username}`);
                setProfile(res.data);
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

    // Efecto para obtener las publicaciones del usuario externo
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/posts/user/${username}`);
                setUserPosts(res.data.posts || []);
            } catch (error) {
                console.error("Error al cargar las publicaciones del usuario", error);
            }
        };
        
        if (username && !loading && profile) {
            fetchUserPosts();
        }
    }, [username, loading, profile]);

    const toggleView = () => {
        setIsGalleryView(prev => !prev);
    };

    const totalGridItems = 15;
    const renderProjectsGrid = () => {
        return [...Array(totalGridItems)].map((_, index) => {
            if (index < userPosts.length) {
                const post = userPosts[index];
                return (
                    <div
                        key={index}
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
                    <section className="user-profile-section">
                        <h2>Descripción</h2>
                        <p>
                            {profile?.biography || "No hay descripción disponible."}
                        </p>
                    </section>
                    <section className="user-profile-section">
                        <h2>Experiencia profesional</h2>
                        <ul className="user-profile-list">
                            {profile?.professionalFormation && profile.professionalFormation.length > 0 ? (
                                profile.professionalFormation.map((exp, index) => (
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
                            ) : (
                                <li>No hay experiencia profesional disponible.</li>
                            )}
                        </ul>
                    </section>
                    <section className="user-profile-section">
                        <h2>Habilidades</h2>
                        <div className="user-profile-chips">
                            {profile?.skills && profile.skills.length > 0 ? (
                                profile.skills.map((skill, index) => (
                                    <span key={index} className="user-profile-chip">{skill}</span>
                                ))
                            ) : (
                                <span>No hay habilidades disponibles.</span>
                            )}
                        </div>
                    </section>
                    <section className="user-profile-section">
                        <h2>Software</h2>
                        <div className="user-profile-chips">
                            {profile?.software && profile.software.length > 0 ? (
                                profile.software.map((sw, index) => (
                                    <span key={index} className="user-profile-chip">{sw}</span>
                                ))
                            ) : (
                                <span>No hay software disponible.</span>
                            )}
                        </div>
                    </section>
                    <section className="user-profile-section">
                        <h2>Formación educativa</h2>
                        <ul className="user-profile-list">
                            {profile?.education && profile.education.length > 0 ? (
                                profile.education.map((edu, index) => (
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
                            ) : (
                                <li>No hay formación educativa disponible.</li>
                            )}
                        </ul>
                    </section>
                    <section className="user-profile-section user-profile-social">
                        <h2>Redes sociales</h2>
                        <div className="user-profile-social-links">
                            {profile?.social?.linkedin && (
                                <a
                                    href={profile.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaLinkedin size={24} />
                                </a>
                            )}
                            {profile?.social?.instagram && (
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
                    {profile?.cvUrl || profile?.portfolioUrl ? (
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
                    ) : null}
                </div>

                <div className={`user-profile-right ${activeTab === 'publicaciones' ? 'active' : ''}`}>
                    <div
                        className="user-profile-projects-controls"
                        style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
                    >
                        <button onClick={toggleView} className="toggle-view-btn">
                            {isGalleryView ? <FaList size={20} /> : <FaTh size={20} />}
                        </button>
                    </div>
                    <div
                        className={`user-profile-projects-grid ${isGalleryView ? 'gallery' : 'individual'}`}
                    >
                        {userPosts.length > 0 ? (
                            renderProjectsGrid()
                        ) : (
                            <p className="user-profile-no-posts">Este usuario aún no tiene publicaciones.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
