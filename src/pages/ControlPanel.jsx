import React, { useEffect, useState } from 'react';
import Layout from '../components/controlPanel/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/control-panel.css';
import EditProfile from '../components/controlPanel/EditProfile';
import MiPerfil from '../components/controlPanel/MiPerfil';
import MyComunity from '../components/controlPanel/MyComunity';
import CreatePost from '../components/controlPanel/CreatePost';
import UserPost from '../components/controlPanel/UserPost';

const ControlPanel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [randomIndices, setRandomIndices] = useState([]);


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        let result = [];
        while (result.length < 80) {
            const indices = Array.from({ length: 30 }, (_, i) => i);
            const shuffled = indices.sort(() => Math.random() - 0.5);
            result = result.concat(shuffled);
        }
        setRandomIndices(result.slice(0, 80));
    }, []);

    const activeMenu = location.state?.activeMenu || 'explorer';

    const renderContent = () => {
        if (location.pathname.includes('/control-panel/post/')) {
            return <UserPost />;
        }
        switch (activeMenu) {
            case 'explorer':
                return (
                    <div>
                        <div className="explorer-gallery">
                            {randomIndices.map((i, index) => (
                                <div className="masonry-item" key={index}>
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
            case 'editProfile':
            case 'misOfertas':
            case 'configuracion':
                return <EditProfile />;
            case 'profile':
                return <MiPerfil />;
            case 'community':
                return <MyComunity />;
            case 'createPost':
                return <CreatePost />;    
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
        <Layout contentClassName={activeMenu === 'editProfile' ? 'overflow-hidden-desktop' : ''}>
            {renderContent()}
        </Layout>
    );
};

export default ControlPanel;
