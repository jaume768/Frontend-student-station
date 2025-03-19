import React from 'react';
import { FaCamera } from 'react-icons/fa';

const ProfileHeader = ({
    userData,
    selectedProfileImage,
    isEditingProfilePicture,
    isUploadingProfilePicture,
    handleProfilePictureClick,
    handleSaveProfileImage,
    handleCancelProfileImageEdit,
    profileImageInputRef,
    handleProfileImageChange,
    professionalType
}) => {
    // Determinar si el usuario es una empresa
    const isCompany = professionalType === 1 || professionalType === 2 || professionalType === 4;

    return (
        <div className="profile-banner">
            <div className="banner-left">
                <div className="profile-picture-container" onClick={handleProfilePictureClick}>
                    <img src={selectedProfileImage || userData?.profilePicture || "/multimedia/usuarioDefault.jpg"} alt="Perfil" className="profile-picture-edit" />
                    <div className="profile-picture-overlay">
                        <FaCamera />
                        <span>Cambiar foto</span>
                    </div>
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">
                        {isCompany 
                            ? (userData?.companyName || "Nombre de la Empresa") 
                            : (userData?.fullName || "Nombre Apellido")}
                    </h2>
                    <p className="profile-username">{userData?.username || ""}</p>
                    <p className="profile-location">
                        {userData?.city ? `${userData.city}${userData?.country ? `, ${userData.country}` : ''}` : 'Ubicación no especificada'}
                    </p>
                    <p className="profile-email">{userData?.email || ""}</p>
                </div>
            </div>
            <div className="banner-right">
                <span className="creative-type">{userData?.creativeType || ""}</span>
                <input 
                    type="file" 
                    id="profile-picture-input"
                    name="profile-picture"
                    accept="image/*"
                    ref={profileImageInputRef}
                    style={{ display: 'none' }}
                    onChange={handleProfileImageChange}
                />
                {isEditingProfilePicture && (
                    <div className="profile-picture-edit-actions">
                        <button 
                            type="button" 
                            className="save-profile-picture-button"
                            onClick={handleSaveProfileImage}
                            disabled={isUploadingProfilePicture}
                        >
                            {isUploadingProfilePicture ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button 
                            type="button" 
                            className="cancel-profile-picture-edit-button"
                            onClick={handleCancelProfileImageEdit}
                            disabled={isUploadingProfilePicture}
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;
