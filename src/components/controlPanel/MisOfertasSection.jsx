import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/MisOfertasSection.css';

const MisOfertasSection = ({ userRole, professionalType }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('aplicadas');
    const [appliedOffers, setAppliedOffers] = useState([]);
    const [savedOffers, setSavedOffers] = useState([]);
    const [expiredOffers, setExpiredOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Determinar si es creativo o empresa/institución
    // El userRole debe ser exactamente 'Creativo' (case sensitive)
    const isCreative = userRole === 'Creativo';
    const isCompanyOrInstitution = professionalType === 1 || professionalType === 2 || professionalType === 4;

    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Necesitas iniciar sesión para ver tus ofertas');
                    return;
                }

                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                // Obtener ofertas guardadas
                const savedOffersResponse = await axios.get(
                    `${backendUrl}/api/users/saved-offers`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Obtener ofertas aplicadas si es perfil creativo
                let appliedOffersData = [];
                if (isCreative) {
                    try {
                        const appliedOffersResponse = await axios.get(
                            `${backendUrl}/api/users/applied-offers`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        appliedOffersData = appliedOffersResponse.data.offers || [];
                    } catch (appliedError) {
                        console.error("Error fetching applied offers:", appliedError);
                    }
                } else {
                    console.log("User is NOT creative, skipping applied offers fetch");
                }
                
                // Filtrar ofertas caducadas (si hay fecha de expiración y ya pasó)
                const currentDate = new Date();
                
                // Procesar ofertas guardadas
                const savedOffersData = savedOffersResponse.data.savedOffers || [];
                const processedSavedOffers = [];
                const processedExpiredOffers = [];
                
                for (const offer of savedOffersData) {
                    // Comprobar si la oferta ha caducado
                    const expirationDate = offer.expirationDate ? new Date(offer.expirationDate) : null;
                    if (expirationDate && expirationDate < currentDate) {
                        processedExpiredOffers.push(offer);
                    } else {
                        processedSavedOffers.push(offer);
                    }
                }
                
                setSavedOffers(processedSavedOffers);
                setAppliedOffers(appliedOffersData);
                setExpiredOffers(processedExpiredOffers);
            } catch (error) {
                console.error('Error al obtener ofertas:', error);
                setError('No se pudieron cargar las ofertas. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
        
        // Forzar la pestaña de guardadas si no es un perfil creativo
        if (!isCreative && activeTab === 'aplicadas') {
            setActiveTab('guardadas');
        }
    }, [isCreative, activeTab]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleJobOfferClick = (offerId) => {
        navigate(`/ControlPanel/JobOfferDetail/${offerId}`);
    };

    const handleSearchMoreOffers = () => {
        navigate('/ControlPanel/offers');
    };

    // Obtener las ofertas según la pestaña seleccionada
    const getDisplayOffers = () => {
        switch (activeTab) {
            case 'aplicadas':
                return appliedOffers;
            case 'guardadas':
                return savedOffers;
            case 'caducadas':
                return expiredOffers;
            default:
                return [];
        }
    };

    const displayOffers = getDisplayOffers();

    if (loading) {
        return (
            <div className="mis-ofertas-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Cargando ofertas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mis-ofertas-error">
                <p>{error}</p>
                <button onClick={handleSearchMoreOffers} className="buscar-ofertas-btn">
                    Buscar ofertas
                </button>
            </div>
        );
    }

    return (
        <div className="mis-ofertas-section">
            <div className="mis-ofertas-header">
                {isCreative && (
                    <button
                        className={`ofertas-tab ${activeTab === 'aplicadas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('aplicadas')}
                    >
                        Aplicaciones enviadas
                    </button>
                )}
                <button
                    className={`ofertas-tab ${activeTab === 'guardadas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('guardadas')}
                >
                    Guardadas
                </button>
                <button
                    className={`ofertas-tab ${activeTab === 'caducadas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('caducadas')}
                >
                    Caducadas
                </button>
            </div>

            <div className="ofertas-list">
                {displayOffers.length > 0 ? (
                    displayOffers.map((offer) => (
                        <div
                            key={offer._id}
                            className={`oferta-card ${activeTab === 'caducadas' ? 'oferta-caducada' : ''}`}
                            onClick={() => handleJobOfferClick(offer._id)}
                        >
                            {offer.isUrgent && <span className="urgent-badge">Urgente</span>}
                            <div className="oferta-logo">
                                <img 
                                    src={offer.companyLogo || '/multimedia/company-default.png'} 
                                    alt={offer.companyName} 
                                />
                            </div>
                            <div className="oferta-details">
                                <h4 className="oferta-job-title">{offer.position}</h4>
                                <p className="oferta-company-name">{offer.companyName}</p>
                                <p className="oferta-info">
                                    <span>{formatDate(offer.publicationDate)}</span> | <span>{offer.jobType}</span> |{' '}
                                    <span>{offer.city}</span>
                                </p>
                                <div className="oferta-status">
                                    {activeTab === 'aplicadas' && (
                                        <button 
                                            className="status-btn aplicadas"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Aplicación enviada
                                        </button>
                                    )}
                                    {activeTab === 'guardadas' && (
                                        <button 
                                            className="status-btn guardadas"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleJobOfferClick(offer._id);
                                            }}
                                        >
                                            Ver detalles
                                        </button>
                                    )}
                                    {activeTab === 'caducadas' && (
                                        <span className="status-btn caducadas">
                                            Oferta caducada
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-ofertas-message">
                        {activeTab === 'aplicadas' && isCreative && (
                            <p>No has aplicado a ninguna oferta todavía.</p>
                        )}
                        {activeTab === 'guardadas' && (
                            <p>No tienes ofertas guardadas.</p>
                        )}
                        {activeTab === 'caducadas' && (
                            <p>No tienes ofertas caducadas.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="ofertas-footer">
                <button className="buscar-ofertas-btn" onClick={handleSearchMoreOffers}>
                    Buscar más ofertas
                </button>
            </div>
        </div>
    );
};

export default MisOfertasSection;
