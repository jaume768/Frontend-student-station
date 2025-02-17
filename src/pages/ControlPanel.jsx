import React from 'react';
import Layout from '../components/controlPanel/Layout';
import { useLocation } from 'react-router-dom';
import './css/control-panel.css';

const ControlPanel = () => {
    const location = useLocation();
    const activeMenu = location.state?.activeMenu || 'explorer';

    const renderContent = () => {
        switch (activeMenu) {
            case 'explorer':
                return (
                    <div>
                        <h1>Contenido de Explorar</h1>
                        <p>Aquí va el contenido de la sección Explorar.</p>
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
