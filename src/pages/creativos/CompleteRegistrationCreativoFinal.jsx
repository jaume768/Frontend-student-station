// CompleteRegistrationCreativoFinal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativoFinal = () => {
    const navigate = useNavigate();

    const handleFinishRegistration = () => {
        navigate('/ControlPanel');
    };

    return (
        <div className="contenedor-registro-objetivo finalRegistro-container">
            <div className="finalRegistro-content">
                <h1 className="finalRegistro-title">¡Genial!</h1>
                <p className="finalRegistro-message">
                    Ya está todo preparado para comenzar.
                </p>
                
                <div className="finalRegistro-actions">
                    
                    <button 
                        className="finalRegistro-finish-button" 
                        onClick={handleFinishRegistration}
                    >
                        Finalizar registro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompleteRegistrationCreativoFinal;
