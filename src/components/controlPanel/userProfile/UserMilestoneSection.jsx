import React from 'react';
import { FaAward } from 'react-icons/fa';

const UserMilestoneSection = ({ professionalMilestones }) => {
    if (!Array.isArray(professionalMilestones) || professionalMilestones.length === 0) {
        return (
            <div className="profile-section-userP">
                <h3 className="section-title-userP">
                    <FaAward className="section-icon-userP" />
                    Hitos profesionales
                </h3>
                <p className="no-data-message-userP">No hay hitos profesionales registrados.</p>
            </div>
        );
    }

    return (
        <div className="profile-section-userP">
            <h3 className="section-title-userP">
                <FaAward className="section-icon-userP" />
                Hitos profesionales
            </h3>
            <div className="milestones-container-userP">
                {professionalMilestones.map((milestone, index) => (
                    <div key={index} className="milestone-item-userP">
                        <div className="milestone-header-userP">
                            <h4 className="milestone-title-userP">{milestone.name}</h4>
                            <span className="milestone-date-userP">{milestone.date}</span>
                        </div>
                        <div className="milestone-entity-userP">{milestone.entity}</div>
                        {milestone.description && (
                            <p className="milestone-description-userP">{milestone.description}</p>
                        )}
                        {index < professionalMilestones.length - 1 && <hr className="milestone-divider-userP" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserMilestoneSection;
