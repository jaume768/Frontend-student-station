import React, { useState } from 'react';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserEducationalOffersSection = ({ offers = [] }) => {
    const [statusFilter, setStatusFilter] = useState('all');

    if (!Array.isArray(offers) || offers.length === 0) {
        return (
            <div className="company-offers-empty">
                <div className="offers-empty-icon">
                    <FaGraduationCap />
                </div>
                <h3>No hay ofertas educativas publicadas</h3>
                <p>Esta institución aún no ha publicado ninguna oferta educativa.</p>
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
        <div className="company-offers-container">
            <div className="offers-filter-section">
                <div className="filter-header">
                    <FaFilter className="filter-icon" />
                    <span>Filtrar por estado:</span>
                </div>
                <div className="filter-options">
                    <button
                        className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        Todas
                    </button>
                    <button
                        className={`filter-button ${statusFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Pendientes
                    </button>
                    <button
                        className={`filter-button ${statusFilter === 'accepted' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('accepted')}
                    >
                        Aceptadas
                    </button>
                    <button
                        className={`filter-button ${statusFilter === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('cancelled')}
                    >
                        Canceladas
                    </button>
                </div>
            </div>

            <div className="offers-list">
                {filteredOffers.length === 0 ? (
                    <div className="no-filtered-offers">
                        No hay ofertas educativas con el filtro seleccionado
                    </div>
                ) : (
                    filteredOffers.map((offer) => (
                        <div key={offer._id} className={`offer-card status-${offer.status}`}>
                            <div className="offer-status-tag">{translateStatus(offer.status)}</div>
                            <h3 className="offer-title">{offer.programName}</h3>
                            <div className="offer-details">
                                <div className="offer-detail">
                                    <FaGraduationCap />
                                    <span>{offer.studyType}</span>
                                </div>
                                <div className="offer-detail">
                                    <FaCalendarAlt />
                                    <span>{formatDuration(offer.duration)}</span>
                                </div>
                                {offer.location && offer.location.city && (
                                    <div className="offer-detail">
                                        <FaMapMarkerAlt />
                                        <span>{`${offer.location.city}, ${offer.location.country || ''}`}</span>
                                    </div>
                                )}
                            </div>
                            <div className="offer-actions">
                                <Link to={`/ControlPanel/educational-offer/${offer._id}`} className="view-offer-button">
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

export default UserEducationalOffersSection;
