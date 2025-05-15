import React from 'react';

const UserLanguagesSection = ({ languages }) => {
    if (!languages || languages.length === 0) return null;
    
    return (
        <section className="user-extern-section">
            <h2>Idiomas</h2>
            <div className="user-extern-languages">
                {languages.map((language, index) => (
                    <span key={index} className="creative-type">
                        {language}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default UserLanguagesSection;
