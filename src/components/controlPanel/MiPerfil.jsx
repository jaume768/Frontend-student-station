import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/miPerfil.css';
import './css/printProfile.css'; // Importar estilos específicos para impresión
import { useNavigate } from 'react-router-dom';
import { FaBell, FaEnvelope, FaShareAlt, FaExternalLinkAlt } from 'react-icons/fa';

// Importar componentes
import ProfileHeader from './miPerfil/ProfileHeader';
import BiographySection from './miPerfil/BiographySection';
import ProfessionalTitleSection from './miPerfil/ProfessionalTitleSection';
import ProfessionalExperienceSection from './miPerfil/ProfessionalExperienceSection';
import SkillsSection from './miPerfil/SkillsSection';
import SoftwareSection from './miPerfil/SoftwareSection';
import EducationSection from './miPerfil/EducationSection';
import LanguagesSection from './miPerfil/LanguagesSection';
import SocialSection from './miPerfil/SocialSection';
import DownloadableFilesSection from './miPerfil/DownloadableFilesSection';
import ProjectsSection from './miPerfil/ProjectsSection';
import MilestoneSection from './miPerfil/MilestoneSection';
import CompanyTagsSection from './miPerfil/CompanyTagsSection';
import CompanyOffersSection from './miPerfil/CompanyOffersSection';
import EducationalOffersSection from './miPerfil/EducationalOffersSection';

