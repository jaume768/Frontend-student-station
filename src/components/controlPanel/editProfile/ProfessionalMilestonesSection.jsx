import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa';
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
    // Estado local para validación
    const [errors, setErrors] = useState({});

    // Función para validar los campos antes de guardar
    const validateMilestones = () => {
        let isValid = true;
        const newErrors = {};

        if (Array.isArray(professionalMilestones)) {
            professionalMilestones.forEach((milestone, index) => {
                if (!milestone.date || milestone.date.trim() === '') {
                    newErrors[`date-${index}`] = 'La fecha es obligatoria';
                    isValid = false;
                }
                if (!milestone.name || milestone.name.trim() === '') {
                    newErrors[`name-${index}`] = 'El nombre es obligatorio';
                    isValid = false;
                }
                if (!milestone.entity || milestone.entity.trim() === '') {
                    newErrors[`entity-${index}`] = 'La entidad es obligatoria';
                    isValid = false;
                }
                if (!milestone.description || milestone.description.trim() === '') {
                    newErrors[`description-${index}`] = 'La descripción es obligatoria';
                    isValid = false;
                }
            });
        }

        setErrors(newErrors);
        return isValid;
    };

    // Función para manejar guardar los cambios
    const handleSave = () => {
        if (validateMilestones()) {
            updateProfileData();
            setIsProfessionalMilestonesEditing(false);
        } else {
            // Mostrar mensaje de error si la validación falla
            alert('Por favor, completa todos los campos obligatorios marcados con *');
        }
    };
    
    // Asegurarse de que siempre haya al menos un hito vacío cuando se está editando
    // y no hay hitos existentes
    React.useEffect(() => {
        if (isProfessionalMilestonesEditing && 
            (!Array.isArray(professionalMilestones) || professionalMilestones.length === 0)) {
            handleAddMilestone();
        }
    }, [isProfessionalMilestonesEditing]);

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

                    {Array.isArray(professionalMilestones) && professionalMilestones.length > 0 ? (
                        professionalMilestones.map((milestone, index) => (
                            <div key={index} className="milestone-item">
                                <div className="form-group-edit">
                                    <label>Fecha del hito*</label>
                                    <input
                                        type="text"
                                        name="date"
                                        placeholder="mm / yyyy"
                                        value={milestone.date || ''}
                                        onChange={(e) => handleMilestoneChange(index, e)}
                                        disabled={!isProfessionalMilestonesEditing}
                                    />
                                    {errors[`date-${index}`] && (
                                        <span className="error-message">{errors[`date-${index}`]}</span>
                                    )}
                                </div>
                                <div className="form-group-edit">
                                    <label>Nombre del reconocimiento*</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder='Ejemplo: Premio "Ciutat de Barcelona 2024 en Diseño y Moda"'
                                        value={milestone.name || ''}
                                        onChange={(e) => handleMilestoneChange(index, e)}
                                        disabled={!isProfessionalMilestonesEditing}
                                    />
                                    {errors[`name-${index}`] && (
                                        <span className="error-message">{errors[`name-${index}`]}</span>
                                    )}
                                </div>
                                <div className="form-group-edit">
                                    <label>Entidad*</label>
                                    <input
                                        type="text"
                                        name="entity"
                                        placeholder="Ejemplo: Ayuntamiento de Barcelona"
                                        value={milestone.entity || ''}
                                        onChange={(e) => handleMilestoneChange(index, e)}
                                        disabled={!isProfessionalMilestonesEditing}
                                    />
                                    {errors[`entity-${index}`] && (
                                        <span className="error-message">{errors[`entity-${index}`]}</span>
                                    )}
                                </div>
                                <div className="form-group-edit">
                                    <label>Breve descripción del reconocimiento recibido*</label>
                                    <textarea
                                        name="description"
                                        placeholder="Ejemplo: La colección Wet Ballet recibe el reconocimiento a la creatividad y contribución a la moda española."
                                        value={milestone.description || ''}
                                        onChange={(e) => handleMilestoneChange(index, e)}
                                        disabled={!isProfessionalMilestonesEditing}
                                        maxLength={120}
                                    />
                                    <small>Máximo 120 caracteres</small>
                                    {errors[`description-${index}`] && (
                                        <span className="error-message">{errors[`description-${index}`]}</span>
                                    )}
                                </div>
                                {isProfessionalMilestonesEditing && (
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => handleRemoveMilestone(index)}
                                    >
                                        <FaTrash /> Eliminar hito
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="empty-section">
                            {isProfessionalMilestonesEditing ? (
                                <p>No hay hitos profesionales. ¡Añade tu primer hito!</p>
                            ) : (
                                <p>No hay hitos profesionales registrados todavía.</p>
                            )}
                        </div>
                    )}

                    {isProfessionalMilestonesEditing && (
                        <div className="add-milestone">
                            <button
                                type="button"
                                className="add-button"
                                onClick={() => {
                                    handleAddMilestone();
                                }}
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
                                    handleSave();
                                } else {
                                    // Si no hay hitos, añadir uno vacío al entrar en modo edición
                                    if (!Array.isArray(professionalMilestones) || professionalMilestones.length === 0) {
                                        handleAddMilestone();
                                    }
                                    setIsProfessionalMilestonesEditing(true);
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfessionalMilestonesSection;
