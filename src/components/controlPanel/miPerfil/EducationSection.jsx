import React from 'react';

const EducationSection = ({ education }) => {
    // No renderizar la sección si no hay educación o está vacía
    if (!education || education.length === 0) return null;
    
    // Filtrar para asegurarse que al menos hay un elemento con datos relevantes
    const validEducation = education.filter(edu => 
        edu.formationName?.trim() || edu.institution?.trim() || edu.otherInstitution?.trim()
    );
    
    if (validEducation.length === 0) return null;
    
    return (
        <section className="miPerfil-section">
            <h2>Formación educativa</h2>
            <ul className="miPerfil-list">
                {validEducation.map((edu, index) => (
                    <li key={index}>
                        <strong>
                            {edu.formationStart ? new Date(edu.formationStart).toLocaleDateString() : ""}
                            {" - "}
                            {edu.formationEnd ? new Date(edu.formationEnd).toLocaleDateString() : "Actual"}
                        </strong>
                        <p>
                            {edu.formationName} en {edu.institution || edu.otherInstitution}
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default EducationSection;
