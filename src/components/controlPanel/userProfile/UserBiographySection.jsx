import React from 'react';

const UserBiographySection = ({ biography }) => {
    return (
        <section className="user-profile-section">
            <h2>Descripción</h2>
            <p>
                {biography || "No hay descripción disponible."}
            </p>
        </section>
    );
};

export default UserBiographySection;
