import React from 'react';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import EditButton from './EditButton';

const ProfessionalFormationSection = ({
    isProfessionalFormationCollapsed,
    setIsProfessionalFormationCollapsed,
    isProfessionalFormationEditing,
    setIsProfessionalFormationEditing,
    professionalFormationList,
    onProfessionalFormationChange,
    onAddProfessionalFormation,
    onRemoveProfessionalFormation,
    updateProfileData,
    currentDate
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Experiencia Profesional</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsProfessionalFormationCollapsed(!isProfessionalFormationCollapsed)}>
                    {isProfessionalFormationCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isProfessionalFormationCollapsed && (
                <div className="section-content">
                    <div className="professional-formation-list">
                        {Array.isArray(professionalFormationList) && professionalFormationList.map((item, index) => (
                            <div key={index} className="professional-formation-item">
                                <div className="formation-header">
                                    <h4>Experiencia {index + 1}</h4>
                                    {isProfessionalFormationEditing && professionalFormationList.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() => onRemoveProfessionalFormation(index)}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                                <div className="form-group-edit">
                                    <label>Título</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Ej: Curso de diseño de moda"
                                        value={item.title || ''}
                                        onChange={(e) => onProfessionalFormationChange(index, e)}
                                        disabled={!isProfessionalFormationEditing}
                                    />
                                </div>
                                <div className="form-group-edit">
                                    <label>Institución</label>
                                    <input
                                        type="text"
                                        name="institution"
                                        placeholder="Ej: Escuela de Diseño"
                                        value={item.institution || ''}
                                        onChange={(e) => onProfessionalFormationChange(index, e)}
                                        disabled={!isProfessionalFormationEditing}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group-edit">
                                        <label>Fecha de inicio</label>
                                        <input
                                            type="month"
                                            name="startDate"
                                            value={item.startDate || ''}
                                            onChange={(e) => onProfessionalFormationChange(index, e)}
                                            max={item.endDate || currentDate}
                                            disabled={!isProfessionalFormationEditing}
                                        />
                                    </div>
                                    <div className="form-group-edit">
                                        <label>Fecha de finalización</label>
                                        <input
                                            type="month"
                                            name="endDate"
                                            value={item.endDate || ''}
                                            onChange={(e) => onProfessionalFormationChange(index, e)}
                                            min={item.startDate || ''}
                                            max={currentDate}
                                            disabled={!isProfessionalFormationEditing}
                                        />
                                    </div>
                                </div>
                                <div className="form-group-edit">
                                    <label>Descripción</label>
                                    <textarea
                                        name="description"
                                        placeholder="Describe brevemente esta formación"
                                        value={item.description || ''}
                                        onChange={(e) => onProfessionalFormationChange(index, e)}
                                        disabled={!isProfessionalFormationEditing}
                                    />
                                </div>
                            </div>
                        ))}
                        {isProfessionalFormationEditing && (
                            <button
                                type="button"
                                className="add-button"
                                onClick={onAddProfessionalFormation}
                            >
                                + Añadir formación profesional
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
