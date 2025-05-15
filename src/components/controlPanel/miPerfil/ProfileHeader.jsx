import { FaArrowLeft } from 'react-icons/fa';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="miPerfil-navigation">
            <button className="miPerfil-back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft /> <span>Volver</span>
            </button>
        </div>
    );
};

export default ProfileHeader;
