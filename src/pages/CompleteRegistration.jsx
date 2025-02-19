import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/complete-registration.css';

const CompleteRegistration = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = location.state || { username: "Usuario" };

    const [selectedObjective, setSelectedObjective] = useState("");
    const [error, setError] = useState("");
    const [userLoaded, setUserLoaded] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('authToken', token);
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const intervalId = setInterval(async () => {
            try {
                const response = await fetch(`${backendUrl}/api/users/profile`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    setUserLoaded(true);
                    clearInterval(intervalId);
                }
            } catch (err) {
                // Puede que aún no esté creado, seguimos intentando
            }
        }, 500);

        return () => clearInterval(intervalId);
    }, [backendUrl]);

    const objectives = [
        "Crear mi portafolio",
        "Conectar con creativos",
        "Contratar talento",
        "Ofrecer prácticas",
        "Soy una institución educativa"
    ];

    const handleNext = async () => {
        if (!selectedObjective) {
            setError("Por favor, selecciona tu objetivo en la plataforma.");
            return;
        }
        setError("");
        let role = "";
        if (selectedObjective === objectives[0] || selectedObjective === objectives[1]) {
            role = "Creativo";
        } else {
            role = "Profesional";
        }

        if (!userLoaded) {
            setError("Aún estamos preparando tu cuenta, por favor espera un momento...");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${backendUrl}/api/users/profile`, {
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
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="complete-registration-container">
            <div className="contenedor-registro-objetivo">
                <h1 className="greeting">Hola,</h1>
                <h2 className="username">@{username}!</h2>
                <p className="question">¿Cuál es tu objetivo en la plataforma?</p>
                <div className="objectives-list">
                    {objectives.map((obj, index) => (
                        <button
                            key={index}
                            className={`objective-button ${selectedObjective === obj ? "selected" : ""}`}
                            onClick={() => {
                                setSelectedObjective(obj);
                                setError("");
                            }}
                        >
                            {obj}
                        </button>
                    ))}
                </div>
                {error && <p className="error-message">{error}</p>}
                <button
                    className="next-button-primer"
                    onClick={handleNext}
                    disabled={!userLoaded}
                >
                    {userLoaded ? "Siguiente" : "Cargando..."}
                </button>
            </div>
        </div>
    );
};

export default CompleteRegistration;
