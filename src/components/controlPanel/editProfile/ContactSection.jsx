import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EditButton from './EditButton';

const ContactSection = ({
    isContactCollapsed,
    setIsContactCollapsed,
    isContactEditing,
    setIsContactEditing,
    social,
    handleSocialChange,
    updateProfileData
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Contacto</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsContactCollapsed(!isContactCollapsed)}>
                    {isContactCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isContactCollapsed && (
                <div className="section-content">
                    <p className="form-description">
                        Mostraremos tus datos de contacto a los usuarios que se interesen por ellos.
                    </p>
                    <div className="form-group-edit">
                        <label>E-mail de contacto</label>
                        <input
                            type="email"
                            name="emailContacto"
                            placeholder="contact@contact.com"
                            value={social?.emailContacto || ""}
                            onChange={handleSocialChange}
                            disabled={!isContactEditing}
                        />
                    </div>
                    <div className="button-container">
                        <EditButton
                            isEditing={isContactEditing}
                            onClick={() => {
                                if (isContactEditing) {
                                    updateProfileData();
                                }
                                setIsContactEditing(!isContactEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default ContactSection;
