import React from 'react';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import EditButton from './EditButton';

const ProfessionalFormationSection = ({
    isProfessionalFormationCollapsed,
    setIsProfessionalFormationCollapsed,
    isProfessionalFormationEditing,
    setIsProfessionalFormationEditing,
    professionalFormationList,
    handleProfessionalFormationChange,
    addProfessionalFormation,
    removeProfessionalFormation,
    updateProfileData,
    currentDate
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Formación Profesional</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsProfessionalFormationCollapsed(!isProfessionalFormationCollapsed)}>
                    {isProfessionalFormationCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isProfessionalFormationCollapsed && (
                <div className="section-content">
                    <div className="professional-formation-list">
                        {professionalFormationList.map((item, index) => (
                            <div key={index} className="professional-formation-item">
                                <div className="formation-header">
                                    <h4>Formación {index + 1}</h4>
                                    {isProfessionalFormationEditing && professionalFormationList.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-formation"
                                            onClick={() => removeProfessionalFormation(index)}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                                <div className="form-group-edit">
                                    <label>Nombre de la formación</label>
                                    <input
                                        type="text"
                                        name="trainingName"
                                        placeholder="Ej: Curso de Patronaje"
                                        value={item.trainingName}
                                        onChange={(e) => handleProfessionalFormationChange(index, e)}
                                        disabled={!isProfessionalFormationEditing}
                                    />
                                </div>
                                <div className="form-group-edit">
                                    <label>Institución o empresa</label>
                                    <input
                                        type="text"
                                        name="institution"
                                        placeholder="Ej: Escuela de Moda XYZ"
                                        value={item.institution}
                                        onChange={(e) => handleProfessionalFormationChange(index, e)}
                                        disabled={!isProfessionalFormationEditing}
                                    />
                                </div>
                                <div className="date-range">
                                    <div className="form-group-edit">
                                        <label>Fecha de inicio</label>
                                        <input
                                            type="date"
                                            name="trainingStart"
                                            value={item.trainingStart}
                                            max={currentDate}
                                            onChange={(e) => handleProfessionalFormationChange(index, e)}
                                            disabled={!isProfessionalFormationEditing}
                                        />
                                    </div>
                                    <div className="form-group-edit">
                                        <label>Fecha de finalización</label>
                                        <input
                                            type="date"
                                            name="trainingEnd"
                                            value={item.trainingEnd}
                                            min={item.trainingStart}
                                            max={currentDate}
                                            onChange={(e) => handleProfessionalFormationChange(index, e)}
                                            disabled={!isProfessionalFormationEditing || item.currentlyInProgress}
                                        />
                                    </div>
                                </div>
                                <div className="form-group-edit-checkbox checkbox-group">
                                    <input
                                        type="checkbox"
                                        id={`currentlyInProgress-${index}`}
                                        name="currentlyInProgress"
                                        checked={item.currentlyInProgress}
                                        onChange={(e) => handleProfessionalFormationChange(index, e)}
                                        disabled={!isProfessionalFormationEditing}
                                    />
                                    <label htmlFor={`currentlyInProgress-${index}`}>Actualmente en curso</label>
                                </div>
                            </div>
                        ))}
                        {isProfessionalFormationEditing && (
                            <button type="button" className="add-formation" onClick={addProfessionalFormation}>
                                + Añadir otra formación
                            </button>
                        )}
                    </div>
                    <div className="button-container">
                        <EditButton
                            isEditing={isProfessionalFormationEditing}
                            onClick={() => {
                                if (isProfessionalFormationEditing) {
                                    updateProfileData();
                                }
                                setIsProfessionalFormationEditing(!isProfessionalFormationEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfessionalFormationSection;
