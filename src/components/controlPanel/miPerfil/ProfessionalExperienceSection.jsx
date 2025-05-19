import React from 'react';

const ProfessionalExperienceSection = ({ professionalFormation }) => {
    // No renderizar la sección si no hay experiencia profesional o está vacía
    if (!professionalFormation || professionalFormation.length === 0) return null;
    
    // Filtrar para asegurarse que al menos hay un elemento con datos relevantes
    const validExperience = professionalFormation.filter(exp => 
        exp.title?.trim() || exp.institution?.trim()
    );
    
    if (validExperience.length === 0) return null;
    
    return (
        <section className="miPerfil-section">
            <h2>Experiencia profesional</h2>
            <ul className="miPerfil-list">
                {validExperience.map((exp, index) => (
                    <li key={index}>
                        <strong>
                            {/* Mostrar fecha de inicio con el formato mes/año */}
                            {exp.startMonth && exp.startYear ? 
                                `${exp.startMonth}/${exp.startYear}` : ""}
                            {" - "}
                            {/* Mostrar fecha de fin o "Actual" si está cursando actualmente */}
                            {exp.currentlyWorking ? 
                                "Actual" : 
                                (exp.endMonth && exp.endYear ? 
                                    `${exp.endMonth}/${exp.endYear}` : "")}
                        </strong>
                        <p>
                            {exp.title} en {exp.institution}
                            {exp.description && <div className="experience-description">{exp.description}</div>}
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ProfessionalExperienceSection;
