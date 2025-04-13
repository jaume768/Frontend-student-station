import React from 'react';
import { FaLinkedin, FaInstagram, FaGlobe } from 'react-icons/fa';

const UserSocialSection = ({ social }) => {
    return (
        <section className="user-extern-section">
            <h2>Redes sociales</h2>
            <div className="user-extern-social-list">
                {social?.linkedin && (
                    <a
                        href={social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="user-extern-social-item"
                    >
                        <FaLinkedin className="user-extern-social-icon" size={18} />
                        LinkedIn
                    </a>
                )}
                {social?.instagram && (
                    <a
                        href={social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="user-extern-social-item"
                    >
                        <FaInstagram className="user-extern-social-icon" size={18} />
                        Instagram
                    </a>
                )}
                {social?.website && (
                    <a
                        href={social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="user-extern-social-item"
                    >
                        <FaGlobe className="user-extern-social-icon" size={18} />
                        Sitio web
                    </a>
                )}
            </div>
        </section>
    );
};

export default UserSocialSection;
