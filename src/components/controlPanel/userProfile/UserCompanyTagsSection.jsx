import React from 'react';
import { FaTags } from 'react-icons/fa';

const UserCompanyTagsSection = ({ companyTags, offersPractices = false }) => {
    const hasContent = Array.isArray(companyTags) && companyTags.length > 0;

    return (
        <div className="profile-section-userP">
            <h2 className="section-title-userP">
                <FaTags className="section-icon-userP" /> 
                Especialización
            </h2>
            
            {hasContent ? (
                <div className="company-tags-container-userP">
                    {companyTags.map((tag, index) => (
                        <span key={index} className="company-tag-userP">
                            {tag}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="no-data-message-userP">No hay etiquetas de especialización registradas.</p>
            )}
            
            {offersPractices && (
                <div className="practice-badge-userP">
                    <span>Ofrece prácticas profesionales</span>
                </div>
            )}
        </div>
    );
};

export default UserCompanyTagsSection;
