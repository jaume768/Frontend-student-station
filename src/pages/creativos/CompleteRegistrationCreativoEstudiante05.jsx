// CompleteRegistrationCreativoEstudiante05.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativoEstudiante05 = () => {
    const navigate = useNavigate();
    const [formationType, setFormationType] = useState("");

    const handleNext = async () => {
        if (!formationType) return;
        try {
            const token = localStorage.getItem("authToken");
            // Actualizamos formationType en el usuario
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ formationType })
            });
            const data = await response.json();
            if (response.ok) {
                // Si se elige "Estudio en una escuela o universidad" vamos al paso 6; si no, directo al dashboard
                if (formationType === "Estudio en una escuela o universidad") {
                    navigate('/CompleteRegistrationCreativoEstudiante06');
                } else {
                    navigate('/dashboard');
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
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 5</p>
                <h2 className="titulo">Tu formación</h2>
                <p className="question">¿Qué tipo de formación estás cursando actualmente?</p>
                <div className="objectives-list">
                    <button
                        className={`objective-button ${formationType === "Estudio en una escuela o universidad" ? "selected" : ""}`}
                        onClick={() => setFormationType("Estudio en una escuela o universidad")}
                    >
                        Estudio en una escuela o universidad
                    </button>
                    <button
                        className={`objective-button ${formationType === "Me estoy formando por cuenta propia" ? "selected" : ""}`}
                        onClick={() => setFormationType("Me estoy formando por cuenta propia")}
                    >
                        Me estoy formando por cuenta propia
                    </button>
                </div>
                <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button className="back-button" onClick={handleBack} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
                        &#8592; Volver atrás
                    </button>
                    <button className="next-button" disabled={!formationType} onClick={handleNext}>
                        Siguiente
                    </button>
                </div>
                {/* Paginación de 5 puntos con el quinto resaltado */}
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

export default CompleteRegistrationCreativoEstudiante05;
