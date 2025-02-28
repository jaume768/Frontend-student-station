import React, { useState } from 'react';

const MisOfertasSection = () => {
    // Estado para controlar la pestaña activa: 'aplicadas', 'guardadas' o 'caducadas'
    const [activeTab, setActiveTab] = useState('aplicadas');

    // Datos de ejemplo para las ofertas (cada una con su categoría)
    const jobOffers = [
        {
            id: 1,
            category: 'aplicadas',
            companyLogo: '/multimedia/empresa1.png',
            jobTitle: 'Desarrollador Frontend',
            companyName: 'Tech Solutions',
            publicationDate: '2025-02-20',
            contractType: 'Tiempo completo',
            location: 'Barcelona',
            urgent: true,
        },
        {
            id: 2,
            category: 'aplicadas',
            companyLogo: '/multimedia/empresa2.png',
            jobTitle: 'Diseñador UX/UI',
            companyName: 'Creative Minds',
            publicationDate: '2025-02-18',
            contractType: 'Tiempo parcial',
            location: 'Madrid',
            urgent: false,
        },
        {
            id: 3,
            category: 'guardadas',
            companyLogo: '/multimedia/empresa3.png',
            jobTitle: 'Analista de Datos',
            companyName: 'Data Corp',
            publicationDate: '2025-02-15',
            contractType: 'Freelance',
            location: 'Valencia',
            urgent: false,
        },
        {
            id: 4,
            category: 'guardadas',
            companyLogo: '/multimedia/empresa4.png',
            jobTitle: 'Project Manager',
            companyName: 'Innovate Inc.',
            publicationDate: '2025-02-12',
            contractType: 'Tiempo completo',
            location: 'Sevilla',
            urgent: true,
        },
        {
            id: 5,
            category: 'caducadas',
            companyLogo: '/multimedia/empresa5.png',
            jobTitle: 'Soporte Técnico',
            companyName: 'Support Solutions',
            publicationDate: '2025-01-30',
            contractType: 'Tiempo completo',
            location: 'Bilbao',
            urgent: false,
        },
        {
            id: 6,
            category: 'caducadas',
            companyLogo: '/multimedia/empresa6.png',
            jobTitle: 'Marketing Digital',
            companyName: 'MarketPro',
            publicationDate: '2025-01-25',
            contractType: 'Tiempo parcial',
            location: 'Granada',
            urgent: true,
        },
        // Puedes agregar más ofertas según lo necesites
    ];

    // Filtra las ofertas según la pestaña activa
    const filteredOffers = jobOffers.filter(offer => offer.category === activeTab);

    return (
        <div className="mis-ofertas-section">
            <div className="mis-ofertas-header">
                <button
                    className={`ofertas-tab ${activeTab === 'aplicadas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('aplicadas')}
                >
                    Aplicaciones enviadas
                </button>
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
                {filteredOffers.map((offer) => (
                    <div
                        key={offer.id}
                        className={`oferta-card ${activeTab === 'caducadas' ? 'oferta-caducada' : ''}`}
                    >
                        {offer.urgent && <span className="urgent-badge">Urgente</span>}
                        <div className="oferta-logo">
                            <img src={offer.companyLogo} alt={offer.companyName} />
                        </div>
                        <div className="oferta-details">
                            <h4 className="oferta-job-title">{offer.jobTitle}</h4>
                            <p className="oferta-company-name">{offer.companyName}</p>
                            <p className="oferta-info">
                                <span>{offer.publicationDate}</span> | <span>{offer.contractType}</span> |{' '}
                                <span>{offer.location}</span>
                            </p>
                            <div className="oferta-status">
                                {activeTab === 'aplicadas' && (
                                    <button className="status-btn aplicadas">
                                        Aplicación enviada
                                    </button>
                                )}
                                {activeTab === 'guardadas' && (
                                    <button className="status-btn guardadas">
                                        Enviar candidatura
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
                ))}
            </div>

            <div className="ofertas-footer">
                <button className="buscar-ofertas-btn">Buscar más ofertas</button>
            </div>
        </div>
    );
};

export default MisOfertasSection;
