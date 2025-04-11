import React from 'react';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import EditButton from './EditButton';

const EducationSection = ({
    isEducationCollapsed,
    setIsEducationCollapsed,
    isEducationEditing,
    setIsEducationEditing,
    educationList,
    handleEducationListChange,
    addEducation,
    removeEducation,
    selfTaught,
    handleSelfTaughtChange,
    updateProfileData,
    institutionOptions,
    currentDate
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Formación educativa</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsEducationCollapsed(!isEducationCollapsed)}>
                    {isEducationCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isEducationCollapsed && (
                <div className="section-content">
                    <div className="education-list">
                        {Array.isArray(educationList) && educationList.map((edu, index) => (
                            <div key={index} className="education-item">
                                <div className="education-header">
                                    <h4>Formación {index + 1}</h4>
                                    {isEducationEditing && educationList.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-education"
                                            onClick={() => removeEducation(index)}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                                <div className="form-group-edit">
                                    <label>Institución</label>
                                    <select
                                        name="institution"
                                        value={edu.institution}
                                        onChange={(e) => handleEducationListChange(index, e)}
                                        disabled={!isEducationEditing}
                                    >
                                        <option value="">Selecciona una institución</option>
                                        {institutionOptions.map((inst, i) => (
                                            <option key={i} value={inst}>{inst}</option>
                                        ))}
                                        <option value="other">Otra</option>
                                    </select>
                                </div>
                                {edu.institution === 'other' && (
                                    <div className="form-group-edit">
                                        <label>Otra institución</label>
                                        <input
                                            type="text"
                                            name="otherInstitution"
                                            placeholder="Nombre de la institución"
                                            value={edu.otherInstitution || ''}
                                            onChange={(e) => handleEducationListChange(index, e)}
                                            disabled={!isEducationEditing}
                                        />
                                    </div>
                                )}
                                <div className="form-group-edit">
                                    <label>Nombre de la formación</label>
                                    <input
                                        type="text"
                                        name="formationName"
                                        placeholder="Ej: Diseño de Moda"
                                        value={edu.formationName}
                                        onChange={(e) => handleEducationListChange(index, e)}
                                        disabled={!isEducationEditing}
                                    />
                                </div>
                                <div className="date-range">
                                    <div className="form-group-edit">
                                        <label>Fecha de inicio</label>
                                        <input
                                            type="date"
                                            name="formationStart"
                                            value={edu.formationStart}
                                            max={currentDate}
                                            onChange={(e) => handleEducationListChange(index, e)}
                                            disabled={!isEducationEditing}
                                        />
                                    </div>
                                    <div className="form-group-edit">
                                        <label>Fecha de finalización</label>
                                        <input
                                            type="date"
                                            name="formationEnd"
                                            value={edu.formationEnd}
                                            min={edu.formationStart}
                                            max={currentDate}
                                            onChange={(e) => handleEducationListChange(index, e)}
                                            disabled={!isEducationEditing || edu.currentlyEnrolled}
                                        />
                                    </div>
                                </div>
                                <div className="form-group-edit-checkbox checkbox-group">
                                    <div className="custom-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`currentlyEnrolled-${index}`}
                                            name="currentlyEnrolled"
                                            checked={edu.currentlyEnrolled}
                                            onChange={(e) => handleEducationListChange(index, e)}
                                            disabled={!isEducationEditing}
                                        />
                                        <span className="checkmark"></span>
                                    </div>
                                    <label htmlFor={`currentlyEnrolled-${index}`}>Actualmente cursando</label>
                                </div>
                            </div>
                        ))}
                        {isEducationEditing && educationList.length < 3 && (
                            <button type="button" className="add-button" onClick={addEducation}>
                                + Añadir otra formación
                            </button>
                        )}
                        {isEducationEditing && educationList.length >= 3 && (
                            <p className="info-text">Máximo 3 formaciones permitidas</p>
                        )}
                    </div>
                    <div className="form-group-edit-checkbox checkbox-group self-taught">
                        <div className="custom-checkbox">
                            <input
                                type="checkbox"
                                id="selfTaught"
                                name="selfTaught"
                                checked={selfTaught}
                                onChange={handleSelfTaughtChange}
                                disabled={!isEducationEditing}
                            />
                            <span className="checkmark"></span>
                        </div>
                        <label htmlFor="selfTaught">Soy autodidacta</label>
                    </div>
                    <div className="button-container">
                        <EditButton
                            isEditing={isEducationEditing}
                            onClick={() => {
                                if (isEducationEditing) {
                                    updateProfileData();
                                }
                                setIsEducationEditing(!isEducationEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default EducationSection;
