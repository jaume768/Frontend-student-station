import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/miPerfil.css';
import { useNavigate } from 'react-router-dom';

// Importar componentes
import ProfileHeader from './miPerfil/ProfileHeader';
import BiographySection from './miPerfil/BiographySection';
import ProfessionalExperienceSection from './miPerfil/ProfessionalExperienceSection';
import SkillsSection from './miPerfil/SkillsSection';
import SoftwareSection from './miPerfil/SoftwareSection';
import EducationSection from './miPerfil/EducationSection';
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
    const [activeTab, setActiveTab] = useState('perfil');
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

    return (
        <div className="miPerfil-container">
            <ProfileHeader 
                profile={profile} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                professionalType={profile?.professionalType}
            />

            <div className="miPerfil-content">
                <div className={`miPerfil-left-content ${activeTab === 'perfil' ? 'active' : ''}`}>
                    {isCompany ? (
                        <CompanyTagsSection companyTags={profile?.companyTags} offersPractices={profile?.offersPractices} />
                    ) : isEducationalInstitution ? (
                        <></>
                    ) : null}
                    <BiographySection biography={profile?.biography} />
                    
                    {isCompany ? (
                        <>
                            <MilestoneSection professionalMilestones={profile?.professionalMilestones} />
                        </>
                    ) : isEducationalInstitution ? (
                        <></>
                    ) : (
                        <>
                            <ProfessionalExperienceSection professionalFormation={profile?.professionalFormation} />
                            <SoftwareSection software={profile?.software} />
                            <EducationSection education={profile?.education} />
                            <DownloadableFilesSection cvUrl={profile?.cvUrl} portfolioUrl={profile?.portfolioUrl} />
                        </>
                    )}
                    
                    <SkillsSection skills={profile?.skills} />
                    <SocialSection social={profile?.social} />
                </div>

                <div className={`miPerfil-right-posts ${activeTab === 'ofertas' ? 'active' : ''}`}>
                    {isCompany ? (
                        <>
                            <div className="company-tabs">
                                <button 
                                    className={`company-tab ${companyRightTab === 'ofertas' ? 'active' : ''}`}
                                    onClick={() => setCompanyRightTab('ofertas')}
                                >
                                    Ofertas de trabajo ({companyOffers.length})
                                </button>
                                <button 
                                    className={`company-tab ${companyRightTab === 'publicaciones' ? 'active' : ''}`}
                                    onClick={() => setCompanyRightTab('publicaciones')}
                                >
                                    Publicaciones ({userPosts.length})
                                </button>
                            </div>
                            
                            {companyRightTab === 'publicaciones' ? (
                                <ProjectsSection 
                                    isGalleryView={isGalleryView} 
                                    toggleView={toggleView} 
                                    userPosts={userPosts}
                                />
                            ) : (
                                <CompanyOffersSection offers={companyOffers} />
                            )}
                        </>
                    ) : isEducationalInstitution ? (
                        <>
                            <div className="company-tabs">
                                <button 
                                    className={`company-tab ${companyRightTab === 'ofertas' ? 'active' : ''}`}
                                    onClick={() => setCompanyRightTab('ofertas')}
                                >
                                    Ofertas educativas ({educationalOffers.length})
                                </button>
                                <button 
                                    className={`company-tab ${companyRightTab === 'publicaciones' ? 'active' : ''}`}
                                    onClick={() => setCompanyRightTab('publicaciones')}
                                >
                                    Publicaciones ({userPosts.length})
                                </button>
                            </div>
                            
                            {companyRightTab === 'publicaciones' ? (
                                <ProjectsSection 
                                    isGalleryView={isGalleryView} 
                                    toggleView={toggleView} 
                                    userPosts={userPosts}
                                />
                            ) : (
                                <EducationalOffersSection offers={educationalOffers} />
                            )}
                        </>
                    ) : (
                        <ProjectsSection 
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

export default MiPerfil;
