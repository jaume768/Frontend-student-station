import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './css/offers.css';

const Offers = () => {
    const navigate = useNavigate();
    const { offerId } = useParams();
    const [offers, setOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar todas las ofertas aceptadas
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/offers?status=accepted`);
                const offersData = response.data.offers || [];
                setOffers(offersData);
                
                // Si hay un offerId en la URL, seleccionar esa oferta
                if (offerId) {
                    const offer = offersData.find(o => o._id === offerId);
                    setSelectedOffer(offer || offersData[0]);
                } else if (offersData.length > 0) {
                    setSelectedOffer(offersData[0]);
                }
            } catch (error) {
                console.error('Error cargando ofertas:', error);
                setError('No se pudieron cargar las ofertas');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [offerId]);

    const handleOfferClick = (offer) => {
        setSelectedOffer(offer);
        navigate(`/ControlPanel/offers/${offer._id}`);
    };

    if (loading) {
        return (
            <div className="offers-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Cargando ofertas...</span>
            </div>
        );
    }

    if (error) {
        return <div className="offers-error">{error}</div>;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div className="offers-container">
            {/* Lista de ofertas */}
            <div className="offers-list">
                {offers.map(offer => (
                    <div
                        key={offer._id}
                        className={`offer-item ${selectedOffer?._id === offer._id ? 'selected' : ''}`}
                        onClick={() => handleOfferClick(offer)}
                    >
                        <div className="offer-item-header">
                            <img 
                                src={offer.companyLogo || "/multimedia/company-default.png"} 
                                alt={offer.companyName}
                                className="company-logo"
                            />
                            <div className="offer-basic-info">
                                <h3>{offer.position}</h3>
                                <p className="company-name">{offer.companyName}</p>
                                <p className="location">
                                    <i className="fas fa-map-marker-alt"></i>
                                    {offer.city}
                                    {offer.locationType === 'remote' && <span className="remote-badge">Remoto</span>}
                                </p>
                            </div>
                        </div>
                        <div className="offer-item-footer">
                            <span className="publish-date">
                                <i className="far fa-clock"></i>
                                Publicado el {formatDate(offer.publicationDate)}
                            </span>
                            {offer.applicants && (
                                <span className="applicants">
                                    <i className="fas fa-users"></i>
                                    {offer.applicants.length} candidatos
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Detalle de la oferta seleccionada */}
            {selectedOffer && (
                <div className="offer-detail">
                    <div className="offer-detail-header">
                        <img 
                            src={selectedOffer.companyLogo || "/multimedia/company-default.png"} 
                            alt={selectedOffer.companyName}
                            className="company-logo-large"
                        />
                        <div className="offer-title-section">
                            <h1>{selectedOffer.position}</h1>
                            <h2>{selectedOffer.companyName}</h2>
                            <p className="location-detail">
                                <i className="fas fa-map-marker-alt"></i>
                                {selectedOffer.city}
                                {selectedOffer.locationType === 'remote' && <span className="remote-badge">Remoto</span>}
                            </p>
                            <div className="offer-actions">
                                <button className="apply-button">
                                    <i className="fas fa-paper-plane"></i>
                                    Solicitar
                                </button>
                                <button className="save-button">
                                    <i className="far fa-bookmark"></i>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="offer-detail-content">
                        <section className="offer-section">
                            <h3>Descripción del puesto</h3>
                            <div className="rich-text">{selectedOffer.description}</div>
                        </section>

                        {selectedOffer.requiredProfile && (
                            <section className="offer-section">
                                <h3>Perfil requerido</h3>
                                <div className="rich-text">{selectedOffer.requiredProfile}</div>
                            </section>
                        )}

                        <section className="offer-section">
                            <h3>Información adicional</h3>
                            <div className="additional-info">
                                <div className="info-item">
                                    <i className="fas fa-briefcase"></i>
                                    <span>Tipo de trabajo:</span>
                                    <strong>{selectedOffer.jobType}</strong>
                                </div>
                                <div className="info-item">
                                    <i className="fas fa-map-marked-alt"></i>
                                    <span>Tipo de ubicación:</span>
                                    <strong>{selectedOffer.locationType === 'remote' ? 'Remoto' : 'Presencial'}</strong>
                                </div>
                                <div className="info-item">
                                    <i className="fas fa-calendar-alt"></i>
                                    <span>Fecha de publicación:</span>
                                    <strong>{formatDate(selectedOffer.publicationDate)}</strong>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;
