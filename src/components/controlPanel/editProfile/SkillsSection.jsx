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
                <h3>Habilidades destacadas</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsHabilidadesCollapsed(!isHabilidadesCollapsed)}>
                    {isHabilidadesCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isHabilidadesCollapsed && (
                <div className="section-content">
                    <div className="form-group-edit">
                        <div className="tags-container">
                            {Array.isArray(skills) && skills.map((skill, index) => (
                                <div key={index} className="tag">
                                    {skill}
                                    {isHabilidadesEditing && (
                                        <button
                                            type="button"
                                            className="remove-tag"
                                            onClick={() => removeSkill(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isHabilidadesEditing && (
                            <>
                                {Array.isArray(skills) && skills.length < 12 && (
                                    <div className="skill-input-container">
                                        <input
                                            type="text"
                                            placeholder="Añadir habilidad y pulsar Enter"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={handleSkillKeyDown}
                                            maxLength={50}
                                        />
                                        <small className="info-text">Puedes añadir hasta 12 habilidades</small>
                                    </div>
                                )}
                                <div className="popular-tags">
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
                            </>
                        )}
                    </div>
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
