// CompleteRegistrationProfesional.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationProfesional = () => {
    const navigate = useNavigate();
    const [professionalType, setProfessionalType] = useState(null);
    const options = [
        "Una marca pequeña",
        "Una empresa",
        "Una agencia/scout",
        "Una institución educativa",
        "Otro"
    ];

    const handleNext = async () => {
        if (!professionalType) return;
        try {
            const token = localStorage.getItem("authToken");
            // Actualizamos el usuario con professionalType
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ professionalType })
            });
            const data = await response.json();
            if (response.ok) {
                // Almacenar la opción para usarla en pasos posteriores
                localStorage.setItem("professionalType", professionalType);
                // Si es Institución educativa (opción 4) ir a Datos de registro,
                // de lo contrario ir a Datos personales.
                if (professionalType === "4") {
                    navigate('/CompleteRegistrationProfesionalInstitucion');
                } else {
                    navigate('/CompleteRegistrationProfesionalDatosPersonales');
                }
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="complete-registration-container">
            <div className="contenedor-registro-objetivo">
                {/* Indicador de paso */}
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 1</p>
                <p className="question">¿Cuál es tu rol?</p>
                <h2 className="titulo">Soy el representante de...</h2>
                <div className="objectives-list">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`objective-button ${professionalType === String(index + 1) ? "selected" : ""}`}
                            onClick={() => setProfessionalType(String(index + 1))}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button
                        className="back-button"
                        onClick={handleBack}
                        style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}
                    >
                        &#8592; Volver atrás
                    </button>
                    <button
                        className="next-button"
                        disabled={!professionalType}
                        onClick={handleNext}
                    >
                        Siguiente
                    </button>
                </div>
                {/* Paginación: 5 puntos, con el primero resaltado */}
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                        <span
                            key={index}
                            style={{
                                margin: '0 4px',
                                fontSize: index === 0 ? '1.2rem' : '1rem',
                                color: 'gray'
                            }}
                        >
                            &#9679;
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompleteRegistrationProfesional;