const MiPerfil = () => {
    const [profile, setProfile] = useState(null);
    const [isGalleryView, setIsGalleryView] = useState(true);
    const [activeTab, setActiveTab] = useState('publicaciones');
    const [userPosts, setUserPosts] = useState([]);
    const [isCompany, setIsCompany] = useState(false);
    const [isEducationalInstitution, setIsEducationalInstitution] = useState(false);
    const [companyRightTab, setCompanyRightTab] = useState('ofertas');
    const [companyOffers, setCompanyOffers] = useState([]);
    const [educationalOffers, setEducationalOffers] = useState([]);

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
                
                const userIsCompany = 
                    res.data.professionalType === 1 || 
                    res.data.professionalType === 2 || 
                    res.data.professionalType === 3;
                const userIsEducationalInstitution = 
                    res.data.professionalType === 4;
                setIsCompany(userIsCompany);
                setIsEducationalInstitution(userIsEducationalInstitution);
            } catch (error) {
                console.error("Error al cargar el perfil", error);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/posts/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserPosts(res.data.posts);
            } catch (error) {
                console.error("Error al cargar las publicaciones del usuario", error);
            }
        };
        fetchUserPosts();
    }, []);

    // Obtener ofertas de trabajo publicadas por la empresa
    useEffect(() => {
        if (isCompany) {
            const fetchCompanyOffers = async () => {
                try {
                    const token = localStorage.getItem('authToken');
                    if (!token) return;
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const res = await axios.get(`${backendUrl}/api/offers/user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setCompanyOffers(res.data.offers || []);
                } catch (error) {
                    console.error("Error al cargar las ofertas de la empresa", error);
                    setCompanyOffers([]);
                }
            };
            fetchCompanyOffers();
        } else if (isEducationalInstitution) {
            const fetchEducationalOffers = async () => {
                try {
                    const token = localStorage.getItem('authToken');
                    if (!token) return;
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const res = await axios.get(`${backendUrl}/api/offers/educational/user/${profile.username}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setEducationalOffers(res.data.offers || []);
                } catch (error) {
                    console.error("Error al cargar las ofertas educativas de la institución", error);
                    setEducationalOffers([]);
                }
            };
            fetchEducationalOffers();
        }
    }, [isCompany, isEducationalInstitution]);

    const toggleView = () => {
        setIsGalleryView(prev => !prev);
    };

    if (!profile) {
        return <div className="miPerfil-loading">Cargando perfil...</div>;
    }

    return (
        <div className="miPerfil-container">
            <div className="user-extern-tabs">
                <div className="user-extern-tabs-box">
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
                </div>
                <div className="miPerfil-contact-share">
                    <button 
                        className="miPerfil-share-button" 
                        title="Compartir perfil"
                        onClick={() => {
                            // Construir la URL correcta para el perfil público
                            const baseUrl = window.location.origin;
                            const profileUrl = `${baseUrl}/ControlPanel/profile/${profile.username}`;
                            navigator.clipboard.writeText(profileUrl);
                            // Mostrar notificación
                            alert(`URL del perfil copiada al portapapeles: ${profileUrl}`);
                        }}
                    >
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path></svg>
                    </button>
                </div>
            </div>
            <ProfileHeader />
            <div className="miPerfil-content">
                {/* Columna izquierda con foto e info */}
                <div className="miPerfil-left-column">
                    <div className="miPerfil-profile-photo-container">
                        <img
                            src={profile?.profile?.profilePicture || "/multimedia/usuarioDefault.jpg"}
                            alt={profile?.fullName || "Usuario"}
                            className="miPerfil-profile-photo"
                        />
                    </div>
                    <div className="miPerfil-profile-info">
                        <h1 className="miPerfil-fullname">{isCompany ? profile.companyName : profile.fullName}</h1>
                        <p className="miPerfil-username">@{profile.username}</p>
                        { (profile.city || profile.country) && (
                            <p className="miPerfil-location">
                                {profile.city && profile.country
                                    ? `${profile.city}, ${profile.country}`
                                    : profile.city || profile.country}
                            </p>
                        ) }
                        { profile.bio && (
                            <p className="miPerfil-bio">
                                {profile.bio}
                            </p>
                        ) }
                        { profile.professionalTitle && <p className="miPerfil-title">{profile.professionalTitle}</p> }
                        { profile.professionalTags && Array.isArray(profile.professionalTags) && profile.professionalTags.length > 0 && (
                            <div className="miPerfil-tags">
                                {profile.professionalTags.map((tag, index) => (
                                    <span key={index} className="creative-type">{tag}</span>
                                ))}
                            </div>
                        ) }
                        { profile.social?.sitioWeb && (
                            <div className="miPerfil-website">
                                <a href={profile.social.sitioWeb} target="_blank" rel="noopener noreferrer">
                                    {profile.social.sitioWeb}
                                </a>
                            </div>
                        ) }
                        {/* Botón de seguir eliminado */}
                        <div className="miPerfil-contact-share">
                            <button 
                                className="miPerfil-share-button" 
                                title="Compartir perfil"
                                onClick={() => {
                                    // Construir la URL correcta para el perfil público
                                    const baseUrl = window.location.origin;
                                    const profileUrl = `${baseUrl}/ControlPanel/profile/${profile.username}`;
                                    navigator.clipboard.writeText(profileUrl);
                                    // Mostrar notificación
                                    alert(`URL del perfil copiada al portapapeles: ${profileUrl}`);
                                }}
                            >
                                <FaExternalLinkAlt />
                                <span>Compartir perfil</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Columna derecha con pestañas y contenido */}
                <div className="miPerfil-right-column">
                    {activeTab === 'publicaciones' && (
                        <div className="miPerfil-portfolio-content">
                            <ProjectsSection
                                isGalleryView={isGalleryView}
                                toggleView={toggleView}
                                userPosts={userPosts}
                            />
                        </div>
                    )}
                    {activeTab === 'perfil' && (
                        <div className="miPerfil-about-content">
                            {isCompany ? (
                                <div className="miPerfil-company-profile">
                                    <CompanyTagsSection companyTags={profile?.companyTags} offersPractices={profile?.offersPractices} />
                                    <BiographySection biography={profile?.biography} />
                                    <MilestoneSection professionalMilestones={profile?.professionalMilestones} />
                                    <SkillsSection skills={profile?.skills} />
                                    <SocialSection social={profile?.social} />
                                </div>
                            ) : isEducationalInstitution ? (
                                <div className="miPerfil-institution-profile">
                                    <BiographySection biography={profile?.biography} />
                                    <SkillsSection skills={profile?.skills} />
                                    <SocialSection social={profile?.social} />
                                </div>
                            ) : (
                                <div className="miPerfil-creative-profile">
                                    <BiographySection biography={profile?.biography} />
                                    <ProfessionalExperienceSection professionalFormation={profile?.professionalFormation} />
                                    <EducationSection education={profile?.education} />
                                    <SkillsSection skills={profile?.skills} />
                                    <SoftwareSection software={profile?.software} />
                                    <LanguagesSection languages={profile?.languages} />
                                    <SocialSection social={profile?.social} />
                                    <DownloadableFilesSection cvUrl={profile?.cvUrl} portfolioUrl={profile?.portfolioUrl} />
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'ofertas' && (
                        <div className="miPerfil-offers-content">
                            {isCompany ? (
                                <CompanyOffersSection offers={companyOffers} />
                            ) : (
                                isEducationalInstitution && <EducationalOffersSection offers={educationalOffers} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;
