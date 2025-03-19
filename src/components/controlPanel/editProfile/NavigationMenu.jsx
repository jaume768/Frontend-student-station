import React from 'react';
import { FaPencilAlt, FaBriefcase, FaCog } from 'react-icons/fa';

const NavigationMenu = ({ activeOption, setActiveOption }) => {
    return (
        <div className="left-options">
            <div
                className={`option ${activeOption === "editProfile" ? "active" : ""}`}
                onClick={() => setActiveOption("editProfile")}
            >
                <FaPencilAlt className="option-icon" />
                <span>Editar mi perfil</span>
            </div>
            <div
                className={`option option-offers ${activeOption === "misOfertas" ? "active" : ""}`}
                onClick={() => setActiveOption("misOfertas")}
            >
                <FaBriefcase className="option-icon" />
                <span>Mis ofertas</span>
            </div>
            <div
                className={`option option-settings ${activeOption === "configuracion" ? "active" : ""}`}
                onClick={() => setActiveOption("configuracion")}
            >
                <FaCog className="option-icon" />
                <span>Configuración</span>
            </div>
        </div>
    );
};

export default NavigationMenu;
