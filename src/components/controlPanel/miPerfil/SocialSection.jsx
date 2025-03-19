import React from 'react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

const SocialSection = ({ social }) => {
    return (
        <section className="miPerfil-section miPerfil-social">
            <h2>Redes sociales</h2>
            <div className="miPerfil-social-links">
                {social?.linkedin && (
                    <a
                        href={social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaLinkedin size={24} />
                    </a>
                )}
                {social?.instagram && (
                    <a
                        href={social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaInstagram size={24} />
                    </a>
                )}
            </div>
        </section>
    );
};

export default SocialSection;
