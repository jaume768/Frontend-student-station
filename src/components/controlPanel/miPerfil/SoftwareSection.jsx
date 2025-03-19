import React from 'react';

const SoftwareSection = ({ software }) => {
    return (
        <section className="miPerfil-section">
            <h2>Software</h2>
            <div className="miPerfil-chips">
                {software && software.length > 0 ? (
                    software.map((sw, index) => (
                        <span key={index} className="miPerfil-chip">{sw}</span>
                    ))
                ) : (
                    <span>No se ha agregado software.</span>
                )}
            </div>
        </section>
    );
};

export default SoftwareSection;
