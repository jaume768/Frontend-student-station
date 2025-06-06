import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTrash, FaCamera, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import '../css/companyLogo.css';
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
    // Estado para controlar la carga del logo
    const [logoUploading, setLogoUploading] = useState(false);
    const [activeUploadIndex, setActiveUploadIndex] = useState(null);
    
    // Función para manejar la carga del logo de institución
    const handleLogoUpload = async (e, index) => {
        if (!e.target.files || !e.target.files[0]) return;
    
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        setLogoUploading(true);
        setActiveUploadIndex(index);
        
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${backendUrl}/api/users/institution-logo`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            if (response.data.logoUrl) {
                // Actualizar el estado con la URL del logo
                handleEducationListChange(index, {
                    target: {
                        name: 'institutionLogo',
                        value: response.data.logoUrl
                    }
                });
            }
        } catch (error) {
            console.error('Error al subir el logo de la institución:', error);
            alert('Ha ocurrido un error al subir el logo. Por favor, inténtalo de nuevo.');
        } finally {
            setLogoUploading(false);
            setActiveUploadIndex(null);
        }
    };
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Formación educativa</h3>
                <button 
                    type="button" 
                    className="collapse-toggle" 
                    onClick={(e) => {
                        e.preventDefault();
                        setIsEducationCollapsed(!isEducationCollapsed);
                    }}
                >
                    {isEducationCollapsed ? 
                        <FaChevronDown onClick={(e) => {
                            e.stopPropagation();
                            setIsEducationCollapsed(false);
                        }} /> : 
                        <FaChevronUp onClick={(e) => {
                            e.stopPropagation();
                            setIsEducationCollapsed(true);
                        }} />
                    }
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
                                <div className="form-group-edit logo-upload-container">
                                    <label>Logo de la institución</label>
                                    <div className="company-logo-upload">
                                        {edu.institutionLogo ? (
                                            <img 
                                                src={edu.institutionLogo} 
                                                alt="Logo de la institución" 
                                                className="company-logo-preview"
                                            />
                                        ) : (
                                            <div className="company-logo-placeholder">
                                                <FaCamera />
                                            </div>
                                        )}
                                        {isEducationEditing && (
                                            <>
                                              <input
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={(e) => handleLogoUpload(e, index)}
                                                  className="logo-file-input"
                                                  disabled={logoUploading && activeUploadIndex === index}
                                              />
                                              {logoUploading && activeUploadIndex === index && (
                                                <div className="logo-loading-indicator">
                                                  <FaSpinner className="logo-spinner" />
                                                </div>
                                              )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group-edit">
                                    <label>Institución</label>
                                    <input
                                        type="text"
                                        name="institution"
                                        placeholder="Nombre de la institución"
                                        value={edu.institution || ''}
                                        onChange={(e) => handleEducationListChange(index, e)}
                                        disabled={!isEducationEditing}
                                    />
                                </div>
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
                                <div className="form-group-edit">
                                    <label>Ubicación</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="Ej: Madrid, España"
                                        value={edu.location || ''}
                                        onChange={(e) => handleEducationListChange(index, e)}
                                        disabled={!isEducationEditing}
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
                                                    name="formationStartMonth"
                                                    placeholder="1-12"
                                                    value={edu.formationStartMonth || ''}
                                                    onChange={(e) => {
                                                        // Permitir solo números
                                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                        const value = numericValue ? parseInt(numericValue) : '';
                                                        
                                                        // Validar rango 1-12
                                                        if (!value || (value >= 1 && value <= 12)) {
                                                            handleEducationListChange(index, {
                                                                target: {
                                                                    name: 'formationStartMonth',
                                                                    value: value
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    disabled={!isEducationEditing}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <div style={{ flex: '0.6' }}>
                                                <label style={{ fontSize: '0.85rem', marginBottom: '2px', display: 'block' }}>Año</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    name="formationStartYear"
                                                    placeholder="1950-2025"
                                                    value={edu.formationStartYear || ''}
                                                    onChange={(e) => {
                                                        // Permitir solo números
                                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                        
                                                        // Actualizar el estado siempre que sea un número válido
                                                        // Evitamos validaciones estrictas que impidan la entrada
                                                        handleEducationListChange(index, {
                                                            target: {
                                                                name: 'formationStartYear',
                                                                value: numericValue
                                                            }
                                                        });
                                                    }}
                                                    disabled={!isEducationEditing}
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
                                                    name="formationEndMonth"
                                                    placeholder="1-12"
                                                    value={edu.formationEndMonth || ''}
                                                    onChange={(e) => {
                                                        // Permitir solo números
                                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                        const value = numericValue ? parseInt(numericValue) : '';
                                                        
                                                        // Validar rango 1-12
                                                        if (!value || (value >= 1 && value <= 12)) {
                                                            handleEducationListChange(index, {
                                                                target: {
                                                                    name: 'formationEndMonth',
                                                                    value: value
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    disabled={!isEducationEditing || edu.currentlyEnrolled}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <div style={{ flex: '0.6' }}>
                                                <label style={{ fontSize: '0.85rem', marginBottom: '2px', display: 'block' }}>Año</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    name="formationEndYear"
                                                    placeholder="1950-2025"
                                                    value={edu.formationEndYear || ''}
                                                    onChange={(e) => {
                                                        // Permitir solo números
                                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                        
                                                        // Actualizar el estado siempre que sea un número válido
                                                        // Evitamos validaciones estrictas que impidan la entrada
                                                        handleEducationListChange(index, {
                                                            target: {
                                                                name: 'formationEndYear',
                                                                value: numericValue
                                                            }
                                                        });
                                                    }}
                                                    disabled={!isEducationEditing || edu.currentlyEnrolled}
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
                                            if (!isEducationEditing) return;
                                            e.preventDefault();
                                            // Simular clic en el checkbox
                                            handleEducationListChange(index, {
                                                target: {
                                                    name: 'currentlyEnrolled',
                                                    type: 'checkbox',
                                                    checked: !edu.currentlyEnrolled
                                                }
                                            });
                                        }}
                                    >
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
                                    <label 
                                        htmlFor={`currentlyEnrolled-${index}`}
                                        onClick={(e) => {
                                            if (!isEducationEditing) return;
                                            // Simular clic en el checkbox
                                            handleEducationListChange(index, {
                                                target: {
                                                    name: 'currentlyEnrolled',
                                                    type: 'checkbox',
                                                    checked: !edu.currentlyEnrolled
                                                }
                                            });
                                        }}
                                    >Actualmente cursando</label>
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
                        <div 
                            className="custom-checkbox"
                            onClick={(e) => {
                                if (!isEducationEditing) return;
                                e.preventDefault();
                                // Simular clic en el checkbox
                                handleSelfTaughtChange({
                                    target: {
                                        name: 'selfTaught',
                                        type: 'checkbox',
                                        checked: !selfTaught
                                    }
                                });
                            }}
                        >
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
                        <label 
                            htmlFor="selfTaught"
                            onClick={(e) => {
                                if (!isEducationEditing) return;
                                // Simular clic en el checkbox
                                handleSelfTaughtChange({
                                    target: {
                                        name: 'selfTaught',
                                        type: 'checkbox',
                                        checked: !selfTaught
                                    }
                                });
                            }}
                        >Soy autodidacta</label>
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
