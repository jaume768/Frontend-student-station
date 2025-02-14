// CompleteRegistrationCreativo03.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativo03 = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState(""); // Estado para error
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleNext = () => {
        // Si se requiere que el usuario suba una foto, se puede validar aquí.
        // Por ejemplo:
        // if (!selectedImage) {
        //   setError("Por favor, sube una foto de perfil.");
        //   return;
        // }
        // En este caso se permite avanzar sin imagen (se usará la foto por defecto)
        setError("");
        navigate('/CompleteRegistrationCreativo04');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="complete-registration-container">
            <div className="contenedor-registro-objetivo">
                <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 3</p>
                <h2 className="titulo">Tu foto de perfil</h2>
                <p className="question">No te preocupes, puedes modificar tu foto en cualquier momento</p>

                {/* Mensaje de error (si se requiere) */}
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                    <img
                        src={selectedImage || 'multimedia/usuarioDefault.jpg'}
                        alt="Foto de perfil"
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <button className="next-button" onClick={handleUploadClick}>
                            Subir una foto
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <div className="pagination-dots" style={{ marginTop: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                        <span
                            key={index}
                            style={{
                                margin: '0 4px',
                                fontSize: index === 2 ? '1rem' : '0.9rem',
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

export default CompleteRegistrationCreativo03;
