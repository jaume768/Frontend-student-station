import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProfileOptionsModal = ({ onClose, onSelectOption }) => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('');
    
    // Detectar la sección activa basada en la URL y el estado
    useEffect(() => {
        // Comprobar si hay estado en la localización actual
        const currentState = location.state?.activeMenu;
        
        if (currentState) {
            setActiveSection(currentState);
        } else {
            const path = location.pathname.split('/').pop() || 'explorer';
            if (path === 'profile') {
                setActiveSection('profile');
            } else if (path === 'editProfile') {
                setActiveSection('editProfile');
            } else if (path === 'community') {
                setActiveSection('community');
            } else if (path === 'misOfertas') {
                setActiveSection('misOfertas');
            } else if (path === 'configuracion') {
                setActiveSection('configuracion');
            }
        }
    }, [location]);
    
    const handleSelect = (option) => {
        setActiveSection(option);
        onSelectOption(option);
    };
    return (
        <div className="profile-options-modal">
            <div className="sidebar-section-title">Mi perfil</div>
            <ul className="profile-options-modal-ul">
                <li 
                    className={activeSection === 'profile' ? 'active' : ''}
                    onClick={() => handleSelect('profile')}>
                    <img src="/iconos/profile.svg" alt="Mi perfil" className="sidebar-icon" />
                    <span>Ver mi perfil</span>
                </li>
                <li 
                    className={activeSection === 'editProfile' ? 'active' : ''}
                    onClick={() => handleSelect('editProfile')}>
                    <img src="/iconos/edit-profile.svg" alt="Editar perfil" className="sidebar-icon" />
                    <span>Editar perfil</span>
                </li>
                <li 
                    className={activeSection === 'community' ? 'active' : ''}
                    onClick={() => handleSelect('community')}>
                    <img src="/iconos/community.svg" alt="Mi comunidad" className="sidebar-icon" />
                    <span>Mi comunidad</span>
                </li>
                <li 
                    className={activeSection === 'misOfertas' ? 'active' : ''}
                    onClick={() => handleSelect('misOfertas')}>
                    <img src="/iconos/job-offer.svg" alt="Mis ofertas" className="sidebar-icon" />
                    <span>Mis ofertas</span>
                </li>
                <li 
                    className={activeSection === 'configuracion' ? 'active' : ''}
                    onClick={() => handleSelect('configuracion')}>
                    <img src="/iconos/config.svg" alt="Configuración" className="sidebar-icon" />
                    <span>Configuración</span>
                </li>
            </ul>
        </div>
    );
};

export default ProfileOptionsModal;
