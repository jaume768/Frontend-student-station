import React from 'react';

const UserSkillsSection = ({ skills }) => {
    return (
        <section className="user-extern-section">
            <h2>Habilidades</h2>
            <div className="user-extern-skills-tags">
                {skills && skills.length > 0 ? (
                    skills.map((skill, index) => (
                        <span key={index} className="user-extern-skill-tag">{skill}</span>
                    ))
                ) : (
                    <span>No se han agregado habilidades.</span>
                )}
            </div>
        </section>
    );
};

export default UserSkillsSection;
