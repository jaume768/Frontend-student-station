import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EditButton from './EditButton';

const ProfessionalTitleSection = ({
    isProfessionalTitleCollapsed,
    setIsProfessionalTitleCollapsed,
    isProfessionalTitleEditing,
    setIsProfessionalTitleEditing,
    professionalTitle,
    setProfessionalTitle,
    updateProfileData
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Título profesional</h3>
                <button
                    type="button"
                    className="collapse-toggle"
                    onClick={() => setIsProfessionalTitleCollapsed(!isProfessionalTitleCollapsed)}
                >
                    {isProfessionalTitleCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isProfessionalTitleCollapsed && (
                <div className="section-content">
                    <div className="form-group-edit">
                        <label>Título profesional</label>
                        <input
                            type="text"
                            name="professionalTitle"
                            placeholder="Introduce tu título profesional"
                            value={professionalTitle}
                            onChange={(e) => setProfessionalTitle(e.target.value)}
                            disabled={!isProfessionalTitleEditing}
                        />
                    </div>
                    <div className="button-container">
                        <EditButton
                            isEditing={isProfessionalTitleEditing}
                            onClick={() => {
                                if (isProfessionalTitleEditing) {
                                    updateProfileData();
                                }
                                setIsProfessionalTitleEditing(!isProfessionalTitleEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfessionalTitleSection;
