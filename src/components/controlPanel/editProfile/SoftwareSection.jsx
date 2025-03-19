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
                <h3>Software</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsSoftwareCollapsed(!isSoftwareCollapsed)}>
                    {isSoftwareCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isSoftwareCollapsed && (
                <div className="section-content">
                    <div className="form-group-edit">
                        <div className="tags-container">
                            {software && software.map((sw, index) => (
                                <div key={index} className="tag">
                                    {sw}
                                    {isSoftwareEditing && (
                                        <button
                                            type="button"
                                            className="remove-tag"
                                            onClick={() => removeSoftware(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isSoftwareEditing && (
                            <>
                                {software.length < 12 && (
                                    <div className="software-input-container">
                                        <input
                                            type="text"
                                            placeholder="Añadir software y pulsar Enter"
                                            value={newSoftware}
                                            onChange={(e) => setNewSoftware(e.target.value)}
                                            onKeyDown={handleSoftwareKeyDown}
                                            maxLength={50}
                                        />
                                        <small className="info-text">Puedes añadir hasta 12 programas</small>
                                    </div>
                                )}
                                <div className="popular-tags">
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
                            </>
                        )}
                    </div>
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
