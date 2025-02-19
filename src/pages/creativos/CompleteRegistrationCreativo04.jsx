// CompleteRegistrationCreativo04.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativo04 = () => {
    const navigate = useNavigate();
    const [referralSource, setReferralSource] = useState("");
    const [error, setError] = useState(""); // Estado para error

    const referralOptions = [
        "Redes sociales",
        "Boca a boca",
        "Publicidad online",
        "Evento",
        "Recomendación de un amigo",
        "Búsqueda en Google",
        "Otro"
    ];

    const handleNext = async () => {
        if (!referralSource) {
            setError("Por favor, selecciona una opción.");
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
                body: JSON.stringify({ referralSource })
            });
            const data = await response.json();
            if (response.ok) {
                // Recuperamos el rol y, según él, la opción seleccionada en el primer paso
                const role = localStorage.getItem("role"); // "Creativo" o "Profesional"
                if (role === "Creativo") {
                    const creativeType = localStorage.getItem("creativeType");
                    switch (creativeType) {
                        case "1": // Estudiante
                            navigate('/creativo/registro/estudiante/05');
                            break;
                        case "2": // Graduado
                            navigate('/creativo/registro/graduado/06');
                            break;
                        case "3": // Estilista
                            navigate('/creativo/registro/estilista/05');
                            break;
                        case "4": // Diseñador/a activo
                            navigate('/creativo/registro/disenador/05');
                            break;
                        case "5": // Otro
                            navigate('/creativo/registro/otro/05');
                            break;
                        default:
                            navigate('/ControlPanel');
                    }
                } else if (role === "Profesional") {
                    const professionalType = localStorage.getItem("professionalType");
                    switch (professionalType) {
                        case "1": // Una marca pequeña
                            navigate('/profesional/registro/marca/05');
                            break;
                        case "2": // Una empresa
                            navigate('/profesional/registro/empresa/05');
                            break;
                        case "3": // Una agencia/scout
                            navigate('/profesional/registro/agencia/05');
                            break;
                        case "4": // Una institución educativa
                            navigate('/ControlPanel');
                            break;
                        case "5": // Otro
                            navigate('/creativo/registro/otro/05');
                            break;
                        default:
                            navigate('/ControlPanel');
                    }
                } else {
                    navigate('/ControlPanel');
                }
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
                {/* Indicador de paso */}
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 4</p>
                <h2 className="titulo">¿Como nos has conocido?</h2>
                <p className="question">
                    Nos encanta tenerte aquí. Tu respuesta nos ayuda a mejorar y a llegar a más personas como tú.
                </p>

                {/* Mensaje de error */}
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                <div className="form-group-select">
                    <select
                        value={referralSource}
                        onChange={(e) => {
                            setReferralSource(e.target.value);
                            setError("");
                        }}
                        className="input-field-conocido"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    >
                        <option value="">Selecciona una opción</option>
                        {referralOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button
                        className="back-button"
                        onClick={handleBack}
                        style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}
                    >
                        &#8592; Volver atrás
                    </button>
                    <button className="next-button" onClick={handleNext}>
                        Siguiente
                    </button>
                </div>
                {/* Paginación: 5 puntos, con el cuarto más grande */}
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                        <span
                            key={index}
                            style={{
                                margin: '0 4px',
                                fontSize: index === 3 ? '1rem' : '0.9rem',
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

export default CompleteRegistrationCreativo04;
