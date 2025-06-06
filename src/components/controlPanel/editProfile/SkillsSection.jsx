import React from 'react';
import { FaChevronDown, FaChevronUp, FaTimes, FaPlus } from 'react-icons/fa';
import EditButton from './EditButton';

const SkillsSection = ({
    isHabilidadesCollapsed,
    setIsHabilidadesCollapsed,
    isHabilidadesEditing,
    setIsHabilidadesEditing,
    skills,
    newSkill,
    setNewSkill,
    handleSkillKeyDown,
    removeSkill,
    popularSkills,
    addPopularSkill,
    updateProfileData
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Habilidades blandas (Softskills)</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsHabilidadesCollapsed(!isHabilidadesCollapsed)}>
                    {isHabilidadesCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isHabilidadesCollapsed && (
                <div className="section-content">
                    <p className="tag-instruction">
                        Agrega etiquetas para que otros puedan identificar tus habilidades. Intenta que
                        sean claras y concisas. Añade hasta un <strong>máximo de 5 etiquetas</strong>.
                    </p>
                    
                    <div className="tags-input-container">
                        <div className="tags-container">
                            {Array.isArray(skills) && skills.map((skill, index) => (
                                <div key={index} className="tag">
                                    {skill}
                                    {isHabilidadesEditing && (
                                        <button
                                            type="button"
                                            className="tag-remove"
                                            onClick={() => removeSkill(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            {/* Input para añadir etiquetas escribiendo */}
                            {isHabilidadesEditing && skills.length < 5 && (
                                <input
                                    type="text"
                                    className="tag-input"
                                    placeholder="Escribe aquí."
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={handleSkillKeyDown}
                                    maxLength={50}
                                />
                            )}
                        </div>
                    </div>

                    <p className="tag-hint">
                        Presiona "Enter" al finalizar de escribir para añadir una etiqueta. Elimina haciendo clic en la X.
                    </p>
                    {isHabilidadesEditing && (
                        <>
                            {Array.isArray(skills) && skills.length < 5 && (
                                <div className="popular-tags-container">
                                    <h4>Habilidades populares</h4>
                                    <div className="popular-tags">
                                        {popularSkills.map((skill, index) => (
                                            <div
                                                key={index}
                                                className="popular-tag"
                                                onClick={() => addPopularSkill(skill)}
                                            >
                                                {skill}
                                                <span className="add-tag"><FaPlus /></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    
                    <div className="button-container">
                        <EditButton
                            isEditing={isHabilidadesEditing}
                            onClick={() => {
                                if (isHabilidadesEditing) {
                                    updateProfileData();
                                }
                                setIsHabilidadesEditing(!isHabilidadesEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default SkillsSection;
