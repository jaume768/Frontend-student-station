import React from 'react';

const ProfileOptionsModal = ({ onClose, onSelectOption }) => {
    return (
        <div className="profile-options-modal">
            <ul className="profile-options-modal-ul">
                <li onClick={() => onSelectOption('profile')}>Mi perfil</li>
                <li onClick={() => onSelectOption('editProfile')}>Editar perfil</li>
                <li onClick={() => onSelectOption('community')}>Mi comunidad</li>
                <li onClick={() => onSelectOption('misOfertas')}>Mis ofertas</li>
                <li onClick={() => onSelectOption('configuracion')}>Configuración</li>
                <li onClick={() => onSelectOption('logout')}>Cerrar sesión</li>
            </ul>
        </div>
    );
};

export default ProfileOptionsModal;
