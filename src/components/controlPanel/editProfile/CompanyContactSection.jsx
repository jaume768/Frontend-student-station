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
    updateProfileData
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
                    <p className="section-description">
                        Agrega etiquetas para que otros puedan identificar tu campo de especialización.
                        Intenta que sean claras y concisas. Añade hasta un máximo de 3 etiquetas.
                    </p>
                    
                    <div className="form-group-edit">
                        <div className="tags-container">
                            {Array.isArray(companyTags) && companyTags.length > 0 ? (
                                companyTags.map((tag, index) => (
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
                                ))
                            ) : (
                                <div className="empty-tags">
                                    {isCompanyContactEditing ? (
                                        <p>No hay etiquetas. ¡Añade tu primera etiqueta!</p>
                                    ) : (
                                        <p>No hay etiquetas registradas todavía.</p>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {isCompanyContactEditing && (
                            <div className="tag-input-container">
                                <div className="tag-input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Ejemplo: Moda sostenible"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={Array.isArray(companyTags) && companyTags.length >= 3}
                                    />
                                    <button
                                        type="button"
                                        className="add-tag-button"
                                        onClick={addTag}
                                        disabled={Array.isArray(companyTags) && companyTags.length >= 3}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                
                                {error && <p className="error-message">{error}</p>}
                                
                                <p className="tag-hint">
                                    {Array.isArray(companyTags) && companyTags.length >= 3 ? (
                                        'Has alcanzado el límite de 3 etiquetas.'
                                    ) : (
                                        'Presiona Enter al finalizar de escribir para añadir una etiqueta. Elimina haciendo clic en la X.'
                                    )}
                                </p>
                            </div>
                        )}
                        
                        <div className="practice-options">
                            <label>
                                <input
                                    type="checkbox"
                                    name="practices"
                                    checked={offersPractices}
                                    onChange={handlePracticesChange}
                                    disabled={!isCompanyContactEditing}
                                />
                                Prácticas
                            </label>
                            <p className="tag-hint">
                                Marca esta casilla si tu empresa ofrece prácticas profesionales
                            </p>
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
