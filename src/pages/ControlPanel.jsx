import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/controlPanel/Layout';
import EditProfile from '../components/controlPanel/EditProfile';
import MiPerfil from '../components/controlPanel/MiPerfil';
import MyComunity from '../components/controlPanel/MyComunity';
import CreatePost from '../components/controlPanel/CreatePost';
import UserPost from '../components/controlPanel/UserPost';
import Guardados from '../components/controlPanel/Guardados';
import './css/control-panel.css';

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

    const isUserPost = location.pathname.includes('/post/');
    const contentClassName = isUserPost
        ? 'no-padding'
        : (activeMenu === 'editProfile' ? 'overflow-hidden-desktop' : '');

    const renderContent = () => {
        return (
            <Routes>
                <Route path="post/:id" element={<UserPost />} />
                <Route
                    path="*"
                    element={
                        (() => {
                            switch (activeMenu) {
                                case 'explorer':
                                    return (
                                        <div>
                                            <div className="explorer-gallery">
                                                {randomIndices.map((i, index) => (
                                                    <div className="masonry-item" key={index}>
                                                        <img
                                                            src={`/multimedia/mansory/foto${i + 1}.jpg`}
                                                            alt={`Foto ${i + 1}`}
                                                        />
                                                        <div className="overlay">
                                                            <button className="save-btn">Guardar</button>
                                                            <div className="user-info">
                                                                <img
                                                                    src="/multimedia/usuarioDefault.jpg"
                                                                    alt="Usuario"
                                                                />
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
                                    return <div><h1>Contenido de Creativos</h1></div>;
                                case 'fashion':
                                    return <div><h1>Contenido de Estudiar Moda</h1></div>;
                                case 'blog':
                                    return <div><h1>Contenido de Blog</h1></div>;
                                case 'magazine':
                                    return <div><h1>Contenido de Revista</h1></div>;
                                case 'info':
                                    return <div><h1>Información</h1></div>;
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
                                case 'guardados':
                                    return <Guardados />;
                                default:
                                    return <div><h1>Contenido por defecto</h1></div>;
                            }
                        })()
                    }
                />
            </Routes>
        );
    };

    return (
        <Layout contentClassName={`dashboard-content ${contentClassName}`}>
            {renderContent()}
        </Layout>
    );
};

export default ControlPanel;
