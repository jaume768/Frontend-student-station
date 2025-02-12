// CompleteRegistrationCreativo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/complete-registration.css';

const CompleteRegistrationCreativo = () => {
    const navigate = useNavigate();
    const [creativeType, setCreativeType] = useState(null);
    const creativeOptions = [
        "Estudiante",
        "Graduado",
        "Estilista",
        "Diseñador/a activo",
        "Otro"
    ];

    const handleNext = async () => {
        if (!creativeType) return;
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ creativeType })
            });
            const data = await response.json();
            if (response.ok) {
                // Almacena el creativeType para usarlo en pasos posteriores
                localStorage.setItem("creativeType", creativeType);
                navigate('/CompleteRegistrationCreativo02');
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
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 1</p>
                <h1 className="greeting">¿Cuál es tu rol?</h1>
                <h2 className="titulo-objetivo">Soy...</h2>
                <div className="objectives-list">
                    {creativeOptions.map((option, index) => (
                        <button
                            key={index}
                            className={`objective-button ${creativeType === index + 1 ? "selected" : ""}`}
                            onClick={() => setCreativeType(index + 1)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button className="back-button" onClick={handleBack} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
                        &#8592; Volver atrás
                    </button>
                    <button className="next-button" disabled={!creativeType} onClick={handleNext}>
                        Siguiente
                    </button>
                </div>
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                        <span
                            key={index}
                            className={`dot ${index === 0 ? "active-dot" : ""}`}
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

export default CompleteRegistrationCreativo;
