import React, { useState } from 'react';

const MisOfertasSection = () => {
    // Estado para controlar la pestaña activa: 'aplicadas', 'guardadas' o 'caducadas'
    const [activeTab, setActiveTab] = useState('aplicadas');

    // Datos de ejemplo para las ofertas (puedes reemplazar con datos reales)
    const jobOffers = [
        {
            id: 1,
            companyLogo: '/multimedia/company1.png',
            jobTitle: 'Desarrollador Frontend',
            companyName: 'Tech Solutions',
            publicationDate: '2025-02-20',
            contractType: 'Tiempo completo',
            location: 'Barcelona',
            applicationStatus: 'Aplicación enviada',
            urgent: true,
        },
        {
            id: 2,
            companyLogo: '/multimedia/company2.png',
            jobTitle: 'Diseñador UX/UI',
            companyName: 'Creative Minds',
            publicationDate: '2025-02-18',
            contractType: 'Tiempo parcial',
            location: 'Madrid',
            applicationStatus: 'Aplicación enviada',
            urgent: false,
        },
    ];

    // Aquí podrías filtrar las ofertas según la pestaña activa.
    // En este ejemplo se muestran todas.
    const filteredOffers = jobOffers;

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
                    <div key={offer.id} className="oferta-card">
                        <div className="oferta-logo">
                            <img src={offer.companyLogo} alt={offer.companyName} />
                        </div>
                        <div className="oferta-details">
                            <h4 className="oferta-job-title">{offer.jobTitle}</h4>
                            <p className="oferta-company-name">{offer.companyName}</p>
                            <p className="oferta-info">
                                <span>{offer.publicationDate}</span> |{' '}
                                <span>{offer.contractType}</span> |{' '}
                                <span>{offer.location}</span>
                            </p>
                            <p className="oferta-status">
                                <span className="status-sent">{offer.applicationStatus}</span>
                                {offer.urgent && <span className="status-urgent">Urgente</span>}
                            </p>
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
