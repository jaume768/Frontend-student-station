import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/jobOfferDetail.css';
import ApplyOfferModal from './ApplyOfferModal';

const JobOfferDetail = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userApplied, setUserApplied] = useState(false);

    useEffect(() => {
        const fetchOfferDetails = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/offers/${offerId}`);
                setOffer(response.data.offer);
            } catch (error) {
                console.error('Error cargando detalles de la oferta:', error);
                setError('No se pudo cargar la información de la oferta');
            } finally {
                setLoading(false);
            }
        };

        const checkAuthStatus = () => {
            const token = localStorage.getItem('authToken');
            setIsAuthenticated(!!token);
        };

        if (offerId) {
            fetchOfferDetails();
            checkAuthStatus();
        }
    }, [offerId]);

    // Verificar si el usuario ya aplicó a esta oferta
    useEffect(() => {
        const checkIfUserApplied = async () => {
            if (!isAuthenticated || !offer) return;
            
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem('authToken');
                
                const response = await axios.get(
                    `${backendUrl}/api/offers/${offerId}/check-application`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setUserApplied(response.data.hasApplied);
            } catch (error) {
                console.error('Error al verificar aplicación:', error);
            }
        };
        
        checkIfUserApplied();
    }, [offerId, isAuthenticated, offer]);

    if (loading) {
        return (
            <div className="job-offer-loading-jobdetail">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Cargando detalles de la oferta...</span>
            </div>
        );
    }

    if (error || !offer) {
        return <div className="job-offer-error-jobdetail">{error || 'No se encontró la oferta'}</div>;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleBack = () => {
        navigate(-1); // Utilizar navigate(-1) para volver a la página anterior
    };

    const handleOpenApplyModal = () => {
        if (!isAuthenticated) {
            // Redirigir al login si no está autenticado
            navigate('/login', { state: { from: `/offers/${offerId}` } });
            return;
        }
        setIsApplyModalOpen(true);
    };

    const handleCloseApplyModal = () => {
        setIsApplyModalOpen(false);
    };

    const handleSubmitApplication = async (answers) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem('authToken');

            await axios.post(
                `${backendUrl}/api/offers/${offerId}/apply`,
                { answers },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Actualizar estado de aplicación
            setUserApplied(true);
            return true;
        } catch (error) {
            console.error('Error al enviar la aplicación:', error);
            throw error;
        }
    };

    return (
        <div className="job-offer-detail-container-jobdetail">
            
            {/* Cabecera con imagen (simulando banner) y título */}
            <div className="job-offer-header-jobdetail">
                {/* Imagen grande (puedes cambiarla si tienes otra imagen de banner) */}
                <div className="job-offer-banner-jobdetail">
                    <img
                        src={offer.companyLogo || '/multimedia/company-default.png'}
                        alt={offer.companyName}
                        className="banner-image-jobdetail"
                    />
                </div>
                <div className="job-offer-title-section-jobdetail">
                    <div className="job-offer-title-row-jobdetail">
                        <h1 className="job-offer-position-jobdetail">{offer.position}</h1>
                        {offer.isUrgent && (
                            <span className="urgent-label-jobdetail">Urgente</span>
                        )}
                    </div>
                    <div className="job-offer-company-name-jobdetail">{offer.companyName}</div>
                </div>
            </div>

            {/* Sección con la información básica de la oferta */}
            <div className="job-offer-main-info-jobdetail">
                <div className="job-offer-info-left-jobdetail">
                    <div className="job-offer-metadata-jobdetail">
                        <div className="metadata-tag-jobdetail">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{offer.city}</span>
                        </div>
                        <div className="metadata-tag-jobdetail">
                            <i className="fas fa-building"></i>
                            <span>{offer.jobType}</span>
                        </div>
                        <div className="metadata-tag-jobdetail">
                            <i className="fas fa-map-marked-alt"></i>
                            <span>{offer.locationType}</span>
                        </div>
                        {offer.experience && (
                            <div className="metadata-tag-jobdetail">
                                <i className="fas fa-briefcase"></i>
                                <span>{offer.experience}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="job-offer-info-right-jobdetail">
                    <div className="job-offer-publication-date-jobdetail">
                        Publicado: {formatDate(offer.publicationDate)}
                    </div>
                    {userApplied ? (
                        <button className="apply-button-jobdetail applied-button" disabled>
                            Ya inscrito
                        </button>
                    ) : (
                        <button className="apply-button-jobdetail" onClick={handleOpenApplyModal}>
                            Inscribirme a esta oferta
                        </button>
                    )}
                </div>
            </div>

            {/* Contenido principal de la oferta */}
            <div className="job-offer-content-jobdetail">
                <section className="job-section-jobdetail">
                    <h3 className="section-title-jobdetail">Descripción de la compañía</h3>
                    <div className="rich-text-jobdetail">
                        {offer.companyDescription || `${offer.companyName} es una empresa en el sector de la moda.`}
                    </div>
                </section>

                <section className="job-section-jobdetail">
                    <h3 className="section-title-jobdetail">Descripción del puesto</h3>
                    <div className="rich-text-jobdetail">{offer.description}</div>
                </section>

                {offer.requiredProfile && (
                    <section className="job-section-jobdetail">
                        <h3 className="section-title-jobdetail">Perfil requerido</h3>
                        <div className="rich-text-jobdetail">{offer.requiredProfile}</div>
                    </section>
                )}

                {offer.functions && (
                    <section className="job-section-jobdetail">
                        <h3 className="section-title-jobdetail">Funciones</h3>
                        <div className="rich-text-jobdetail">{offer.functions}</div>
                    </section>
                )}

                {offer.tags && offer.tags.length > 0 && (
                    <section className="job-section-jobdetail">
                        <h3 className="section-title-jobdetail">Hard Skills / Habilidades técnicas</h3>
                        <div className="tags-container-jobdetail">
                            {offer.tags.slice(0, 5).map((tag, index) => (
                                <span key={index} className="skill-tag-jobdetail hard-skill-jobdetail">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <h3 className="section-title-jobdetail">Soft Skills / Habilidades personales</h3>
                        <div className="tags-container-jobdetail">
                            {offer.tags.slice(5).map((tag, index) => (
                                <span key={index} className="skill-tag-jobdetail soft-skill-jobdetail">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {offer.isExternal && (
                    <section className="job-section-jobdetail">
                        <h3 className="section-title-jobdetail">Oferta externa</h3>
                        <p>Esta oferta proviene de un sitio externo. Para aplicar, visita el sitio web de la empresa.</p>
                        <a
                            href={offer.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="external-link-button-jobdetail"
                        >
                            Ir a la oferta externa <i className="fas fa-external-link-alt"></i>
                        </a>
                    </section>
                )}
            </div>

            <ApplyOfferModal
                isOpen={isApplyModalOpen}
                onClose={handleCloseApplyModal}
                onSubmitApplication={handleSubmitApplication}
                offer={offer}
                userApplied={userApplied}
            />
        </div>
    );
};

export default JobOfferDetail;
