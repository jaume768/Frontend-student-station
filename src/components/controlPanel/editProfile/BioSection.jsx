import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EditButton from './EditButton';

const BioSection = ({
    isBioCollapsed,
    setIsBioCollapsed,
    isBioEditing,
    setIsBioEditing,
    bio,
    setBio,
    updateProfileData
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Bio</h3>
                <button
                    type="button"
                    className="collapse-toggle"
                    onClick={() => setIsBioCollapsed(!isBioCollapsed)}
                >
                    {isBioCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isBioCollapsed && (
                <div className="section-content">
                    <div className="form-group-edit">
                        <label>Comparte en pocas palabras quién eres o qué te gusta.</label>
                        <textarea
                            name="bio"
                            placeholder="Escribe algo sobre ti..."
                            value={bio || ""}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={!isBioEditing}
                            maxLength={150}
                            className="bio-textarea"
                        />
                        <p className="bio-character-count">Máximo 150 caracteres.</p>
                    </div>
                    <div className="button-container">
                        <EditButton
                            isEditing={isBioEditing}
                            onClick={() => {
                                if (isBioEditing) {
                                    updateProfileData();
                                }
                                setIsBioEditing(!isBioEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default BioSection;
