import React from 'react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

const UserSocialSection = ({ social }) => {
    return (
        <section className="user-profile-section user-profile-social">
            <h2>Redes sociales</h2>
            <div className="user-profile-social-links">
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

export default UserSocialSection;
