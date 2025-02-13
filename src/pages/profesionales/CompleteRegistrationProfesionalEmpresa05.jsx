// CompleteRegistrationProfesionalEmpresa05.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationProfesionalEmpresa05 = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [foundingYear, setFoundingYear] = useState("");
    const [productServiceType, setProductServiceType] = useState("");
    // Los siguientes estados controlan los checkboxes.
    // Si se marcan significa "Prefiero no compartir", de modo que enviaremos false.
    const [shareName, setShareName] = useState(true);
    const [shareYear, setShareYear] = useState(true);
    const productOptions = [
        "Diseño",
        "Retail",
        "Fabricación",
        "Distribución",
        "Accesorios",
        "Calzado",
        "Moda sostenible",
        "Innovación",
        "Otro"
    ];

    const handleNext = async () => {
        if (!companyName || !foundingYear || !productServiceType) return;
        try {
            const token = localStorage.getItem("authToken");
            // Actualizamos el usuario con los datos para empresa
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    companyName,
                    foundingYear,
                    productServiceType,
                    showNameCompany: shareName,
                    showFoundingYearCompany: shareYear
                })
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
                    <label>Nombre de la Empresa</label>
                    <input
                        type="text"
                        placeholder="Introduce el nombre"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                    />
                    <div>
                        <input
                            type="checkbox"
                            checked={!shareName}
                            onChange={(e) => setShareName(!e.target.checked)}
                        />
                        <span>Prefiero no compartir esta información</span>
                    </div>
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
                    <div>
                        <input
                            type="checkbox"
                            checked={!shareYear}
                            onChange={(e) => setShareYear(!e.target.checked)}
                        />
                        <span>Prefiero no compartir esta información</span>
                    </div>
                </div>
                <div className="form-group-datos">
                    <label>¿En qué se enfoca tu empresa?</label>
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

export default CompleteRegistrationProfesionalEmpresa05;
