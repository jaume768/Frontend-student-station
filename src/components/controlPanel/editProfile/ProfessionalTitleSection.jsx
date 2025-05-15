import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import EditButton from './EditButton';

const ProfessionalTitleSection = ({
    isProfessionalTitleCollapsed,
    setIsProfessionalTitleCollapsed,
    isProfessionalTitleEditing,
    setIsProfessionalTitleEditing,
    professionalTags,
    setProfessionalTags,
    updateProfileData
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            e.preventDefault();
            if (professionalTags.length >= 3) {
                // Ya tenemos 3 etiquetas (máximo)
                return;
            }
            
            // Verificar si la etiqueta ya existe
            if (!professionalTags.includes(inputValue.trim())) {
                setProfessionalTags([...professionalTags, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeTag = (indexToRemove) => {
        setProfessionalTags(professionalTags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Título profesional</h3>
                <button
                    type="button"
                    className="collapse-toggle"
                    onClick={() => setIsProfessionalTitleCollapsed(!isProfessionalTitleCollapsed)}
                >
                    {isProfessionalTitleCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isProfessionalTitleCollapsed && (
                <div className="section-content">
                    <p className="tag-instruction">
                        Agrega etiquetas para que otros puedan identificar tu campo de especialización.
                        Intenta que sean claras y concisas. Añade hasta un <strong>máximo de 3 etiquetas</strong>.
                    </p>
                    
                    <div className="tags-input-container">
                        {/* Contenedor de etiquetas existentes */}
                        <div className="tags-container">
                            {professionalTags.map((tag, index) => (
                                <div key={index} className="tag">
                                    {tag}
                                    {isProfessionalTitleEditing && (
                                        <button 
                                            type="button" 
                                            className="tag-remove" 
                                            onClick={() => removeTag(index)}
                                            disabled={!isProfessionalTitleEditing}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            {/* Input para agregar nuevas etiquetas */}
                            {isProfessionalTitleEditing && professionalTags.length < 3 && (
                                <input
                                    type="text"
                                    className="tag-input"
                                    placeholder="Escribe aquí."
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    disabled={!isProfessionalTitleEditing}
                                />
                            )}
                        </div>
                    </div>
                    
                    <p className="tag-hint">
                        Presiona "Enter" al finalizar de escribir para añadir una etiqueta. Elimina haciendo clic en la X.
                    </p>
                    
                    <div className="button-container">
                        <EditButton
                            isEditing={isProfessionalTitleEditing}
                            onClick={() => {
                                if (isProfessionalTitleEditing) {
                                    updateProfileData();
                                }
                                setIsProfessionalTitleEditing(!isProfessionalTitleEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfessionalTitleSection;
