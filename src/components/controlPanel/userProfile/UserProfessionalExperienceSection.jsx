import React from 'react';
import { FaBriefcase } from 'react-icons/fa';

const UserProfessionalExperienceSection = ({ professionalFormation }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return `${date.getFullYear()}`;
    };

    return (
        <section className="user-extern-section">
            <h2>Experiencia profesional</h2>
            <ul className="user-extern-experience-list">
                {professionalFormation && professionalFormation.length > 0 ? (
                    professionalFormation.map((exp, index) => (
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
                    ))
                ) : (
                    <li>No se ha agregado experiencia profesional.</li>
                )}
            </ul>
        </section>
    );
};

export default UserProfessionalExperienceSection;
