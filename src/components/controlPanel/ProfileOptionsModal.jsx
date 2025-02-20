// ProfileOptionsModal.jsx
import React from 'react';

const ProfileOptionsModal = ({ onClose }) => {
    return (
        <div className="profile-options-modal">
            <ul>
                <li>Mi perfil</li>
                <li>Editar perfil</li>
                <li>Mi comunidad</li>
                <li>Mis ofertas</li>
                <li>Configuración</li>
                <li>Cerrar sesión</li>
            </ul>
        </div>
    );
};

export default ProfileOptionsModal;
