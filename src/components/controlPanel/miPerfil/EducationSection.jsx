import React from 'react';

const EducationSection = ({ education }) => {
    return (
        <section className="miPerfil-section">
            <h2>Formación educativa</h2>
            <ul className="miPerfil-list">
                {education && education.length > 0 ? (
                    education.map((edu, index) => (
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
                    ))
                ) : (
                    <li>No se ha agregado formación educativa.</li>
                )}
            </ul>
        </section>
    );
};

export default EducationSection;
