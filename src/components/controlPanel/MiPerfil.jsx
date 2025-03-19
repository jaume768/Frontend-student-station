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

const MiPerfil = () => {
    const [profile, setProfile] = useState(null);
    const [isGalleryView, setIsGalleryView] = useState(true);
    const [activeTab, setActiveTab] = useState('perfil');
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
            <ProfileHeader 
                profile={profile} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                professionalType={profile?.professionalType}
            />

            <div className="miPerfil-content">
                <div className={`miPerfil-left-content ${activeTab === 'perfil' ? 'active' : ''}`}>
                    <BiographySection biography={profile?.biography} />
                    <ProfessionalExperienceSection professionalFormation={profile?.professionalFormation} />
                    <SkillsSection skills={profile?.skills} />
                    <SoftwareSection software={profile?.software} />
                    <EducationSection education={profile?.education} />
                    <SocialSection social={profile?.social} />
                    <DownloadableFilesSection cvUrl={profile?.cvUrl} portfolioUrl={profile?.portfolioUrl} />
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
