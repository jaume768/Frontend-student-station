import React from 'react';

const UserSoftwareSection = ({ software }) => {
    return (
        <section className="user-profile-section">
            <h2>Software</h2>
            <div className="user-profile-chips">
                {software && software.length > 0 ? (
                    software.map((sw, index) => (
                        <span key={index} className="user-profile-chip">{sw}</span>
                    ))
                ) : (
                    <span>No se ha agregado software.</span>
                )}
            </div>
        </section>
    );
};

export default UserSoftwareSection;
