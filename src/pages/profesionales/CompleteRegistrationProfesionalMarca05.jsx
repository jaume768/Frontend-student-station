// CompleteRegistrationProfesionalMarca05.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationProfesionalMarca05 = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [foundingYear, setFoundingYear] = useState("");
    const [productServiceType, setProductServiceType] = useState("");
    const productOptions = [
        "Confección a medida",
        "Moda vintage",
        "Accesorios",
        "Joyería",
        "Zapatos",
        "Artículos de cuero",
        "Cerámica",
        "Arte textil",
        "Artículos sostenibles",
        "Otro"
    ];

    const handleNext = async () => {
        if (!companyName || !foundingYear || !productServiceType) return;
        try {
            const token = localStorage.getItem("authToken");
            // Actualizamos el usuario con los datos finales para marca pequeña
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ companyName, foundingYear, productServiceType })
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
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 5</p>
                <h2 className="titulo">Últimos datos...</h2>
                <div className="form-group-datos">
                    <label>Nombre de la marca</label>
                    <input
                        type="text"
                        placeholder="Introduce el nombre"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
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
                    <label>¿Cuál es tu producto principal?</label>
                    <select
                        value={productServiceType}
                        onChange={(e) => setProductServiceType(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    >
                        <option value="">Selecciona una opción</option>
                        {productOptions.map((option, index) => (
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
                    <button
                        className="next-button"
                        disabled={!companyName || !foundingYear || !productServiceType}
                        onClick={handleNext}
                    >
                        Siguiente
                    </button>
                </div>
                {/* Paginación: 5 puntos, con el quinto resaltado */}
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                        <span
                            key={index}
                            style={{
                                margin: '0 4px',
                                fontSize: index === 4 ? '1.2rem' : '1rem',
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

export default CompleteRegistrationProfesionalMarca05;
