// CompleteRegistrationCreativo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativo = () => {
    const navigate = useNavigate();
    const [creativeType, setCreativeType] = useState(null);
    const [error, setError] = useState(""); // Estado para error

    const creativeOptions = [
        "Estudiante",
        "Graduado",
        "Estilista",
        "Diseñador/a activo",
        "Otro"
    ];

    const handleNext = async () => {
        if (!creativeType) {
            setError("Por favor, selecciona tu rol.");
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
                body: JSON.stringify({ creativeType })
            });
            const data = await response.json();
            if (response.ok) {
                // Almacena el creativeType para usarlo en pasos posteriores
                localStorage.setItem("creativeType", creativeType);
                navigate('/creativo/registro/02');
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
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 1</p>
                <h1 className="greeting">¿Cuál es tu rol?</h1>
                <h2 className="titulo-objetivo">Soy...</h2>

                {/* Mensaje de error */}
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                <div className="objectives-list">
                    {creativeOptions.map((option, index) => (
                        <button
                            key={index}
                            className={`objective-button ${creativeType === index + 1 ? "selected" : ""}`}
                            onClick={() => {
                                setCreativeType(index + 1);
                                setError(""); // Limpiamos el error al seleccionar
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
                        <span
                            key={index}
                            className={`dot ${index === 0 ? "active-dot" : ""}`}
                            style={{
                                margin: '0 4px',
                                fontSize: index === 0 ? '1rem' : '0.9rem',
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
