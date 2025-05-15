import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';

const UserEducationSection = ({ education }) => {
    // No renderizar la sección si no hay educación o está vacía
    if (!education || education.length === 0) return null;
    
    // Filtrar para asegurarse que al menos hay un elemento con datos relevantes
    const validEducation = education.filter(edu => 
        edu.formationName?.trim() || edu.institution?.trim() || edu.otherInstitution?.trim()
    );
    
    if (validEducation.length === 0) return null;
    
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return `${date.getFullYear()}`;
    };

    return (
        <section className="user-extern-section">
            <h2>Formación educativa</h2>
            <div className="user-extern-education-list">
                {validEducation.map((edu, index) => (
                    <div key={index} className="user-extern-education-item">
                        <div className="user-extern-education-dates">
                            {edu.formationStart ? new Date(edu.formationStart).toLocaleDateString() : ""}
                            {" - "}
                            {edu.formationEnd ? new Date(edu.formationEnd).toLocaleDateString() : "Actual"}
                        </div>
                        <div className="user-extern-education-details">
                            <h3>{edu.formationName}</h3>
                            <p>{edu.institution || edu.otherInstitution}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UserEducationSection;
