import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';

const UserEducationSection = ({ education }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return `${date.getFullYear()}`;
    };

    return (
        <section className="user-extern-section">
            <h2>Formación educativa</h2>
            <ul className="user-extern-education-list">
                {education && education.length > 0 ? (
                    education.map((edu, index) => (
                        <li key={index} className="user-extern-education-item">
                            <div className="user-extern-education-icon">
                                <FaGraduationCap />
                            </div>
                            <div className="user-extern-education-content">
                                <div className="user-extern-education-title">{edu.formationName}</div>
                                <div className="user-extern-education-institution">{edu.institution || edu.otherInstitution}</div>
                                <div className="user-extern-education-date">
                                    {formatDate(edu.formationStart)} - {edu.currentlyInProgress ? "Actual" : formatDate(edu.formationEnd)}
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No se ha agregado formación educativa.</li>
                )}
            </ul>
        </section>
    );
};

export default UserEducationSection;
