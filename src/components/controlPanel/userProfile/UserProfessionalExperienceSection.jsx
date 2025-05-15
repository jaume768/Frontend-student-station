import React from 'react';
import { FaBriefcase } from 'react-icons/fa';

const UserProfessionalExperienceSection = ({ professionalFormation }) => {
    // No renderizar la sección si no hay experiencia profesional o está vacía
    if (!professionalFormation || professionalFormation.length === 0) return null;
    
    // Filtrar para asegurarse que al menos hay un elemento con datos relevantes
    const validExperience = professionalFormation.filter(exp => 
        exp.trainingName?.trim() || exp.institution?.trim()
    );
    
    if (validExperience.length === 0) return null;
    
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <section className="user-extern-section">
            <h2>Experiencia profesional</h2>
            <ul className="user-extern-experience-list">
                {validExperience.map((exp, index) => (
                    <li key={index} className="user-extern-experience-item">
                        <div className="user-extern-experience-icon">
                            <FaBriefcase />
                        </div>
                        <div className="user-extern-experience-content">
                            <div className="user-extern-experience-title">{exp.trainingName}</div>
                            <div className="user-extern-experience-company">{exp.institution}</div>
                            <div className="user-extern-experience-date">
                                {formatDate(exp.trainingStart)} - {exp.currentlyInProgress ? "Actual" : formatDate(exp.trainingEnd)}
                                {exp.duration && ` · ${exp.duration}`}
                            </div>
                            {exp.description && (
                                <div className="user-extern-experience-description">{exp.description}</div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default UserProfessionalExperienceSection;
