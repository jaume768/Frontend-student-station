import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EditButton from './EditButton';

const BasicInfoSection = ({
    isBasicCollapsed,
    setIsBasicCollapsed,
    isBasicEditing,
    setIsBasicEditing,
    basicInfo,
    handleBasicInfoChange,
    updateProfileData,
    countryOptions
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Información básica</h3>
                <button
                    type="button"
                    className="collapse-toggle"
                    onClick={() => setIsBasicCollapsed(!isBasicCollapsed)}
                >
                    {isBasicCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isBasicCollapsed && (
                <div className="section-content">
                    <div className="form-group-edit">
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Introduce tu nombre"
                            value={basicInfo.firstName}
                            onChange={handleBasicInfoChange}
                            disabled={!isBasicEditing}
                        />
                    </div>
                    <div className="form-group-edit">
                        <label>Apellidos</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Introduce tus apellidos"
                            value={basicInfo.lastName}
                            onChange={handleBasicInfoChange}
                            disabled={!isBasicEditing}
                        />
                    </div>
                    <div className="form-group-edit">
                        <label>País de residencia</label>
                        <select
                            name="country"
                            value={basicInfo.country}
                            onChange={handleBasicInfoChange}
                            disabled={!isBasicEditing}
                        >
                            <option value="">Selecciona una opción</option>
                            {countryOptions.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group-edit">
                        <label>Ciudad de residencia</label>
                        <input
                            type="text"
                            name="city"
                            placeholder="Introduce tu ciudad"
                            value={basicInfo.city}
                            onChange={handleBasicInfoChange}
                            disabled={!isBasicEditing}
                        />
                    </div>
                    <div className="button-container">
                        <EditButton
                            isEditing={isBasicEditing}
                            onClick={() => {
                                if (isBasicEditing) {
                                    updateProfileData();
                                }
                                setIsBasicEditing(!isBasicEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default BasicInfoSection;
