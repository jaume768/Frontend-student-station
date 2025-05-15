import React from 'react';
import { FaChevronDown, FaChevronUp, FaTimes, FaPlus } from 'react-icons/fa';
import EditButton from './EditButton';

const SoftwareSection = ({
    isSoftwareCollapsed,
    setIsSoftwareCollapsed,
    isSoftwareEditing,
    setIsSoftwareEditing,
    software,
    newSoftware,
    setNewSoftware,
    handleSoftwareKeyDown,
    removeSoftware,
    popularSoftware,
    addPopularSoftware,
    updateProfileData
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Softwares o Hardskills</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsSoftwareCollapsed(!isSoftwareCollapsed)}>
                    {isSoftwareCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isSoftwareCollapsed && (
                <div className="section-content">
                    <p className="tag-instruction">
                        Agrega etiquetas para que otros puedan identificar tus conocimientos o softwares
                        de especialización. Añade hasta un <strong>máximo de 10 etiquetas</strong>.
                    </p>
                    
                    <div className="tags-input-container">
                        <div className="tags-container">
                            {Array.isArray(software) && software.map((sw, index) => (
                                <div key={index} className="tag">
                                    {sw}
                                    {isSoftwareEditing && (
                                        <button
                                            type="button"
                                            className="tag-remove"
                                            onClick={() => removeSoftware(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            {/* Input para añadir etiquetas escribiendo */}
                            {isSoftwareEditing && software.length < 10 && (
                                <input
                                    type="text"
                                    className="tag-input"
                                    placeholder="Escribe aquí."
                                    value={newSoftware}
                                    onChange={(e) => setNewSoftware(e.target.value)}
                                    onKeyDown={handleSoftwareKeyDown}
                                    maxLength={50}
                                />
                            )}
                        </div>
                    </div>

                    <p className="tag-hint">
                        Presiona "Enter" al finalizar de escribir para añadir una etiqueta. Elimina haciendo clic en la X.
                    </p>
                    
                    {isSoftwareEditing && (
                        <>
                            {Array.isArray(software) && software.length < 10 && (
                                <div className="popular-tags-container">
                                    <h4>Software popular</h4>
                                    <div className="popular-tags">
                                        {popularSoftware.map((sw, index) => (
                                            <div
                                                key={index}
                                                className="popular-tag"
                                                onClick={() => addPopularSoftware(sw)}
                                            >
                                                {sw}
                                                <span className="add-tag"><FaPlus /></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    
                    <div className="button-container">
                        <EditButton
                            isEditing={isSoftwareEditing}
                            onClick={() => {
                                if (isSoftwareEditing) {
                                    updateProfileData();
                                }
                                setIsSoftwareEditing(!isSoftwareEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default SoftwareSection;
