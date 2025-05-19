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
    
    // Función para formatear la fecha en formato mes/año
    const formatDate = (month, year) => {
        if (!month || !year) return "";
        return `${month}/${year}`;
    };

    return (
        <section className="user-extern-section">
            <h2>Formación educativa</h2>
            <div className="user-extern-education-list">
                {validEducation.map((edu, index) => (
                    <div key={index} className="user-extern-education-item">
                        <div className="user-extern-education-dates">
                            {/* Mostrar fecha de inicio con el formato mes/año */}
                            {edu.formationStartMonth && edu.formationStartYear ? 
                                formatDate(edu.formationStartMonth, edu.formationStartYear) : ""}
                            {" - "}
                            {/* Mostrar fecha de fin o "Actual" si está cursando actualmente */}
                            {edu.currentlyEnrolled ? 
                                "Actual" : 
                                (edu.formationEndMonth && edu.formationEndYear ? 
                                    formatDate(edu.formationEndMonth, edu.formationEndYear) : "")}
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
