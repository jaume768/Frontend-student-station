// CompleteRegistrationCreativoGraduado06.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativoGraduado06 = () => {
    const navigate = useNavigate();
    const [institution, setInstitution] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [error, setError] = useState(""); // Estado para error

    const handleYearChange = (e) => {
        setGraduationYear(e.target.value);
    };

    const handleCalendarClick = () => {
        // Simulación: asignamos el año actual
        const now = new Date();
        setGraduationYear(now.getFullYear().toString());
    };

    const handleNext = async () => {
        if (!institution || !graduationYear) {
            setError("Por favor, completa todos los campos requeridos.");
            return;
        }

        // Validación del año de graduación:
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 90;
        const yearNum = parseInt(graduationYear, 10);

        if (isNaN(yearNum) || yearNum < minYear || yearNum > currentYear) {
            setError(`Fecha incorrecta: el año debe estar entre ${minYear} y ${currentYear}.`);
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
                body: JSON.stringify({ institution, profileCompleted: true })
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
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 6</p>
                <h2 className="titulo">Tu última formación</h2>
                <p className="question">¿En qué universidad o escuela estudiaste?</p>

                {/* Mensaje de error */}
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                <div className="form-group-datos">
                    <label>¿En qué universidad o escuela estudias?</label>
                    <input
                        type="text"
                        placeholder="Introduce tu universidad"
                        value={institution}
                        onChange={(e) => {
                            setInstitution(e.target.value);
                            setError("");
                        }}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    />
                </div>
                <div className="form-group-datos">
                    <label>Año de la graduación:</label>
                    <div className="input-with-icon" style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="yyyy"
                            value={graduationYear}
                            onChange={handleYearChange}
                            className="input-field"
                            style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                        />
                        <span
                            className="calendar-icon"
                            onClick={handleCalendarClick}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        >
                            &#128197;
                        </span>
                    </div>
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
                        onClick={handleNext}
                    >
                        Siguiente
                    </button>
                </div>
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5, 6].map((dot, index) => (
                        <span
                            key={index}
                            style={{ margin: '0 4px', fontSize: index === 5 ? '1rem' : '0.9rem', color: 'gray' }}
                        >
                            &#9679;
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompleteRegistrationCreativoGraduado06;
