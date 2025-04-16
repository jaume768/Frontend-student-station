import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ExtraQuestionsForm from './ExtraQuestionsForm';
import VerificationRequiredModal from '../modals/VerificationRequiredModal';
import './css/create-offer.css';

const CreateOffer = () => {
    const navigate = useNavigate();
    const { offerId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        // Especificaciones
        jobType: 'Tiempo completo',
        locationType: 'Presencial',
        duration: '',
        // Ubicación
        city: '',
        country: '',
        // Experiencia
        experienceYears: '',
        // Descripción y funciones
        description: '',
        functions: '',
        // Perfil requerido
        requiredProfile: '',
        // Habilidades
        hardSkills: [],
        softSkills: [],
        // Preguntas extra
        extraQuestions: []
    });

    const [companyLogo, setCompanyLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newHardSkill, setNewHardSkill] = useState('');
    const [newSoftSkill, setNewSoftSkill] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [isVerificatedProfesional, setIsVerificatedProfesional] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    // Determinar si estamos creando o editando una oferta
    useEffect(() => {
        if (offerId) {
            setIsEditing(true);
            loadOfferData();
        }
        
        loadUserData();
    }, [offerId]);

    // Cargar datos del usuario
    const loadUserData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.get(`${backendUrl}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Verificar si el usuario es una empresa/institución y si está verificado
            const user = response.data;
            if (user.role === 'Profesional') {
                setIsVerificatedProfesional(user.isVerificatedProfesional || false);
                
                // Si no es una edición y el usuario no está verificado, mostrar el modal
                if (!offerId && !user.isVerificatedProfesional) {
                    setShowVerificationModal(true);
                }
            }
            
            if (response.data) {
                setFormData(prev => ({
                    ...prev,
                    companyName: response.data.companyName || ''
                }));
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
        }
    };

    // Cargar datos de la oferta para edición
    const loadOfferData = async () => {
        try {
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.get(`${backendUrl}/api/offers/${offerId}`);
            
            const offer = response.data;
            
            // Determinar qué habilidades son técnicas y cuáles son blandas
            // Esta es una lógica simple, puedes ajustarla según tus necesidades
            const hardSkills = [];
            const softSkills = [];
            
            if (offer.tags && offer.tags.length > 0) {
                // Simple heurística: consideramos que las habilidades técnicas suelen tener menos de 15 caracteres
                offer.tags.forEach(tag => {
                    if (tag.length <= 15) {
                        hardSkills.push(tag);
                    } else {
                        softSkills.push(tag);
                    }
                });
            }
            
            setFormData({
                title: offer.position || '',
                jobType: offer.jobType || 'Tiempo completo',
                locationType: offer.locationType || 'Presencial',
                duration: offer.duration || '',
                city: offer.city || '',
                country: offer.country || '',
                experienceYears: offer.experienceYears || '',
                description: offer.description || '',
                functions: offer.functions || '',
                requiredProfile: offer.requiredProfile || '',
                hardSkills,
                softSkills
            });
            
            if (offer.companyLogo) {
                setPreviewLogo(offer.companyLogo);
            }
            
        } catch (error) {
            console.error('Error al cargar datos de la oferta:', error);
            setError('No se pudo cargar la información de la oferta. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

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

    const handleAddHardSkill = () => {
        if (newHardSkill.trim() && !formData.hardSkills.includes(newHardSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                hardSkills: [...prev.hardSkills, newHardSkill.trim()]
            }));
            setNewHardSkill('');
        }
    };

    const handleHardSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddHardSkill();
        }
    };

    const handleAddSoftSkill = () => {
        if (newSoftSkill.trim() && !formData.softSkills.includes(newSoftSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                softSkills: [...prev.softSkills, newSoftSkill.trim()]
            }));
            setNewSoftSkill('');
        }
    };

    const handleSoftSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSoftSkill();
        }
    };

    const handleRemoveHardSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            hardSkills: prev.hardSkills.filter(s => s !== skill)
        }));
    };

    const handleRemoveSoftSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            softSkills: prev.softSkills.filter(s => s !== skill)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Verificar si el usuario es una empresa/institución y si está verificado
        if (!isVerificatedProfesional && !isEditing) {
            setShowVerificationModal(true);
            return;
        }
        
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
    
            if (userResponse.data.role !== 'Profesional') {
                setError('Solo los usuarios profesionales pueden crear ofertas.');
                setLoading(false);
                return;
            }
    
            const formDataToSend = new FormData();
            
            // Validar campos requeridos
            const requiredFields = {
                title: formData.title,
                jobType: formData.jobType,
                locationType: formData.locationType,
                city: formData.city,
                country: formData.country,
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
    
            // Preparar datos para enviar al backend
            const offerData = {
                ...formData,
                position: formData.title, // Para mantener compatibilidad con el backend
                companyName: userResponse.data.companyName
            };
            
            // Convertir habilidades a formato de tags
            offerData.tags = [
                ...formData.hardSkills,
                ...formData.softSkills
            ];
            
            // Añadir todos los campos al FormData
            Object.keys(offerData).forEach(key => {
                if (key === 'hardSkills' || key === 'softSkills') {
                    // Estos ya se han añadido como tags
                } else if (key === 'tags' || key === 'extraQuestions') {
                    formDataToSend.append(key, JSON.stringify(offerData[key]));
                } else {
                    formDataToSend.append(key, offerData[key]);
                }
            });
    
            if (companyLogo) {
                formDataToSend.append('logo', companyLogo);
            }
    
            let response;
            if (isEditing) {
                response = await axios.put(
                    `${backendUrl}/api/offers/${offerId}`,
                    formDataToSend,
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                response = await axios.post(
                    `${backendUrl}/api/offers/create`,
                    formDataToSend,
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }
    
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
            {showVerificationModal && (
                <VerificationRequiredModal onClose={() => setShowVerificationModal(false)} />
            )}
            <h1 className="create-offer-title">{isEditing ? 'Editar oferta de trabajo' : 'Crear oferta de trabajo'}</h1>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="offer-form">
                <div className="form-logo-section">
                    <div className="logo-upload-container">
                        {previewLogo ? (
                            <img src={previewLogo} alt="Logo preview" className="logo-preview" />
                        ) : (
                            <div className="logo-placeholder">
                                <span>+</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="logo-input"
                            id="logo-input"
                        />
                        <label htmlFor="logo-input" className="logo-label">Subir imagen de portada</label>
                    </div>
                    
                    <div className="company-name-container">
                        <span className="company-label">Nombre de la marca</span>
                        <strong className="company-name">{formData.companyName}</strong>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Título de la oferta</h2>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="full-width-input"
                        placeholder="Título de la oferta"
                        required
                    />
                </div>

                <div className="form-section">
                    <h2 className="section-title">Especificaciones</h2>
                    <div className="specifications-grid">
                        <div className="spec-item">
                            <label>Duración</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="Ej: 6 meses"
                            />
                        </div>
                        <div className="spec-item">
                            <label>Ubicación</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Ciudad"
                                required
                            />
                        </div>
                        <div className="spec-item">
                            <label>País</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="País"
                                required
                            />
                        </div>
                        <div className="spec-item">
                            <label>Modalidad</label>
                            <select
                                name="locationType"
                                value={formData.locationType}
                                onChange={handleChange}
                            >
                                <option value="Presencial">Presencial</option>
                                <option value="Remoto">Remoto</option>
                                <option value="Híbrido">Híbrido</option>
                            </select>
                        </div>
                        <div className="spec-item">
                            <label>Contrato</label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                            >
                                <option value="Tiempo completo">Tiempo completo</option>
                                <option value="Tiempo parcial">Tiempo parcial</option>
                                <option value="Prácticas">Prácticas</option>
                            </select>
                        </div>
                        <div className="spec-item">
                            <label>Experiencia</label>
                            <input
                                type="text"
                                name="experienceYears"
                                value={formData.experienceYears}
                                onChange={handleChange}
                                placeholder="Años de experiencia"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Funciones</h2>
                    <textarea
                        name="functions"
                        value={formData.functions}
                        onChange={handleChange}
                        placeholder="Detalla las funciones principales del puesto"
                        className="full-width-textarea"
                    ></textarea>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Descripción</h2>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe el puesto de trabajo y tus expectativas"
                        className="full-width-textarea"
                        required
                    ></textarea>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Describe el perfil ideal</h2>
                    <textarea
                        name="requiredProfile"
                        value={formData.requiredProfile}
                        onChange={handleChange}
                        placeholder="Describe el perfil ideal para el puesto"
                        className="full-width-textarea"
                        required
                    ></textarea>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Hard Skills (Habilidades técnicas)</h2>
                    <div className="skills-input-container">
                        <input
                            type="text"
                            value={newHardSkill}
                            onChange={(e) => setNewHardSkill(e.target.value)}
                            onKeyDown={handleHardSkillKeyDown}
                            placeholder="Añadir habilidad técnica"
                            className="skill-input"
                        />
                        <button 
                            type="button" 
                            className="add-skill-btn"
                            onClick={handleAddHardSkill}
                        >
                            +
                        </button>
                    </div>
                    <div className="skills-tags">
                        {formData.hardSkills.map((skill, index) => (
                            <div key={index} className="skill-tag">
                                {skill}
                                <button 
                                    type="button" 
                                    className="remove-skill-btn"
                                    onClick={() => handleRemoveHardSkill(skill)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Soft Skills (Habilidades blandas)</h2>
                    <div className="skills-input-container">
                        <input
                            type="text"
                            value={newSoftSkill}
                            onChange={(e) => setNewSoftSkill(e.target.value)}
                            onKeyDown={handleSoftSkillKeyDown}
                            placeholder="Añadir habilidad blanda"
                            className="skill-input"
                        />
                        <button 
                            type="button" 
                            className="add-skill-btn"
                            onClick={handleAddSoftSkill}
                        >
                            +
                        </button>
                    </div>
                    <div className="skills-tags">
                        {formData.softSkills.map((skill, index) => (
                            <div key={index} className="skill-tag">
                                {skill}
                                <button 
                                    type="button" 
                                    className="remove-skill-btn"
                                    onClick={() => handleRemoveSoftSkill(skill)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <ExtraQuestionsForm 
                    formData={formData} 
                    setFormData={setFormData} 
                />

                <div className="form-actions-final">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (isEditing ? 'Actualizando oferta...' : 'Publicando oferta...') : (isEditing ? 'Actualizar oferta de trabajo' : 'Crear oferta de trabajo')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOffer;
