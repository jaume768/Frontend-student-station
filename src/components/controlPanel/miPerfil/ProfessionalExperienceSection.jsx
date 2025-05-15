import React from 'react';

const ProfessionalExperienceSection = ({ professionalFormation }) => {
    // No renderizar la sección si no hay experiencia profesional o está vacía
    if (!professionalFormation || professionalFormation.length === 0) return null;
    
    // Filtrar para asegurarse que al menos hay un elemento con datos relevantes
    const validExperience = professionalFormation.filter(exp => 
        exp.trainingName?.trim() || exp.institution?.trim()
    );
    
    if (validExperience.length === 0) return null;
    
    return (
        <section className="miPerfil-section">
            <h2>Experiencia profesional</h2>
            <ul className="miPerfil-list">
                {validExperience.map((exp, index) => (
                    <li key={index}>
                        <strong>
                            {exp.trainingStart ? new Date(exp.trainingStart).toLocaleDateString() : ""}
                            {" - "}
                            {exp.trainingEnd ? new Date(exp.trainingEnd).toLocaleDateString() : (exp.currentlyInProgress ? "Actual" : "")}
                        </strong>
                        <p>
                            {exp.trainingName} en {exp.institution}
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ProfessionalExperienceSection;
