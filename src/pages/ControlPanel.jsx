import React, { useEffect } from 'react';
import Layout from '../components/controlPanel/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/control-panel.css';

const ControlPanel = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Efecto para remover el token de la URL si está presente
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            // Remueve el query string dejando solo la ruta base
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const activeMenu = location.state?.activeMenu || 'explorer';

    const renderContent = () => {
        switch (activeMenu) {
            case 'explorer':
                return (
                    <div>
                        <div className="explorer-gallery">
                            {[...Array(30)].map((_, i) => (
                                <div className="masonry-item" key={i}>
                                    <img src={`/multimedia/mansory/foto${i + 1}.jpg`} alt={`Foto ${i + 1}`} />
                                    <div className="overlay">
                                        <button className="save-btn">Guardar</button>
                                        <div className="user-info">
                                            <img src="/multimedia/usuarioDefault.jpg" alt="Usuario" />
                                            <span>Prueba_111</span>
                                        </div>
                                        <div className="location-info">
                                            <i className="location-icon fas fa-map-marker-alt"></i>
                                            <span>Barcelona</span>
                                        </div>
                                        <div className="tag-label">Estilista</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'creatives':
                return (
                    <div>
                        <h1>Contenido de Creativos</h1>
                        <p>Aquí va el contenido de la sección Creativos.</p>
                    </div>
                );
            case 'fashion':
                return (
                    <div>
                        <h1>Contenido de Estudiar Moda</h1>
                        <p>Aquí va el contenido de la sección de Moda.</p>
                    </div>
                );
            case 'offers':
                return (
                    <div>
                        <h1>Contenido de Ofertas</h1>
                        <p>Aquí va el contenido de la sección Ofertas.</p>
                    </div>
                );
            case 'blog':
                return (
                    <div>
                        <h1>Contenido de Blog</h1>
                        <p>Aquí va el contenido de la sección Blog.</p>
                    </div>
                );
            case 'magazine':
                return (
                    <div>
                        <h1>Contenido de Revista</h1>
                        <p>Aquí va el contenido de la sección Revista.</p>
                    </div>
                );
            case 'info':
                return (
                    <div>
                        <h1>Información</h1>
                        <p>Aquí va el contenido de la sección Información.</p>
                    </div>
                );
            default:
                return (
                    <div>
                        <h1>Contenido por defecto</h1>
                        <p>Este es el contenido por defecto.</p>
                    </div>
                );
        }
    };

    return (
        <Layout>
            {renderContent()}
        </Layout>
    );
};

export default ControlPanel;
