import React from 'react';

const UserProfessionalExperienceSection = ({ professionalFormation }) => {
    return (
        <section className="user-profile-section">
            <h2>Experiencia profesional</h2>
            <ul className="user-profile-list">
                {professionalFormation && professionalFormation.length > 0 ? (
                    professionalFormation.map((exp, index) => (
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
                    ))
                ) : (
                    <li>No se ha agregado experiencia profesional.</li>
                )}
            </ul>
        </section>
    );
};

export default UserProfessionalExperienceSection;
