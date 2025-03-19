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
                    <div className="form-group-edit">
                        <label>Email de contacto</label>
                        <input
                            type="email"
                            name="emailContacto"
                            placeholder="Email de contacto"
                            value={social.emailContacto}
                            onChange={handleSocialChange}
                            disabled={!isContactEditing}
                        />
                    </div>
                    <div className="form-group-edit">
                        <label>Sitio web</label>
                        <input
                            type="url"
                            name="sitioWeb"
                            placeholder="https://www.tusitio.com"
                            value={social.sitioWeb}
                            onChange={handleSocialChange}
                            disabled={!isContactEditing}
                        />
                    </div>
                    <div className="form-group-edit">
                        <label>Instagram</label>
                        <div className="social-input-container">
                            <span className="social-prefix">instagram.com/</span>
                            <input
                                type="text"
                                name="instagram"
                                placeholder="tu_usuario"
                                value={social.instagram}
                                onChange={handleSocialChange}
                                disabled={!isContactEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>LinkedIn</label>
                        <div className="social-input-container">
                            <span className="social-prefix">linkedin.com/in/</span>
                            <input
                                type="text"
                                name="linkedin"
                                placeholder="tu_perfil"
                                value={social.linkedin}
                                onChange={handleSocialChange}
                                disabled={!isContactEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>Behance</label>
                        <div className="social-input-container">
                            <span className="social-prefix">behance.net/</span>
                            <input
                                type="text"
                                name="behance"
                                placeholder="tu_usuario"
                                value={social.behance}
                                onChange={handleSocialChange}
                                disabled={!isContactEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>Tumblr</label>
                        <div className="social-input-container">
                            <span className="social-prefix">tumblr.com/blog/</span>
                            <input
                                type="text"
                                name="tumblr"
                                placeholder="tu_blog"
                                value={social.tumblr}
                                onChange={handleSocialChange}
                                disabled={!isContactEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>YouTube</label>
                        <div className="social-input-container">
                            <span className="social-prefix">youtube.com/</span>
                            <input
                                type="text"
                                name="youtube"
                                placeholder="@tu_canal"
                                value={social.youtube}
                                onChange={handleSocialChange}
                                disabled={!isContactEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>Pinterest</label>
                        <div className="social-input-container">
                            <span className="social-prefix">pinterest.com/</span>
                            <input
                                type="text"
                                name="pinterest"
                                placeholder="tu_usuario"
                                value={social.pinterest}
                                onChange={handleSocialChange}
                                disabled={!isContactEditing}
                            />
                        </div>
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
