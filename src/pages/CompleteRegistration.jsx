// CompleteRegistration.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/complete-registration.css';

const CompleteRegistration = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = location.state || { username: "Usuario" };

    const [selectedObjective, setSelectedObjective] = useState("");
    const objectives = [
        "Crear mi portafolio",
        "Conectar con creativos",
        "Contratar talento",
        "Ofrecer prácticas",
        "Soy una institución educativa"
    ];

    const handleNext = async () => {
        // Determinar el rol según el objetivo seleccionado
        let role = "";
        if (selectedObjective === objectives[0] || selectedObjective === objectives[1]) {
            role = "Creativo";
        } else {
            role = "Profesional";
        }

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("role", role);
                if (role === "Creativo") {
                    navigate('/CompleteRegistrationCreativo');
                } else {
                    navigate('/CompleteRegistrationProfesional');
                }
            }
             else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="complete-registration-container">
            <div className='contenedor-registro-objetivo'>
                <h1 className="greeting">Hola,</h1>
                <h2 className="username">@{username}!</h2>
                <p className="question">¿Cuál es tu objetivo en la plataforma?</p>
                <div className="objectives-list">
                    {objectives.map((obj, index) => (
                        <button
                            key={index}
                            className={`objective-button ${selectedObjective === obj ? "selected" : ""}`}
                            onClick={() => setSelectedObjective(obj)}
                        >
                            {obj}
                        </button>
                    ))}
                </div>
                <button
                    className="next-button"
                    disabled={!selectedObjective}
                    onClick={handleNext}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default CompleteRegistration;
