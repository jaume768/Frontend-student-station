import React from 'react';

const UserSoftwareSection = ({ software }) => {
    return (
        <section className="user-extern-section">
            <h2>Software</h2>
            <div className="user-extern-software-list">
                {software && software.length > 0 ? (
                    software.map((sw, index) => (
                        <span key={index} className="user-extern-software-item">{sw}</span>
                    ))
                ) : (
                    <span>No se ha agregado software.</span>
                )}
            </div>
        </section>
    );
};

export default UserSoftwareSection;
