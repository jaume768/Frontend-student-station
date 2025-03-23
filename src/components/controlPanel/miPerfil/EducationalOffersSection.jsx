import React, { useState } from 'react';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EducationalOffersSection = ({ offers = [] }) => {
    const [statusFilter, setStatusFilter] = useState('all');

    if (!Array.isArray(offers) || offers.length === 0) {
        return (
            <div className="company-offers-empty-company">
                <div className="offers-empty-icon-company">
                    <FaGraduationCap />
                </div>
                <h3>No hay ofertas educativas publicadas</h3>
                <p>Aún no has publicado ninguna oferta educativa.</p>
                <Link to="/ControlPanel/createEducationalOffer" className="create-offer-button-company">
                    Publicar oferta educativa
                </Link>
            </div>
        );
    }

    // Helper function to translate status
    const translateStatus = (status) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'accepted': return 'Aceptada';
            case 'cancelled': return 'Cancelada';
            default: return 'Desconocido';
        }
    };

    // Filter offers based on selected status
    const filteredOffers = statusFilter === 'all'
        ? offers
        : offers.filter(offer => offer.status === statusFilter);

    // Helper function to format duration
    const formatDuration = (duration) => {
        if (!duration) return '';
        return `${duration.value} ${duration.unit}`;
    };

    return (
        <div className="company-offers-container-company">
            <div className="offers-filter-section">
                <div className="filter-header">
                    <FaFilter className="filter-icon" />
                    <span>Filtrar por estado:</span>
                </div>
                <div className="filter-options">
                    <button
                        className={`filter-button-company ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        Todas
                    </button>
                    <button
                        className={`filter-button-company ${statusFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Pendientes
                    </button>
                    <button
                        className={`filter-button-company ${statusFilter === 'accepted' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('accepted')}
                    >
                        Aceptadas
                    </button>
                    <button
                        className={`filter-button-company ${statusFilter === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('cancelled')}
                    >
                        Canceladas
                    </button>
                </div>
            </div>

            <div className="offers-list-company">
                {filteredOffers.length === 0 ? (
                    <div className="no-filtered-offers">
                        No hay ofertas educativas con el filtro seleccionado
                    </div>
                ) : (
                    filteredOffers.map((offer) => (
                        <div key={offer._id} className={`offer-card-company status-${offer.status}`}>
                            <div className="offer-status-tag">{translateStatus(offer.status)}</div>
                            <h3 className="offer-title-company">{offer.programName}</h3>
                            <div className="offer-details-company">
                                <div className="offer-detail-company">
                                    <FaGraduationCap />
                                    <span>{offer.studyType}</span>
                                </div>
                                <div className="offer-detail-company">
                                    <FaCalendarAlt />
                                    <span>{formatDuration(offer.duration)}</span>
                                </div>
                                {offer.location && offer.location.city && (
                                    <div className="offer-detail-company">
                                        <FaMapMarkerAlt />
                                        <span>{`${offer.location.city}, ${offer.location.country || ''}`}</span>
                                    </div>
                                )}
                            </div>
                            <div className="offer-actions-company">
                                <Link to={`/ControlPanel/educational-offer/${offer._id}`} className="view-offer-button-company">
                                    Ver oferta
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EducationalOffersSection;
