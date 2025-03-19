import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EditButton from './EditButton';

const ProfessionalSummarySection = ({
    isSummaryCollapsed,
    setIsSummaryCollapsed,
    isSummaryEditing,
    setIsSummaryEditing,
    professionalSummary,
    handleProfessionalSummaryChange,
    updateProfileData
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Resumen profesional</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}>
                    {isSummaryCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isSummaryCollapsed && (
                <div className="section-content">
                    <h4>Describe tu recorrido profesional</h4>
                    <div className="form-group-edit">
                        <textarea
                            name="professionalSummary"
                            placeholder="Escribe tu resumen profesional..."
                            value={professionalSummary}
                            onChange={handleProfessionalSummaryChange}
                            maxLength={350}
                            disabled={!isSummaryEditing}
                        />
                        <small className="char-count" style={{ color: professionalSummary.length === 350 ? 'red' : '#4c85ff' }}>
                            {professionalSummary.length === 350 ? "Tu texto supera los 350 caracteres" : "Debe tener un máximo de 350 caracteres"}
                        </small>
                    </div>
                    <div className="button-container">
                        <EditButton
                            isEditing={isSummaryEditing}
                            onClick={() => {
                                if (isSummaryEditing) {
                                    updateProfileData();
                                }
                                setIsSummaryEditing(!isSummaryEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfessionalSummarySection;
