import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ profile, activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    return (
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
    );
};

export default ProfileHeader;
