import React from 'react';
import { FaChevronDown, FaChevronUp, FaInstagram, FaLinkedinIn, FaBehance, FaTumblr, FaYoutube, FaPinterest } from 'react-icons/fa';
import EditButton from './EditButton';

const SocialNetworksSection = ({
    isSocialNetworksCollapsed,
    setIsSocialNetworksCollapsed,
    isSocialNetworksEditing,
    setIsSocialNetworksEditing,
    social,
    handleSocialChange,
    updateProfileData
}) => {
    // Función para extraer solo el nombre de usuario de la URL completa
    const extractUsername = (url, prefix) => {
        if (!url) return "";
        
        // Si la URL comienza con http:// o https://, extraemos solo el nombre de usuario
        if (url.startsWith('http://') || url.startsWith('https://')) {
            const parts = url.split(prefix);
            if (parts.length > 1) {
                // Eliminar cualquier barra diagonal al final
                return parts[1].replace(/\/$/, '');
            }
        }
        
        // Si no es una URL completa, asumimos que es solo el nombre de usuario
        if (!url.includes('http') && !url.includes(prefix)) {
            return url;
        }
        
        return url;
    };
    
    // Función para manejar los cambios en los nombres de usuario y construir URLs completas
    const handleSocialUsernameChange = (e, network) => {
        const username = e.target.value.trim();
        let fullUrl = "";
        
        if (username) {
            switch (network) {
                case 'instagram':
                    fullUrl = `https://www.instagram.com/${username}/`;
                    break;
                case 'linkedin':
                    fullUrl = `https://www.linkedin.com/in/${username}/`;
                    break;
                case 'behance':
                    fullUrl = `https://www.behance.net/${username}/`;
                    break;
                case 'tumblr':
                    fullUrl = `https://www.tumblr.com/${username}/`;
                    break;
                case 'youtube':
                    fullUrl = `https://www.youtube.com/${username}/`;
                    break;
                case 'pinterest':
                    fullUrl = `https://www.pinterest.com/${username}/`;
                    break;
                default:
                    fullUrl = username;
            }
        }
        
        // Simulamos un evento para usar la función handleSocialChange existente
        handleSocialChange({
            target: {
                name: network,
                value: fullUrl
            }
        });
    };
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Redes sociales</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsSocialNetworksCollapsed(!isSocialNetworksCollapsed)}>
                    {isSocialNetworksCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isSocialNetworksCollapsed && (
                <div className="section-content">
                    <p className="form-description">
                        Compartiendo tus redes sociales permitirás a otros usuarios conectar contigo.
                    </p>
                    <div className="form-group-edit">
                        <label>Instagram</label>
                        <div className="social-input-container">
                            <div className="social-icon-wrapper">
                                <FaInstagram className="social-icon" />
                            </div>
                            <span className="social-prefix">instagram.com/</span>
                            <input
                                type="text"
                                name="instagram"
                                placeholder="tu_usuario"
                                value={extractUsername(social?.instagram, 'instagram.com/')}
                                onChange={(e) => handleSocialUsernameChange(e, 'instagram')}
                                disabled={!isSocialNetworksEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>LinkedIn</label>
                        <div className="social-input-container">
                            <div className="social-icon-wrapper">
                                <FaLinkedinIn className="social-icon" />
                            </div>
                            <span className="social-prefix">linkedin.com/in/</span>
                            <input
                                type="text"
                                name="linkedin"
                                placeholder="tu_usuario"
                                value={extractUsername(social?.linkedin, 'linkedin.com/in/')}
                                onChange={(e) => handleSocialUsernameChange(e, 'linkedin')}
                                disabled={!isSocialNetworksEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>Behance</label>
                        <div className="social-input-container">
                            <div className="social-icon-wrapper">
                                <FaBehance className="social-icon" />
                            </div>
                            <span className="social-prefix">behance.net/</span>
                            <input
                                type="text"
                                name="behance"
                                placeholder="tu_usuario"
                                value={extractUsername(social?.behance, 'behance.net/')}
                                onChange={(e) => handleSocialUsernameChange(e, 'behance')}
                                disabled={!isSocialNetworksEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>Tumblr</label>
                        <div className="social-input-container">
                            <div className="social-icon-wrapper">
                                <FaTumblr className="social-icon" />
                            </div>
                            <span className="social-prefix">tumblr.com/</span>
                            <input
                                type="text"
                                name="tumblr"
                                placeholder="tu_usuario"
                                value={extractUsername(social?.tumblr, 'tumblr.com/')}
                                onChange={(e) => handleSocialUsernameChange(e, 'tumblr')}
                                disabled={!isSocialNetworksEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>YouTube</label>
                        <div className="social-input-container">
                            <div className="social-icon-wrapper">
                                <FaYoutube className="social-icon" />
                            </div>
                            <span className="social-prefix">youtube.com/</span>
                            <input
                                type="text"
                                name="youtube"
                                placeholder="tu_canal"
                                value={extractUsername(social?.youtube, 'youtube.com/')}
                                onChange={(e) => handleSocialUsernameChange(e, 'youtube')}
                                disabled={!isSocialNetworksEditing}
                            />
                        </div>
                    </div>
                    <div className="form-group-edit">
                        <label>Pinterest</label>
                        <div className="social-input-container">
                            <div className="social-icon-wrapper">
                                <FaPinterest className="social-icon" />
                            </div>
                            <span className="social-prefix">pinterest.com/</span>
                            <input
                                type="text"
                                name="pinterest"
                                placeholder="tu_usuario"
                                value={extractUsername(social?.pinterest, 'pinterest.com/')}
                                onChange={(e) => handleSocialUsernameChange(e, 'pinterest')}
                                disabled={!isSocialNetworksEditing}
                            />
                        </div>
                    </div>
                    <div className="button-container">
                        <EditButton
                            isEditing={isSocialNetworksEditing}
                            onClick={() => {
                                if (isSocialNetworksEditing) {
                                    updateProfileData();
                                }
                                setIsSocialNetworksEditing(!isSocialNetworksEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default SocialNetworksSection;
