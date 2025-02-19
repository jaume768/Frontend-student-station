// CompleteRegistrationCreativo02.jsx
import React, { useState, useRef, useEffect } from 'react'; // Añade useEffect
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativo02 = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [minDate, setMinDate] = useState(""); // Nuevo estado para fecha mínima
    const [maxDate, setMaxDate] = useState(""); // Nuevo estado para fecha máxima

    const dateInputRef = useRef(null);

    const countries = [
        "Estados Unidos", "Reino Unido", "Canadá", "Australia", "Alemania",
        "Francia", "Italia", "España", "Brasil", "México",
        "Japón", "China", "India", "Rusia", "Corea del Sur",
        "Países Bajos", "Suiza", "Suecia", "Noruega", "Argentina"
    ];

    // Calcula las fechas mínima y máxima al montar el componente
    useEffect(() => {
        const today = new Date();
        
        // Fecha máxima: Hace 1 año
        const maxDate = new Date(today);
        maxDate.setFullYear(today.getFullYear() - 1);
        setMaxDate(maxDate.toISOString().split("T")[0]);
        
        // Fecha mínima: Hace 90 años
        const minDate = new Date(today);
        minDate.setFullYear(today.getFullYear() - 90);
        setMinDate(minDate.toISOString().split("T")[0]);
    }, []);

    const handleNext = async () => {
        // Validar campos vacíos
        if (!firstName || !lastName || !dateOfBirth || !country || !city) {
            setError("Por favor, completa todos los campos requeridos.");
            return;
        }

        // Validar edad entre 1 y 90 años
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        // Ajustar edad si aún no ha pasado el mes o el día de nacimiento
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        
        if (age < 1 || age > 90) {
            setError("La fecha de nacimiento es incorrecta.");
            return;
        }

        setError(""); // Limpiar error si todo es válido

        const fullName = `${firstName} ${lastName}`;
        try {
            const token = localStorage.getItem("authToken");
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fullName, dateOfBirth, country, city })
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/CompleteRegistrationCreativo03');
            } else {
                setError(data.error || "Ha ocurrido un error.");
            }
        } catch (error) {
            setError("Error en la conexión o en el servidor.");
            console.error(error);
        }
    };


    const handleBack = () => {
        navigate(-1);
    };

    const openCalendar = () => {
        if (dateInputRef.current) {
            if (dateInputRef.current.showPicker) {
                dateInputRef.current.showPicker();
            } else {
                dateInputRef.current.focus();
            }
        }
    };

    return (
        <div className="complete-registration-container">
            <div className="contenedor-registro-objetivo">
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 2</p>
                <h2 className="titulo-objetivo">Datos personales</h2>

                {/* Mensaje de error */}
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                <div className="form-group-datos">
                    <label>Nombre</label>
                    <input
                        type="text"
                        placeholder="Introduce tu nombre"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    />
                </div>
                <div className="form-group-datos">
                    <label>Apellidos</label>
                    <input
                        type="text"
                        placeholder="Introduce tus apellidos"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    />
                </div>
                <div className="form-group-datos">
                    <label>Fecha de nacimiento</label>
                    <div className="input-with-icon" style={{ position: 'relative' }}>
                        <input
                            ref={dateInputRef}
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="input-field"
                            style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                            max={new Date().toISOString().split("T")[0]}
                        />
                        <span
                            className="calendar-icon"
                            onClick={openCalendar}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer'
                            }}
                        >
                            &#128197;
                        </span>
                    </div>
                </div>
                <div className="form-group-datos">
                    <label>País de residencia</label>
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    >
                        <option value="">Selecciona tu país</option>
                        {countries.map((c, index) => (
                            <option key={index} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group-datos">
                    <label>Ciudad de residencia</label>
                    <input
                        type="text"
                        placeholder="Introduce tu ciudad"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    />
                </div>
                <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button className="back-button" onClick={handleBack} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
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
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                        <span
                            key={index}
                            className={`dot ${index === 1 ? "active-dot" : ""}`}
                            style={{
                                margin: '0 4px',
                                fontSize: index === 1 ? '1rem' : '0.9rem',
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

export default CompleteRegistrationCreativo02;
