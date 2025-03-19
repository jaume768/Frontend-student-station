import React from 'react';

const BiographySection = ({ biography }) => {
    return (
        <section className="miPerfil-section">
            <h2>Descripción</h2>
            <p>
                {biography || "No hay descripción disponible."}
            </p>
        </section>
    );
};

export default BiographySection;
