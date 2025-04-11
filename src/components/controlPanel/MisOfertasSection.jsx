import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
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

    // Variables para empresas
    const [companyOffers, setCompanyOffers] = useState([]);
    const [offerStatus, setOfferStatus] = useState('accepted');
    const [statusFilter, setStatusFilter] = useState('activas');
    const [totalResults, setTotalResults] = useState(0);
    const [showPracticas, setShowPracticas] = useState(false);
    const [showAllOffers, setShowAllOffers] = useState(true);
    
    // Estado para los modales de confirmación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [selectedOfferId, setSelectedOfferId] = useState(null);

    useEffect(() => {
        if (isCompanyOrInstitution) {
            fetchCompanyOffers();
        } else {
            fetchUserOffers();
        }
    }, [isCreative, activeTab, isCompanyOrInstitution, statusFilter, showPracticas, showAllOffers]);

    // Función para obtener ofertas de usuario creativo
    const fetchUserOffers = async () => {
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
        
        // Forzar la pestaña de guardadas si no es un perfil creativo
        if (!isCreative && activeTab === 'aplicadas') {
            setActiveTab('guardadas');
        }
    };

    // Función para obtener ofertas publicadas por la empresa
    const fetchCompanyOffers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Necesitas iniciar sesión para ver tus ofertas');
                return;
            }

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            // Construir parámetros de filtrado
            let url = `${backendUrl}/api/offers/company`;
            const params = new URLSearchParams();
            
            // Mapear los filtros de UI a los valores del backend
            if (statusFilter === 'activas') {
                params.append('status', 'accepted');
            } else if (statusFilter === 'pendientes') {
                params.append('status', 'pending');
            } else if (statusFilter === 'inactivas') {
                params.append('status', 'cancelled');
            }
            
            if (showPracticas) {
                params.append('practicas', 'true');
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setCompanyOffers(response.data.offers || []);
            setTotalResults(response.data.offers ? response.data.offers.length : 0);
        } catch (error) {
            console.error('Error al obtener ofertas de la empresa:', error);
            setError('No se pudieron cargar tus ofertas publicadas. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

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

    const handleCreateOffer = () => {
        navigate('/ControlPanel/CreateOffer');
    };
    
    const handleReviewCandidates = (offerId, e) => {
        e.stopPropagation();
        navigate(`/ControlPanel/offers/${offerId}/candidates`);
    };
    
    const handleChangeOfferStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.put(
                `${backendUrl}/api/offers/${selectedOfferId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Cerrar el modal y actualizar la lista
            closeModals();
            fetchCompanyOffers();
        } catch (error) {
            console.error(`Error al cambiar estado de la oferta a ${newStatus}:`, error);
            closeModals();
        }
    };
    
    const handleActivateOffer = async (offerId, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.put(
                `${backendUrl}/api/offers/${offerId}/status`,
                { status: 'accepted' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Actualizar la lista
            fetchCompanyOffers();
        } catch (error) {
            console.error(`Error al activar la oferta:`, error);
        }
    };
    
    // Funciones para manejar los modales
    const openDeleteModal = (offerId, e) => {
        if (e) e.stopPropagation();
        setSelectedOfferId(offerId);
        setShowDeleteModal(true);
    };
    
    const openDeactivateModal = (offerId, e) => {
        if (e) e.stopPropagation();
        setSelectedOfferId(offerId);
        setShowDeactivateModal(true);
    };
    
    const closeModals = () => {
        setShowDeleteModal(false);
        setShowDeactivateModal(false);
        setSelectedOfferId(null);
    };
    
    const handleDeleteOffer = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.delete(
                `${backendUrl}/api/offers/${selectedOfferId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Cerrar el modal y actualizar la lista
            closeModals();
            fetchCompanyOffers();
        } catch (error) {
            console.error('Error al eliminar la oferta:', error);
            closeModals();
        }
    };

    // Obtener las ofertas según la pestaña seleccionada para perfil creativo
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

    // Función para renderizar los modales de confirmación
    const renderModals = () => {
        return (
            <>
                {/* Modal de confirmación para eliminar oferta */}
                {showDeleteModal && (
                    <div className="confirmation-modal-overlay">
                        <div className="confirmation-modal">
                            <div className="confirmation-modal-header">
                                <h3>Confirmar eliminación</h3>
                                <button onClick={closeModals} className="close-button">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="confirmation-modal-content">
                                <p>¿Estás seguro de que deseas eliminar esta oferta? Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="confirmation-modal-actions">
                                <button onClick={closeModals} className="cancel-button">Cancelar</button>
                                <button onClick={handleDeleteOffer} className="confirm-button">Eliminar</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Modal de confirmación para desactivar oferta */}
                {showDeactivateModal && (
                    <div className="confirmation-modal-overlay">
                        <div className="confirmation-modal">
                            <div className="confirmation-modal-header">
                                <h3>Confirmar desactivación</h3>
                                <button onClick={closeModals} className="close-button">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="confirmation-modal-content">
                                <p>¿Estás seguro de que deseas desactivar esta oferta? Los candidatos ya no podrán aplicar a ella.</p>
                            </div>
                            <div className="confirmation-modal-actions">
                                <button onClick={closeModals} className="cancel-button">Cancelar</button>
                                <button onClick={() => handleChangeOfferStatus('cancelled')} className="confirm-button deactivate">Desactivar</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };
    
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
                {renderModals()}
            </div>
        );
    }

    // Renderizar interfaz para empresas
    if (isCompanyOrInstitution) {
        return (
            <>
                <div className="company-offers-section">
                    <h2 className="company-offers-title">Gestionar ofertas</h2>
                    <p className="company-offers-description">
                        Explora opciones para estudiar moda y filtra por nivel, modalidad y ubicación para 
                        encontrar la formación que mejor se adapte a ti.
                    </p>
                    
                    <div className="company-offers-filters">
                    <div className="status-filters">
                        <button 
                            className={`status-filter ${statusFilter === 'activas' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('activas')}
                        >
                            Activas
                        </button>
                        <button 
                            className={`status-filter ${statusFilter === 'pendientes' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('pendientes')}
                        >
                            Pendientes de aprobación
                        </button>
                        <button 
                            className={`status-filter ${statusFilter === 'inactivas' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('inactivas')}
                        >
                            Inactivas
                        </button>
                    </div>
                    
                    <div className="secondary-filters">
                        <button 
                            className={`secondary-filter ${showAllOffers ? 'active' : ''}`}
                            onClick={() => {
                                setShowAllOffers(true);
                                setShowPracticas(false);
                            }}
                        >
                            Todas
                        </button>
                        <button 
                            className={`secondary-filter ${showPracticas ? 'active' : ''}`}
                            onClick={() => {
                                setShowPracticas(true);
                                setShowAllOffers(false);
                            }}
                        >
                            Prácticas
                        </button>
                    </div>
                    
                    <div className="results-count">
                        {totalResults} Resultados
                    </div>
                </div>
                
                <div className="company-offers-list">
                    {companyOffers.length > 0 ? (
                        companyOffers.map((offer) => (
                            <div 
                                className="company-offer-card" 
                                key={offer._id}
                            >
                                <h3 className="offer-title">{offer.position}</h3>
                                <div className="offer-details">
                                    <div className="offer-detail">
                                        <span className="detail-label">Publicación:</span>
                                        <span className="detail-value">{formatDate(offer.publicationDate)}</span>
                                    </div>
                                    <div className="offer-detail">
                                        <span className="detail-label">Tipo de oferta:</span>
                                        <span className={`detail-value ${offer.isUrgent ? 'urgent' : ''}`}>
                                            {offer.isUrgent ? 'Urgente' : 'Normal'}
                                        </span>
                                    </div>
                                    <div className="offer-detail">
                                        <span className="detail-label">Estado de la oferta:</span>
                                        <span className={`detail-value status-${offer.status === 'accepted' ? 'activa' : offer.status === 'pending' ? 'pendiente' : 'inactiva'}`}>
                                            {offer.status === 'accepted' ? 'Activa' : 
                                            offer.status === 'cancelled' ? 'Inactiva' : 
                                            offer.status === 'pending' ? 'Pendiente de aprobación' : 'Activa'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="offer-candidates">
                                    <span className="candidates-count">{offer.applicationsCount || 0} candidatos</span>
                                    <span className="candidates-separator">|</span>
                                    <span className="candidates-reviewed">{offer.reviewedApplicationsCount || 0} revisados</span>
                                </div>
                                
                                <div className="offer-actions">
                                    <button 
                                        className="action-btn review-btn"
                                        onClick={(e) => handleReviewCandidates(offer._id, e)}
                                    >
                                        Revisar candidatos
                                    </button>
                                    
                                    {offer.status === 'accepted' ? (
                                        <button 
                                            className="action-btn deactivate-btn"
                                            onClick={(e) => openDeactivateModal(offer._id, e)}
                                        >
                                            Desactivar oferta
                                        </button>
                                    ) : (
                                        <button 
                                            className="action-btn activate-btn"
                                            onClick={(e) => handleActivateOffer(offer._id, e)}
                                        >
                                            Activar oferta
                                        </button>
                                    )}
                                    
                                    <button 
                                        className="action-btn delete-btn"
                                        onClick={(e) => openDeleteModal(offer._id, e)}
                                    >
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-offers-message">
                            <p>No tienes ofertas publicadas con los filtros seleccionados.</p>
                            <button 
                                onClick={handleCreateOffer} 
                                className="create-offer-btn"
                            >
                                Crear nueva oferta
                            </button>
                        </div>
                    )}
                    </div>
                    
                    {companyOffers.length > 0 && (
                        <div className="company-offers-footer">
                            <button 
                                onClick={handleCreateOffer} 
                                className="create-offer-btn"
                            >
                                Crear nueva oferta
                            </button>
                        </div>
                    )}
                </div>
                {renderModals()}
            </>
        );
    }



    // Renderizar interfaz para creativos (nuevo diseño)
    return (
        <>
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
                
                {displayOffers.length > 0 ? (
                    <div className="ofertas-list">
                        {displayOffers.map((offer) => (
                            <div 
                                key={offer._id} 
                                className={`oferta-card ${activeTab === 'caducadas' ? 'oferta-caducada' : ''}`}
                                onClick={() => handleJobOfferClick(offer._id)}
                            >
                                <div className="oferta-content">
                                    <div className="oferta-logo">
                                        <img 
                                            src={offer.companyLogo || '/multimedia/company-default.png'} 
                                            alt={offer.companyName} 
                                        />
                                    </div>
                                    <div className="oferta-details">
                                        <h4 className="oferta-job-title">Descripción del puesto de trabajo</h4>
                                        <p className="oferta-company-name">{offer.companyName || 'Nombre de la empresa o marca'}</p>
                                        
                                        <div className="oferta-info-row">
                                            <span className="info-item">{formatDate(offer.publicationDate)}</span>
                                            <span className="info-separator">|</span>
                                            <span className="info-item">{offer.jobType || 'No especificado'}</span>
                                            <span className="info-separator">|</span>
                                            <span className="info-item"><i className="location-icon"></i> {offer.city}, {offer.country || 'País'}</span>
                                        </div>
                                        
                                        {offer.isUrgent && <div className="urgent-tag">Urgente</div>}
                                        
                                        <div className="oferta-status">
                                            {activeTab === 'aplicadas' && (
                                                <div className="status-pill aplicadas">
                                                    Aplicación enviada
                                                </div>
                                            )}
                                            {activeTab === 'guardadas' && (
                                                <div className="status-pill guardadas">
                                                    Ver detalles
                                                </div>
                                            )}
                                            {activeTab === 'caducadas' && (
                                                <div className="status-pill caducadas">
                                                    Oferta caducada
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                
                <div className="ofertas-footer">
                    <button className="buscar-ofertas-btn" onClick={handleSearchMoreOffers}>
                        Buscar más ofertas
                    </button>
                </div>
            </div>
            {renderModals()}
        </>
    );
};
export default MisOfertasSection;
