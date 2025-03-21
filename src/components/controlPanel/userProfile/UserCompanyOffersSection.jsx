import React from 'react';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserCompanyOffersSection = ({ offers = [] }) => {
    if (!Array.isArray(offers) || offers.length === 0) {
        return (
            <div className="company-offers-empty-userP">
                <div className="offers-empty-icon-userP">
                    <FaBriefcase />
                </div>
                <h3>No hay ofertas publicadas</h3>
                <p>Esta empresa aún no ha publicado ninguna oferta de trabajo.</p>
            </div>
        );
    }

    return (
        <div className="company-offers-container-userP">
            {offers.map((offer, index) => (
                <div key={index} className="company-offer-item-userP">
                    <div className="offer-header-userP">
                        <h3 className="offer-title-userP">{offer.title}</h3>
                        <span className="offer-status-userP">{offer.status === 'active' ? 'Activa' : 'Cerrada'}</span>
                    </div>
                    
                    <div className="offer-details-userP">
                        <div className="offer-detail-userP">
                            <FaCalendarAlt className="offer-icon-userP" />
                            <span>{new Date(offer.publicationDate).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                        
                        <div className="offer-detail-userP">
                            <FaMapMarkerAlt className="offer-icon-userP" />
                            <span>{offer.location || 'Ubicación no especificada'}</span>
                        </div>
                    </div>
                    
                    <div className="offer-description-userP">
                        {offer.description && offer.description.length > 120 
                            ? `${offer.description.substring(0, 120)}...` 
                            : offer.description || 'Sin descripción'}
                    </div>
                    
                    <div className="offer-actions-userP">
                        <Link to={`/ControlPanel/offer/${offer._id}`} className="view-offer-button-userP">
                            Ver detalles
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserCompanyOffersSection;
