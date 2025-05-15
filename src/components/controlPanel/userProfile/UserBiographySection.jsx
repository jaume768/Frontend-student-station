import React from 'react';

const UserBiographySection = ({ biography }) => {
    // No renderizar la sección si no hay biografía
    if (!biography || biography.trim() === '') return null;

    return (
        <section className="user-extern-section">
            <h2>Descripción</h2>
            <p>
                {biography}
            </p>
        </section>
    );
};

export default UserBiographySection;
