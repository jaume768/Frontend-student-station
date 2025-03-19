import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import EditButton from './EditButton';

const CompanyContactSection = ({
    isCompanyContactCollapsed,
    setIsCompanyContactCollapsed,
    isCompanyContactEditing,
    setIsCompanyContactEditing,
    companyTags = [],
    handleAddTag,
    handleRemoveTag,
    updateProfileData
}) => {
    const [newTag, setNewTag] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && newTag.trim() && Array.isArray(companyTags) && companyTags.length < 3) {
            e.preventDefault();
            handleAddTag(newTag.trim());
            setNewTag('');
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
                    <p className="section-description">
                        Agrega etiquetas para que otros puedan identificar tu campo de especialización.
                        Intenta que sean claras y concisas. Añade hasta un máximo de 3 etiquetas.
                    </p>
                    
                    <div className="form-group-edit">
                        <div className="tags-container">
                            {Array.isArray(companyTags) && companyTags.map((tag, index) => (
                                <div key={index} className="tag">
                                    {tag}
                                    {isCompanyContactEditing && (
                                        <button 
                                            type="button" 
                                            className="remove-tag" 
                                            onClick={() => handleRemoveTag(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {isCompanyContactEditing && Array.isArray(companyTags) && companyTags.length < 3 && (
                            <div className="tag-input-container">
                                <input
                                    type="text"
                                    placeholder="Escribe y presiona Enter para añadir"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={!isCompanyContactEditing}
                                />
                                <p className="tag-hint">
                                    Presiona "Enter" al finalizar de escribir para añadir una etiqueta. Elimina haciendo clic en la X.
                                </p>
                            </div>
                        )}
                        
                        <div className="practice-options">
                            <label>
                                <input
                                    type="checkbox"
                                    name="practices"
                                    checked={false}
                                    onChange={() => {}}
                                    disabled={!isCompanyContactEditing}
                                />
                                Prácticas
                            </label>
                        </div>
                    </div>
                    
                    <div className="button-container">
                        <EditButton
                            isEditing={isCompanyContactEditing}
                            onClick={() => {
                                if (isCompanyContactEditing) {
                                    updateProfileData();
                                }
                                setIsCompanyContactEditing(!isCompanyContactEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default CompanyContactSection;
