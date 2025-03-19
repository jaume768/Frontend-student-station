import React from 'react';

const SkillsSection = ({ skills }) => {
    return (
        <section className="miPerfil-section">
            <h2>Habilidades</h2>
            <div className="miPerfil-chips">
                {skills && skills.length > 0 ? (
                    skills.map((skill, index) => (
                        <span key={index} className="miPerfil-chip">{skill}</span>
                    ))
                ) : (
                    <span>No se han agregado habilidades.</span>
                )}
            </div>
        </section>
    );
};

export default SkillsSection;
