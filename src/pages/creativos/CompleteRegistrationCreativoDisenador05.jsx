// CompleteRegistrationCreativoDisenador05.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativoDisenador05 = () => {
    const navigate = useNavigate();
    const [creativeOther, setCreativeOther] = useState("");
    const [error, setError] = useState(""); // Estado para error

    const options = [
        "Diseñador independiente",
        "Diseñador de una marca propia",
        "Trabajo para una empresa"
    ];

    const handleNext = async () => {
        if (!creativeOther) {
            setError("Por favor, selecciona una opción que describa tu situación.");
            return;
        }
        setError("");
        try {
            const token = localStorage.getItem("authToken");
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ creativeOther })
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/creativo/registro/final');
            } else {
                setError(data.error || "Ha ocurrido un error.");
                console.error(data.error);
            }
        } catch (error) {
            setError("Error en la conexión o en el servidor.");
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

                {/* Mensaje de error */}
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                <div className="objectives-list">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`objective-button ${creativeOther === option ? "selected" : ""}`}
                            onClick={() => {
                                setCreativeOther(option);
                                setError("");
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button className="back-button" onClick={handleBack} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
                        &#8592; Volver atrás
                    </button>
                    <button className="next-button" onClick={handleNext}>
                        Siguiente
                    </button>
                </div>
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                        <span key={index} style={{ margin: '0 4px', fontSize: index === 4 ? '1rem' : '0.9rem', color: 'gray' }}>
                            &#9679;
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompleteRegistrationCreativoDisenador05;
