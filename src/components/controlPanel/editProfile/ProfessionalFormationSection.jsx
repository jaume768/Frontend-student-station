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
                                <div className="date-range">
                                    <div className="form-group-edit">
                                        <label>Fecha de inicio</label>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <div style={{ flex: '0.4' }}>
                                                <label style={{ fontSize: '0.85rem', marginBottom: '2px', display: 'block' }}>Mes</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    name="startMonth"
                                                    placeholder="1-12"
                                                    value={item.startMonth || ''}
                                                    onChange={(e) => {
                                                        // Permitir solo números
                                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                        
                                                        // Actualizar el estado siempre que sea un número válido
                                                        onProfessionalFormationChange(index, {
                                                            target: {
                                                                name: 'startMonth',
                                                                value: numericValue
                                                            }
                                                        });
                                                    }}
                                                    disabled={!isProfessionalFormationEditing}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <div style={{ flex: '0.6' }}>
                                                <label style={{ fontSize: '0.85rem', marginBottom: '2px', display: 'block' }}>Año</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    name="startYear"
                                                    placeholder="1950-2025"
                                                    value={item.startYear || ''}
                                                    onChange={(e) => {
                                                        // Permitir solo números
                                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                        
                                                        // Actualizar el estado siempre que sea un número válido
                                                        onProfessionalFormationChange(index, {
                                                            target: {
                                                                name: 'startYear',
                                                                value: numericValue
                                                            }
                                                        });
                                                    }}
                                                    disabled={!isProfessionalFormationEditing}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group-edit">
                                        <label>Fecha de finalización</label>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <div style={{ flex: '0.4' }}>
                                                <label style={{ fontSize: '0.85rem', marginBottom: '2px', display: 'block' }}>Mes</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    name="endMonth"
                                                    placeholder="1-12"
                                                    value={item.endMonth || ''}
                                                    onChange={(e) => {
                                                        // Permitir solo números
                                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                        
                                                        // Actualizar el estado siempre que sea un número válido
                                                        onProfessionalFormationChange(index, {
                                                            target: {
                                                                name: 'endMonth',
                                                                value: numericValue
                                                            }
                                                        });
                                                    }}
                                                    disabled={!isProfessionalFormationEditing || item.currentlyWorking}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <div style={{ flex: '0.6' }}>
                                                <label style={{ fontSize: '0.85rem', marginBottom: '2px', display: 'block' }}>Año</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    name="endYear"
                                                    placeholder="1950-2025"
                                                    value={item.endYear || ''}
                                                    onChange={(e) => {
                                                        // Permitir solo números
                                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                        
                                                        // Actualizar el estado siempre que sea un número válido
                                                        onProfessionalFormationChange(index, {
                                                            target: {
                                                                name: 'endYear',
                                                                value: numericValue
                                                            }
                                                        });
                                                    }}
                                                    disabled={!isProfessionalFormationEditing || item.currentlyWorking}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group-edit-checkbox checkbox-group">
                                    <div 
                                        className="custom-checkbox"
                                        onClick={(e) => {
                                            if (!isProfessionalFormationEditing) return;
                                            e.preventDefault();
                                            // Simular clic en el checkbox
                                            onProfessionalFormationChange(index, {
                                                target: {
                                                    name: 'currentlyWorking',
                                                    type: 'checkbox',
                                                    checked: !item.currentlyWorking
                                                }
                                            });
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`currentlyWorking-${index}`}
                                            name="currentlyWorking"
                                            checked={item.currentlyWorking}
                                            onChange={(e) => onProfessionalFormationChange(index, e)}
                                            disabled={!isProfessionalFormationEditing}
                                        />
                                        <span className="checkmark"></span>
                                    </div>
                                    <label 
                                        htmlFor={`currentlyWorking-${index}`}
                                        onClick={(e) => {
                                            if (!isProfessionalFormationEditing) return;
                                            // Simular clic en el checkbox
                                            onProfessionalFormationChange(index, {
                                                target: {
                                                    name: 'currentlyWorking',
                                                    type: 'checkbox',
                                                    checked: !item.currentlyWorking
                                                }
                                            });
                                        }}
                                    >Actualmente trabajando</label>
                                </div>

                                <div className="form-group-edit">
                                    <label>Descripción</label>
                                    <textarea
                                        name="description"
                                        placeholder="Describe brevemente esta experiencia profesional"
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
