// CompleteRegistrationCreativoEstudiante06.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/complete-registration.css';

const CompleteRegistrationCreativoEstudiante06 = () => {
    const navigate = useNavigate();
    const [institution, setInstitution] = useState("");
    const [graduationDate, setGraduationDate] = useState("");

    const handleDateChange = (e) => {
        setGraduationDate(e.target.value);
    };

    const handleCalendarClick = () => {
        // Ejemplo de asignación automática: se usa la fecha actual en formato mm/yy
        const now = new Date();
        const month = ("0" + (now.getMonth() + 1)).slice(-2);
        const year = now.getFullYear().toString().slice(-2);
        setGraduationDate(`${month}/${year}`);
    };

    const handleNext = async () => {
        if (!institution || !graduationDate) return;
        try {
            const token = localStorage.getItem("authToken");
            // Actualizamos el campo institution (graduationDate se puede almacenar aparte si fuera necesario)
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ institution })
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
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 6</p>
                <h2 className="titulo">Tu formación</h2>
                <p className="question">¿Qué tipo de formación estás cursando actualmente?</p>
                <div className="form-group-datos">
                    <label>¿En qué universidad o escuela estudias?</label>
                    <input
                        type="text"
                        placeholder="Introduce tu universidad"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    />
                </div>
                <div className="form-group-datos">
                    <label>Fecha de graduación prevista:</label>
                    <div className="input-with-icon" style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="mm/yy"
                            value={graduationDate}
                            onChange={handleDateChange}
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
                    <button className="back-button" onClick={handleBack} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
                        &#8592; Volver atrás
                    </button>
                    <button className="next-button" disabled={!institution || !graduationDate} onClick={handleNext}>
                        Siguiente
                    </button>
                </div>
                {/* Paginación: en este caso, mostramos 6 puntos con el sexto resaltado */}
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5, 6].map((dot, index) => (
                        <span key={index} style={{ margin: '0 4px', fontSize: index === 5 ? '1.2rem' : '1rem', color: 'gray' }}>
                            &#9679;
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompleteRegistrationCreativoEstudiante06;
