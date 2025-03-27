import React from 'react';

const MainInfoSection = ({ offer, formatDuration, formatDate }) => {
    return (
        <div className="job-offer-main-info-jobdetail">
            <div className="job-offer-info-left-jobdetail">
                <div className="job-offer-metadata-jobdetail">
                    {offer.location && offer.location.city && (
                        <div className="metadata-tag-jobdetail">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{`${offer.location.city}`}</span>
                        </div>
                    )}
                    <div className="metadata-tag-jobdetail">
                        <i className="fas fa-graduation-cap"></i>
                        <span>{offer.knowledgeArea || "No especificada"}</span>
                    </div>
                    <div className="metadata-tag-jobdetail">
                        <i className="fas fa-map-marked-alt"></i>
                        <span>{offer.modality || "No especificada"}</span>
                    </div>
                    <div className="metadata-tag-jobdetail">
                        <i className="fas fa-clock"></i>
                        <span>{formatDuration(offer.duration)}</span>
                    </div>
                </div>
            </div>
            <div className="job-offer-info-right-jobdetail">
                <div className="job-offer-publication-date-jobdetail">
                    Publicado: {formatDate(offer.publicationDate)}
                </div>
                {offer.applicationLink && (
                    <a 
                        href={offer.applicationLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="apply-button-jobdetail"
                    >
                        Solicitar información
                    </a>
                )}
            </div>
        </div>
    );
};

export default MainInfoSection;
