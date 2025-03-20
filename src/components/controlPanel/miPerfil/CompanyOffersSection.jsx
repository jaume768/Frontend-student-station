import React from 'react';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CompanyOffersSection = ({ offers = [] }) => {
    if (!Array.isArray(offers) || offers.length === 0) {
        return (
            <div className="company-offers-empty-company">
                <div className="offers-empty-icon-company">
                    <FaBriefcase />
                </div>
                <h3>No hay ofertas publicadas</h3>
                <p>Aún no has publicado ninguna oferta de trabajo.</p>
                <Link to="/ControlPanel/createOffer" className="create-offer-button-company">
                    Publicar oferta
                </Link>
            </div>
        );
    }

    return (
        <div className="company-offers-container-company">
            {offers.map((offer, index) => (
                <div key={index} className="company-offer-item-company">
                    <div className="offer-header-company">
                        <h3 className="offer-title-company">{offer.title}</h3>
                        <span className="offer-status-company">{offer.status === 'active' ? 'Activa' : 'Cerrada'}</span>
                    </div>
                    
                    <div className="offer-details-company">
                        <div className="offer-detail-company">
                            <FaCalendarAlt className="offer-icon-company" />
                            <span>{new Date(offer.publicationDate).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                        
                        <div className="offer-detail-company">
                            <FaMapMarkerAlt className="offer-icon-company" />
                            <span>{offer.location || 'Ubicación no especificada'}</span>
                        </div>
                    </div>
                    
                    <div className="offer-description-company">
                        {offer.description && offer.description.length > 120 
                            ? `${offer.description.substring(0, 120)}...` 
                            : offer.description || 'Sin descripción'}
                    </div>
                    
                    <div className="offer-actions-company">
                        <Link to={`/ControlPanel/offer/${offer._id}`} className="view-offer-button-company">
                            Ver detalles
                        </Link>
                        <Link to={`/ControlPanel/edit-offer/${offer._id}`} className="edit-offer-button-company">
                            Editar
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CompanyOffersSection;
