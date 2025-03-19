import React from 'react';

const UserSkillsSection = ({ skills }) => {
    return (
        <section className="user-profile-section">
            <h2>Habilidades</h2>
            <div className="user-profile-chips">
                {skills && skills.length > 0 ? (
                    skills.map((skill, index) => (
                        <span key={index} className="user-profile-chip">{skill}</span>
                    ))
                ) : (
                    <span>No se han agregado habilidades.</span>
                )}
            </div>
        </section>
    );
};

export default UserSkillsSection;
