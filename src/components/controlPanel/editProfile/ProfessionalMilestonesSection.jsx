import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';
import EditButton from './EditButton';

const ProfessionalMilestonesSection = ({
    isProfessionalMilestonesCollapsed,
    setIsProfessionalMilestonesCollapsed,
    isProfessionalMilestonesEditing,
    setIsProfessionalMilestonesEditing,
    professionalMilestones = [],
    handleAddMilestone,
    handleMilestoneChange,
    handleRemoveMilestone,
    updateProfileData
}) => {
    const [newMilestone, setNewMilestone] = useState({
        date: '',
        name: '',
        entity: '',
        description: ''
    });

    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Hitos profesionales</h3>
                <button
                    type="button"
                    className="collapse-toggle"
                    onClick={() => setIsProfessionalMilestonesCollapsed(!isProfessionalMilestonesCollapsed)}
                >
                    {isProfessionalMilestonesCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isProfessionalMilestonesCollapsed && (
                <div className="section-content">
                    <p className="section-description">*El asterisco indica que es obligatorio</p>
                    
                    {Array.isArray(professionalMilestones) && professionalMilestones.map((milestone, index) => (
                        <div key={index} className="milestone-item">
                            <div className="form-group-edit">
                                <label>Fecha del hito*</label>
                                <input
                                    type="text"
                                    name="date"
                                    placeholder="mm / yyyy"
                                    value={milestone.date}
                                    onChange={(e) => handleMilestoneChange(index, e)}
                                    disabled={!isProfessionalMilestonesEditing}
                                />
                            </div>
                            <div className="form-group-edit">
                                <label>Nombre del reconocimiento*</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder='Ejemplo: Premio "Ciutat de Barcelona 2024 en Diseño y Moda"'
                                    value={milestone.name}
                                    onChange={(e) => handleMilestoneChange(index, e)}
                                    disabled={!isProfessionalMilestonesEditing}
                                />
                            </div>
                            <div className="form-group-edit">
                                <label>Entidad*</label>
                                <input
                                    type="text"
                                    name="entity"
                                    placeholder="Ejemplo: Ayuntamiento de Barcelona"
                                    value={milestone.entity}
                                    onChange={(e) => handleMilestoneChange(index, e)}
                                    disabled={!isProfessionalMilestonesEditing}
                                />
                            </div>
                            <div className="form-group-edit">
                                <label>Breve descripción del reconocimiento recibido*</label>
                                <textarea
                                    name="description"
                                    placeholder="Ejemplo: La colección Wet Ballet recibe el reconocimiento a la creatividad y contribución a la moda española."
                                    value={milestone.description}
                                    onChange={(e) => handleMilestoneChange(index, e)}
                                    disabled={!isProfessionalMilestonesEditing}
                                    maxLength={120}
                                />
                                <small>Máximo 120 caracteres</small>
                            </div>
                            {isProfessionalMilestonesEditing && (
                                <button
                                    type="button"
                                    className="remove-button"
                                    onClick={() => handleRemoveMilestone(index)}
                                >
                                    Eliminar hito
                                </button>
                            )}
                        </div>
                    ))}
                    
                    {isProfessionalMilestonesEditing && (
                        <div className="add-milestone">
                            <button
                                type="button"
                                className="add-button"
                                onClick={() => handleAddMilestone()}
                            >
                                <FaPlus /> Añadir hito
                            </button>
                        </div>
                    )}
                    
                    <div className="button-container">
                        <EditButton
                            isEditing={isProfessionalMilestonesEditing}
                            onClick={() => {
                                if (isProfessionalMilestonesEditing) {
                                    updateProfileData();
                                }
                                setIsProfessionalMilestonesEditing(!isProfessionalMilestonesEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfessionalMilestonesSection;
