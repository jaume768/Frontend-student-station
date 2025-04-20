import React from 'react';
import { FaAward } from 'react-icons/fa';

const MilestoneSection = ({ professionalMilestones }) => {
    if (!Array.isArray(professionalMilestones) || professionalMilestones.length === 0) {
        return (
            <div className="profile-section">
                <h3 className="section-title">
                    <FaAward className="section-icon" />
                    Hitos profesionales
                </h3>
                <p className="no-data-message">No hay hitos profesionales registrados.</p>
            </div>
        );
    }

    return (
        <div className="profile-section">
            <h3 className="section-title">
                Hitos profesionales
            </h3>
            <div className="milestones-container">
                {professionalMilestones.map((milestone, index) => (
                    <div key={index} className="milestone-item">
                        <div className="milestone-header">
                            <h4 className="milestone-title">{milestone.name}</h4>
                            <span className="milestone-date">{milestone.date}</span>
                        </div>
                        <div className="milestone-entity">{milestone.entity}</div>
                        {milestone.description && (
                            <p className="milestone-description">{milestone.description}</p>
                        )}
                        {index < professionalMilestones.length - 1 && <hr className="milestone-divider" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MilestoneSection;
