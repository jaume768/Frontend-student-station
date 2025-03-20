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

const MiPerfil = () => {
    const [profile, setProfile] = useState(null);
    const [isGalleryView, setIsGalleryView] = useState(true);
    const [activeTab, setActiveTab] = useState('perfil');
    const [userPosts, setUserPosts] = useState([]);
    const [isCompany, setIsCompany] = useState(false);

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
                    res.data.professionalType === 4;
                setIsCompany(userIsCompany);
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
                    <BiographySection biography={profile?.biography} />
                    
                    {isCompany ? (
                        <>
                            <MilestoneSection professionalMilestones={profile?.professionalMilestones} />
                            <CompanyTagsSection companyTags={profile?.companyTags} offersPractices={profile?.offersPractices} />
                        </>
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

                <div className={`miPerfil-right ${activeTab === 'publicaciones' ? 'active' : ''}`}>
                    <ProjectsSection 
                        isGalleryView={isGalleryView} 
                        toggleView={toggleView} 
                        userPosts={userPosts} 
                    />
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;
