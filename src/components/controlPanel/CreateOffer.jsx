import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/create-offer.css';

const CreateOffer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: '',
        position: '',
        city: '',
        jobType: 'Tiempo completo',
        locationType: 'Presencial',
        isExternal: false,
        externalLink: '',
        description: '',
        requiredProfile: '',
        tags: []
    });

    const [companyLogo, setCompanyLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCompanyLogo(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setFormData(prev => ({
            ...prev,
            tags
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/', { state: { showRegister: true } });
                return;
            }
    
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const userResponse = await axios.get(`${backendUrl}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log('Datos del formulario a enviar:', formData);
    
            if (userResponse.data.role !== 'Profesional') {
                setError('Solo los usuarios profesionales pueden crear ofertas.');
                setLoading(false);
                return;
            }
    
            const formDataToSend = new FormData();
            
            const requiredFields = {
                companyName: formData.companyName,
                position: formData.position,
                city: formData.city,
                jobType: formData.jobType,
                locationType: formData.locationType,
                description: formData.description,
                requiredProfile: formData.requiredProfile
            };
    
            const missingFields = Object.entries(requiredFields)
                .filter(([_, value]) => !value)
                .map(([key]) => key);
    
            if (missingFields.length > 0) {
                setError(`Faltan campos requeridos: ${missingFields.join(', ')}`);
                setLoading(false);
                return;
            }
    
            Object.keys(formData).forEach(key => {
                if (key === 'tags') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });
    
            if (companyLogo) {
                formDataToSend.append('logo', companyLogo);
            }
    
            const response = await axios.post(
                `${backendUrl}/api/offers/create`,
                formDataToSend,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            if (response.data) {
                navigate('/ControlPanel/misOfertas');
            }
        } catch (err) {
            console.error('Error completo:', err);
            setError(err.response?.data?.message || 'Error al crear la oferta');
        } finally {
            setLoading(false);
        }
    };    

    return (
        <div className="create-offer-container">
            <h2>Crear Nueva Oferta de Trabajo</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="offer-form">
                <div className="form-group">
                    <label>Logo de la Empresa</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                    />
                    {previewLogo && (
                        <div className="logo-preview">
                            <img src={previewLogo} alt="Logo preview" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Nombre de la Empresa*</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Puesto*</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Ciudad*</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Tipo de Contrato*</label>
                    <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        required
                    >
                        <option value="Tiempo completo">Tiempo completo</option>
                        <option value="Tiempo parcial">Tiempo parcial</option>
                        <option value="Prácticas">Prácticas</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Modalidad de Trabajo*</label>
                    <select
                        name="locationType"
                        value={formData.locationType}
                        onChange={handleChange}
                        required
                    >
                        <option value="Presencial">Presencial</option>
                        <option value="Remoto">Remoto</option>
                        <option value="Híbrido">Híbrido</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isExternal"
                            checked={formData.isExternal}
                            onChange={handleChange}
                        />
                        Oferta Externa
                    </label>
                </div>

                {formData.isExternal && (
                    <div className="form-group">
                        <label>Enlace Externo*</label>
                        <input
                            type="url"
                            name="externalLink"
                            value={formData.externalLink}
                            onChange={handleChange}
                            required={formData.isExternal}
                            placeholder="https://..."
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>Descripción del Puesto*</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Describe las responsabilidades y detalles del puesto..."
                    />
                </div>

                <div className="form-group">
                    <label>Perfil Requerido*</label>
                    <textarea
                        name="requiredProfile"
                        value={formData.requiredProfile}
                        onChange={handleChange}
                        required
                        placeholder="Describe el perfil ideal para el puesto..."
                    />
                </div>

                <div className="form-group">
                    <label>Etiquetas (separadas por comas)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags.join(', ')}
                        onChange={handleTagsChange}
                        placeholder="ej: diseño, moda, tiempo completo"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Oferta'}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOffer;
