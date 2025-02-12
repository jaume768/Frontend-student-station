// CompleteRegistrationCreativoDisenador05.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/complete-registration.css';

const CompleteRegistrationCreativoDisenador05 = () => {
    const navigate = useNavigate();
    const [creativeOther, setCreativeOther] = useState("");

    const options = [
        "Diseñador independiente",
        "Diseñador de una marca propia",
        "Trabajo para una empresa"
    ];

    const handleNext = async () => {
        if (!creativeOther) return;
        try {
            const token = localStorage.getItem("authToken");
            // Actualizamos creativeOther en el usuario
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ creativeOther })
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/dashboard');
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
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 5</p>
                <p className="question">Vamos a conocer un poco más sobre ti</p>
                <h2 className="titulo">¿Qué opción describe mejor tu situación actual?</h2>
                <div className="objectives-list">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`objective-button ${creativeOther === option ? "selected" : ""}`}
                            onClick={() => setCreativeOther(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button className="back-button" onClick={handleBack} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
                        &#8592; Volver atrás
                    </button>
                    <button className="next-button" disabled={!creativeOther} onClick={handleNext}>
                        Siguiente
                    </button>
                </div>
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                        <span key={index} style={{ margin: '0 4px', fontSize: index === 4 ? '1.2rem' : '1rem', color: 'gray' }}>
                            &#9679;
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompleteRegistrationCreativoDisenador05;
