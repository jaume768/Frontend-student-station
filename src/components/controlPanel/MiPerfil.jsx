import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTh, FaList, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './css/miPerfil.css';
import { useNavigate } from 'react-router-dom';

const MiPerfil = () => {
    const [profile, setProfile] = useState(null);
    const [isGalleryView, setIsGalleryView] = useState(true);
    const [activeTab, setActiveTab] = useState('perfil');

    // Nuevo estado para guardar los posts del usuario
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data);
            } catch (error) {
                console.error("Error al cargar el perfil", error);
            }
        };
        fetchProfile();
    }, []);

    // Efecto para obtener las publicaciones del usuario
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                // Se asume que existe un endpoint para obtener los posts del usuario
                const res = await axios.get(`${backendUrl}/api/posts/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserPosts(res.data.posts); // Se espera que el endpoint retorne { posts: [...] }
            } catch (error) {
                console.error("Error al cargar las publicaciones del usuario", error);
            }
        };
        fetchUserPosts();
    }, []);

    const toggleView = () => {
        setIsGalleryView(prev => !prev);
    };
    const navigate = useNavigate();

    const totalGridItems = 15;
    const renderProjectsGrid = () => {
        return [...Array(totalGridItems)].map((_, index) => {
            if (index < userPosts.length) {
                const post = userPosts[index];
                return (
                    <div
                        key={index}
                        className="miPerfil-project-placeholder"
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
                    <div key={index} className="miPerfil-project-placeholder">
                        {/* Placeholder sin imagen */}
                    </div>
                );
            }
        });
    };

    return (
        <div className="miPerfil-container">
            <div className="miPerfil-header-container">
                <header className="miPerfil-header">
                    <img
                        src={profile?.profile?.profilePicture || "/multimedia/usuarioDefault.jpg"}
                        alt="Perfil"
                        className="miPerfil-photo"
                    />
                    <div className="miPerfil-personal-info">
                        <h1 className="miPerfil-name">
                            {profile?.fullName || "Nombre Apellido"}
                        </h1>
                        <p className="miPerfil-occupations">
                            {profile?.professionalTitle || "Título profesional no especificada"}
                        </p>
                        <p className="miPerfil-location">
                            {profile?.city && profile?.country
                                ? `${profile.city}, ${profile.country}`
                                : "Ubicación no especificada"}
                        </p>
                        <div className="miPerfil-stats">
                            <span 
                                className="miPerfil-stat" 
                                onClick={() => navigate('/ControlPanel/community')}
                                style={{ cursor: 'pointer' }}
                            >
                                <strong>{profile?.followers?.length || 0}</strong> seguidores
                            </span>
                            <span 
                                className="miPerfil-stat"
                                onClick={() => navigate('/ControlPanel/community')}
                                style={{ cursor: 'pointer' }}
                            >
                                <strong>{profile?.following?.length || 0}</strong> seguidos
                            </span>
                        </div>
                    </div>
                </header>
                <div className="miPerfil-mobile-tabs">
                    <button
                        className={activeTab === 'perfil' ? 'active' : ''}
                        onClick={() => setActiveTab('perfil')}
                    >
                        Mi perfil
                    </button>
                    <button
                        className={activeTab === 'publicaciones' ? 'active' : ''}
                        onClick={() => setActiveTab('publicaciones')}
                    >
                        Mis publicaciones
                    </button>
                </div>
            </div>

            <div className="miPerfil-content">
                <div className={`miPerfil-left-content ${activeTab === 'perfil' ? 'active' : ''}`}>
                    {/* Secciones del perfil */}
                    <section className="miPerfil-section">
                        <h2>Descripción</h2>
                        <p>
                            {profile?.biography || "No hay descripción disponible."}
                        </p>
                    </section>
                    <section className="miPerfil-section">
                        <h2>Experiencia profesional</h2>
                        <ul className="miPerfil-list">
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
                                <li>No se ha agregado experiencia profesional.</li>
                            )}
                        </ul>
                    </section>
                    <section className="miPerfil-section">
                        <h2>Habilidades</h2>
                        <div className="miPerfil-chips">
                            {profile?.skills && profile.skills.length > 0 ? (
                                profile.skills.map((skill, index) => (
                                    <span key={index} className="miPerfil-chip">{skill}</span>
                                ))
                            ) : (
                                <span>No se han agregado habilidades.</span>
                            )}
                        </div>
                    </section>
                    <section className="miPerfil-section">
                        <h2>Software</h2>
                        <div className="miPerfil-chips">
                            {profile?.software && profile.software.length > 0 ? (
                                profile.software.map((sw, index) => (
                                    <span key={index} className="miPerfil-chip">{sw}</span>
                                ))
                            ) : (
                                <span>No se ha agregado software.</span>
                            )}
                        </div>
                    </section>
                    <section className="miPerfil-section">
                        <h2>Formación educativa</h2>
                        <ul className="miPerfil-list">
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
                                <li>No se ha agregado formación educativa.</li>
                            )}
                        </ul>
                    </section>
                    <section className="miPerfil-section miPerfil-social">
                        <h2>Redes sociales</h2>
                        <div className="miPerfil-social-links">
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
                    <section className="miPerfil-section ultima-seccion">
                        <h2>Archivos descargables</h2>
                        <div className="miPerfil-downloads">
                            {profile?.cvUrl ? (
                                <a 
                                    href={profile.cvUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="miPerfil-btn"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Descargar CV
                                </a>
                            ) : (
                                <button 
                                    className="miPerfil-btn disabled" 
                                    disabled
                                    title="No has subido tu CV todavía"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    CV en PDF
                                </button>
                            )}
                            
                            {profile?.portfolioUrl ? (
                                <a 
                                    href={profile.portfolioUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="miPerfil-btn"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Descargar Portfolio
                                </a>
                            ) : (
                                <button 
                                    className="miPerfil-btn disabled" 
                                    disabled
                                    title="No has subido tu portafolio todavía"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Portfolio en PDF
                                </button>
                            )}
                        </div>
                    </section>
                </div>

                <div className={`miPerfil-right ${activeTab === 'publicaciones' ? 'active' : ''}`}>
                    <div
                        className="miPerfil-projects-controls"
                        style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
                    >
                        <button onClick={toggleView} className="toggle-view-btn">
                            {isGalleryView ? <FaList size={20} /> : <FaTh size={20} />}
                        </button>
                    </div>
                    <div
                        className={`miPerfil-projects-grid ${isGalleryView ? 'gallery' : 'individual'}`}
                    >
                        {renderProjectsGrid()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;
