// CompleteRegistrationProfesionalInstitucion.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationProfesionalInstitucion = () => {
    const navigate = useNavigate();
    const [institutionName, setInstitutionName] = useState("");
    const [foundingYear, setFoundingYear] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");

    const countries = [
        "Estados Unidos", "Reino Unido", "Canadá", "Australia", "Alemania",
        "Francia", "Italia", "España", "Brasil", "México",
        "Japón", "China", "India", "Rusia", "Corea del Sur",
        "Países Bajos", "Suiza", "Suecia", "Noruega", "Argentina"
    ];

    const handleNext = async () => {
        if (!institutionName || !foundingYear || !country || !city) return;
        try {
            const token = localStorage.getItem("authToken");
            // Actualizamos el usuario con los datos de la institución
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ companyName: institutionName, foundingYear, country, city })
            });
            const data = await response.json();
            if (response.ok) {
                // Luego se comparten las pantallas comunes (foto de perfil, referral, etc.)
                navigate('/CompleteRegistrationCreativo03');
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
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 2</p>
                <h2 className="titulo">Datos de registro</h2>
                <div className="form-group-datos">
                    <label>Nombre de la institución educativa</label>
                    <input
                        type="text"
                        placeholder="Introduce el nombre"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    />
                </div>
                <div className="form-group-datos">
                    <label>Año de la fundación</label>
                    <input
                        type="text"
                        placeholder="yyyy"
                        value={foundingYear}
                        onChange={(e) => setFoundingYear(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    />
                </div>
                <div className="form-group-datos">
                    <label>País de la sede</label>
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    >
                        <option value="">Selecciona el país</option>
                        {countries.map((c, index) => (
                            <option key={index} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group-datos">
                    <label>Ciudad de la sede</label>
                    <input
                        type="text"
                        placeholder="Introduce la ciudad"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    />
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
                        disabled={!institutionName || !foundingYear || !country || !city}
                        onClick={handleNext}
                    >
                        Siguiente
                    </button>
                </div>
                {/* Paginación: 5 puntos, con el segundo resaltado */}
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                        <span
                            key={index}
                            style={{
                                margin: '0 4px',
                                fontSize: index === 1 ? '1.2rem' : '1rem',
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

export default CompleteRegistrationProfesionalInstitucion;
