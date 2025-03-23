import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/jobOfferDetail.css';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaEuroSign, FaFileDownload } from 'react-icons/fa';

const EducationalOfferDetail = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [galleryIndex, setGalleryIndex] = useState(0);

    useEffect(() => {
        const fetchOfferDetails = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/offers/educational/${offerId}`);
                setOffer(response.data.offer);
            } catch (error) {
                console.error('Error cargando detalles de la oferta educativa:', error);
                setError('No se pudo cargar la información de la oferta educativa');
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
                <span>Cargando detalles de la oferta educativa...</span>
            </div>
        );
    }

    if (error || !offer) {
        return <div className="job-offer-error-jobdetail">{error || 'No se encontró la oferta educativa'}</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleNextImage = () => {
        if (offer.gallery && offer.gallery.length > 0) {
            setGalleryIndex((prevIndex) => (prevIndex + 1) % offer.gallery.length);
        }
    };

    const handlePrevImage = () => {
        if (offer.gallery && offer.gallery.length > 0) {
            setGalleryIndex((prevIndex) => (prevIndex - 1 + offer.gallery.length) % offer.gallery.length);
        }
    };

    // Formatear el precio
    const formatPrice = () => {
        if (!offer.price || !offer.price.amount) return 'Precio no especificado';
        return `${offer.price.amount.toLocaleString('es-ES')} ${offer.price.currency || 'EUR'}`;
    };

    // Formatear la duración
    const formatDuration = () => {
        if (!offer.duration) return 'No especificada';
        return `${offer.duration.value} ${offer.duration.unit}`;
    };

    return (
        <div className="job-offer-detail-container-jobdetail">
            <button onClick={handleBack} className="back-button-jobdetail">
                <i className="fas fa-arrow-left"></i> Volver
            </button>
            
            <div className="job-offer-header-jobdetail">
                {offer.banner && (
                    <div className="job-offer-banner-jobdetail">
                        <img
                            src={offer.banner || '/multimedia/education-default.png'}
                            alt={offer.programName}
                            className="banner-image-jobdetail"
                        />
                    </div>
                )}
                <div className="job-offer-title-section-jobdetail">
                    <div className="job-offer-title-row-jobdetail">
                        <h1 className="job-offer-position-jobdetail">{offer.programName}</h1>
                    </div>
                    <div className="job-offer-company-name-jobdetail">{offer.studyType}</div>
                </div>
            </div>

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
                            <span>{formatDuration()}</span>
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

            <div className="job-offer-content-jobdetail">
                <section className="job-section-jobdetail">
                    <h3 className="section-title-jobdetail">Descripción del programa</h3>
                    <div className="rich-text-jobdetail" dangerouslySetInnerHTML={{ __html: offer.description }}></div>
                </section>

                {offer.requirements && (
                    <section className="job-section-jobdetail">
                        <h3 className="section-title-jobdetail">Requisitos</h3>
                        <div className="rich-text-jobdetail" dangerouslySetInnerHTML={{ __html: offer.requirements }}></div>
                    </section>
                )}

                {offer.syllabus && (
                    <section className="job-section-jobdetail">
                        <h3 className="section-title-jobdetail">Plan de estudios</h3>
                        <div className="rich-text-jobdetail" dangerouslySetInnerHTML={{ __html: offer.syllabus }}></div>
                    </section>
                )}

                {offer.gallery && offer.gallery.length > 0 && (
                    <section className="job-section-jobdetail">
                        <h3 className="section-title-jobdetail">Galería</h3>
                        <div className="educational-offer-gallery-jobdetail">
                            <div className="gallery-navigation-jobdetail">
                                <button onClick={handlePrevImage} className="gallery-nav-button-jobdetail">
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <div className="gallery-image-container-jobdetail">
                                    <img 
                                        src={offer.gallery[galleryIndex]} 
                                        alt={`Imagen ${galleryIndex + 1} de ${offer.programName}`} 
                                    />
                                </div>
                                <button onClick={handleNextImage} className="gallery-nav-button-jobdetail">
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                            <div className="gallery-indicators-jobdetail">
                                {offer.gallery.map((_, index) => (
                                    <span 
                                        key={index} 
                                        className={`gallery-indicator-jobdetail ${index === galleryIndex ? 'active' : ''}`}
                                        onClick={() => setGalleryIndex(index)}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="job-section-jobdetail">
                    <h3 className="section-title-jobdetail">Información adicional</h3>
                    <div className="additional-info-jobdetail">
                        <div className="info-row-jobdetail">
                            <span className="info-label-jobdetail">Precio:</span>
                            <span className="info-value-jobdetail">{formatPrice()}</span>
                        </div>
                        <div className="info-row-jobdetail">
                            <span className="info-label-jobdetail">Fecha de inicio:</span>
                            <span className="info-value-jobdetail">{formatDate(offer.startDate)}</span>
                        </div>
                        {offer.endDate && (
                            <div className="info-row-jobdetail">
                                <span className="info-label-jobdetail">Fecha de finalización:</span>
                                <span className="info-value-jobdetail">{formatDate(offer.endDate)}</span>
                            </div>
                        )}
                    </div>
                </section>

                {offer.brochureUrl && (
                    <section className="job-section-jobdetail">
                        <h3 className="section-title-jobdetail">Documentación</h3>
                        <a 
                            href={offer.brochureUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="download-brochure-button-jobdetail"
                        >
                            <i className="fas fa-file-download"></i> Descargar folleto informativo
                        </a>
                    </section>
                )}
                
                {!offer.applicationLink && offer.contactInfo && (
                    <section className="job-section-jobdetail">
                        <h3 className="section-title-jobdetail">Contacto</h3>
                        <div className="rich-text-jobdetail" dangerouslySetInnerHTML={{ __html: offer.contactInfo }}></div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default EducationalOfferDetail;
