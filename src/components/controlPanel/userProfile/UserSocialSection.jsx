import React from 'react';
import { FaInstagram, FaLinkedin, FaBehance, FaTumblr, FaYoutube, FaPinterest, FaGlobe, FaEnvelope } from 'react-icons/fa';
import { buildSocialMediaUrl } from '../../../utils/socialMediaUtils';

const UserSocialSection = ({ social }) => {
    // Solo renderizamos la sección si hay al menos una red social
    if (!social || Object.values(social).every(value => !value)) return null;
    
    return (
        <section className="user-extern-section">
            <h2>Redes sociales</h2>
            <div className="user-extern-social-links">
                {social?.instagram && (
                    <a
                        href={buildSocialMediaUrl('instagram', social.instagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon instagram"
                        aria-label="Instagram"
                    >
                        <FaInstagram size={24} />
                    </a>
                )}
                {social?.linkedin && (
                    <a
                        href={buildSocialMediaUrl('linkedin', social.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon linkedin"
                        aria-label="LinkedIn"
                    >
                        <FaLinkedin size={24} />
                    </a>
                )}
                {social?.behance && (
                    <a
                        href={buildSocialMediaUrl('behance', social.behance)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon behance"
                        aria-label="Behance"
                    >
                        <FaBehance size={24} />
                    </a>
                )}
                {social?.tumblr && (
                    <a
                        href={buildSocialMediaUrl('tumblr', social.tumblr)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon tumblr"
                        aria-label="Tumblr"
                    >
                        <FaTumblr size={24} />
                    </a>
                )}
                {social?.youtube && (
                    <a
                        href={buildSocialMediaUrl('youtube', social.youtube)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon youtube"
                        aria-label="YouTube"
                    >
                        <FaYoutube size={24} />
                    </a>
                )}
                {social?.pinterest && (
                    <a
                        href={buildSocialMediaUrl('pinterest', social.pinterest)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon pinterest"
                        aria-label="Pinterest"
                    >
                        <FaPinterest size={24} />
                    </a>
                )}
                {social?.sitioWeb && (
                    <a
                        href={buildSocialMediaUrl('sitioweb', social.sitioWeb)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon website"
                        aria-label="Sitio web"
                    >
                        <FaGlobe size={24} />
                    </a>
                )}
                {social?.emailContacto && (
                    <a
                        href={`mailto:${social.emailContacto}`}
                        className="social-icon email"
                        aria-label="Email de contacto"
                    >
                        <FaEnvelope size={24} />
                    </a>
                )}
            </div>
        </section>
    );
};

export default UserSocialSection;
