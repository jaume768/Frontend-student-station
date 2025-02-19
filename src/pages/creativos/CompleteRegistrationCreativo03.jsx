// CompleteRegistrationCreativo03.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativo03 = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setFile(file);
            setError("");
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleNext = async () => {
        if (!file) {
            setError("Por favor, sube una foto de perfil.");
            return;
        }
        setIsUploading(true);

        try {
            const token = localStorage.getItem("authToken");
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${backendUrl}/api/users/profile-picture`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/conocidos/registro/04');
            } else {
                setError(data.error || "Error al actualizar la foto.");
            }
        } catch (err) {
            console.error(err);
            setError("Error en la conexión o en el servidor.");
        }
        setIsUploading(false);
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

                {/* Mostrar error si lo hay */}
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
                    <button className="next-button" onClick={handleNext} disabled={isUploading}>
                        {isUploading ? "Actualizando foto..." : "Siguiente"}
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
