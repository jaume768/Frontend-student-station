import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes, FaPlus } from 'react-icons/fa';
import EditButton from './EditButton';

const CompanyContactSection = ({
    isCompanyContactCollapsed,
    setIsCompanyContactCollapsed,
    isCompanyContactEditing,
    setIsCompanyContactEditing,
    companyTags = [],
    handleAddTag,
    handleRemoveTag,
    offersPractices = false,
    setOffersPractices,
    updateProfileData,
    social,
    handleSocialChange
}) => {
    const [newTag, setNewTag] = useState('');
    const [error, setError] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        setError('');
        if (!newTag.trim()) {
            setError('La etiqueta no puede estar vacía');
            return;
        }
        
        if (Array.isArray(companyTags) && companyTags.length >= 3) {
            setError('Máximo 3 etiquetas permitidas');
            return;
        }
        
        if (Array.isArray(companyTags) && companyTags.includes(newTag.trim())) {
            setError('Esta etiqueta ya existe');
            return;
        }
        
        handleAddTag(newTag.trim());
        setNewTag('');
    };

    // Función para manejar guardar los cambios
    const handleSave = () => {
        updateProfileData();
        setIsCompanyContactEditing(false);
    };

    // Función para manejar el cambio en el checkbox de prácticas
    const handlePracticesChange = (e) => {
        if (setOffersPractices) {
            setOffersPractices(e.target.checked);
        }
    };

    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Contacto</h3>
                <button
                    type="button"
                    className="collapse-toggle"
                    onClick={() => setIsCompanyContactCollapsed(!isCompanyContactCollapsed)}
                >
                    {isCompanyContactCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isCompanyContactCollapsed && (
                <div className="section-content">
                    <div className="form-group-edit">
                        <label>Email de contacto</label>
                        <input
                            type="email"
                            name="emailContacto"
                            placeholder="Email de contacto"
                            value={social?.emailContacto || ""}
                            onChange={handleSocialChange}
                            disabled={!isCompanyContactEditing}
                        />
                    </div>
                    <div className="form-group-edit">
                        <label>Sitio web</label>
                        <input
                            type="url"
                            name="sitioWeb"
                            placeholder="https://www.tusitio.com"
                            value={social?.sitioWeb || ""}
                            onChange={handleSocialChange}
                            disabled={!isCompanyContactEditing}
                        />
                    </div>
                    <div className="form-group-edit">
                        <label>Instagram</label>
                        <div className="social-input-container">
                            <span className="social-prefix">instagram.com/</span>
                            <input
                                type="text"
                                name="instagram"
                                placeholder="tu_usuario"
                                value={social?.instagram || ""}
                                onChange={handleSocialChange}
                                disabled={!isCompanyContactEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>LinkedIn</label>
                        <div className="social-input-container">
                            <span className="social-prefix">linkedin.com/in/</span>
                            <input
                                type="text"
                                name="linkedin"
                                placeholder="tu_usuario"
                                value={social?.linkedin || ""}
                                onChange={handleSocialChange}
                                disabled={!isCompanyContactEditing}
                            />
                        </div>
                    </div>
                    
                    <div className="button-container">
                        <EditButton
                            isEditing={isCompanyContactEditing}
                            onClick={() => {
                                if (isCompanyContactEditing) {
                                    handleSave();
                                } else {
                                    setIsCompanyContactEditing(true);
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default CompanyContactSection;
