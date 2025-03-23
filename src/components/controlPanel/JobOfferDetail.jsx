import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/jobOfferDetail.css';

const JobOfferDetail = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

        if (offerId) {
            fetchOfferDetails();
        }
    }, [offerId]);

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
        navigate('/ControlPanel/offers');
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
                    <button className="apply-button-jobdetail">
                        Inscribirme a esta oferta
                    </button>
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
        </div>
    );
};

export default JobOfferDetail;
