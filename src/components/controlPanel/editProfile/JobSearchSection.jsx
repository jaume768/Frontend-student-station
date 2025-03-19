import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EditButton from './EditButton';

const JobSearchSection = ({
    isEnBuscaCollapsed,
    setIsEnBuscaCollapsed,
    isEnBuscaEditing,
    setIsEnBuscaEditing,
    contract,
    handleContractChange,
    locationType,
    handleLocationChange,
    updateProfileData
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>En busca de</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsEnBuscaCollapsed(!isEnBuscaCollapsed)}>
                    {isEnBuscaCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isEnBuscaCollapsed && (
                <div className="section-content">
                    <div className="form-group-edit">
                        <h4>Tipo de contrato</h4>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="practicas"
                                name="practicas"
                                checked={contract?.practicas || false}
                                onChange={handleContractChange}
                                disabled={!isEnBuscaEditing}
                            />
                            <label htmlFor="practicas">Prácticas</label>
                        </div>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="tiempoCompleto"
                                name="tiempoCompleto"
                                checked={contract?.tiempoCompleto || false}
                                onChange={handleContractChange}
                                disabled={!isEnBuscaEditing}
                            />
                            <label htmlFor="tiempoCompleto">Tiempo completo</label>
                        </div>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="parcial"
                                name="parcial"
                                checked={contract?.parcial || false}
                                onChange={handleContractChange}
                                disabled={!isEnBuscaEditing}
                            />
                            <label htmlFor="parcial">Tiempo parcial</label>
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <h4>Modalidad</h4>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="presencial"
                                name="presencial"
                                checked={locationType?.presencial || false}
                                onChange={handleLocationChange}
                                disabled={!isEnBuscaEditing}
                            />
                            <label htmlFor="presencial">Presencial</label>
                        </div>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="remoto"
                                name="remoto"
                                checked={locationType?.remoto || false}
                                onChange={handleLocationChange}
                                disabled={!isEnBuscaEditing}
                            />
                            <label htmlFor="remoto">Remoto</label>
                        </div>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="hibrido"
                                name="hibrido"
                                checked={locationType?.hibrido || false}
                                onChange={handleLocationChange}
                                disabled={!isEnBuscaEditing}
                            />
                            <label htmlFor="hibrido">Híbrido</label>
                        </div>
                    </div>
                    <div className="button-container">
                        <EditButton
                            isEditing={isEnBuscaEditing}
                            onClick={() => {
                                if (isEnBuscaEditing) {
                                    updateProfileData();
                                }
                                setIsEnBuscaEditing(!isEnBuscaEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default JobSearchSection;
