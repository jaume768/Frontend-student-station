import React from 'react';
import { FaInstagram, FaLinkedin, FaBehance, FaTumblr, FaYoutube, FaPinterest, FaGlobe } from 'react-icons/fa';

const UserSocialSection = ({ social }) => {
    // Solo renderizamos la sección si hay al menos una red social
    if (!social || Object.values(social).every(value => !value)) return null;
    
    return (
        <section className="user-extern-section">
            <h2>Redes sociales</h2>
            <div className="user-extern-social-links">
                {social?.instagram && (
                    <a
                        href={social.instagram}
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
                        href={social.linkedin}
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
                        href={social.behance}
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
                        href={social.tumblr}
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
                        href={social.youtube}
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
                        href={social.pinterest}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon pinterest"
                        aria-label="Pinterest"
                    >
                        <FaPinterest size={24} />
                    </a>
                )}
                {social?.website && (
                    <a
                        href={social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon website"
                        aria-label="Sitio web"
                    >
                        <FaGlobe size={24} />
                    </a>
                )}
            </div>
        </section>
    );
};

export default UserSocialSection;
