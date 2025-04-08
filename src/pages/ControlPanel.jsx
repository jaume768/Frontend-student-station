import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Layout from '../components/controlPanel/Layout';
import EditProfile from '../components/controlPanel/EditProfile';
import MiPerfil from '../components/controlPanel/MiPerfil';
import MyComunity from '../components/controlPanel/MyComunity';
import CreatePost from '../components/controlPanel/CreatePost';
import CreateOffer from '../components/controlPanel/CreateOffer';
import CreateEducationalOffer from '../components/controlPanel/CreateEducationalOffer';
import UserPost from '../components/controlPanel/UserPost';
import Guardados from '../components/controlPanel/Guardados';
import UserProfile from '../components/controlPanel/UserProfile';
import FolderContent from '../components/controlPanel/FolderContent';
import Creatives from '../components/controlPanel/Creatives';
import Explorer from '../components/controlPanel/Explorer';
import Offers from '../components/controlPanel/Offers';
import ViewOffer from '../components/controlPanel/ViewOffer';
import JobOfferDetail from '../components/controlPanel/JobOfferDetail';
import EducationalOfferDetail from '../components/controlPanel/EducationalOfferDetail';
import Fashion from '../components/controlPanel/Fashion';
import Blog from '../components/controlPanel/Blog';
import Magazine from '../components/controlPanel/Magazine';
import './css/control-panel.css';

const ControlPanel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeMenu, setActiveMenu] = useState('explorer');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);

        const savedActiveMenu = sessionStorage.getItem('activeMenu');
        if (location.state?.activeMenu) {
            setActiveMenu(location.state.activeMenu);
            sessionStorage.setItem('activeMenu', location.state.activeMenu);
        } else if (savedActiveMenu) {
            setActiveMenu(savedActiveMenu);
        }
    }, [location.pathname, location.state]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const protectedMenus = [
            'editProfile', 'misOfertas', 'configuracion',
            'profile', 'community', 'createPost', 'guardados'
        ];
        if (protectedMenus.includes(activeMenu) && !token) {
            navigate('/', { state: { showRegister: true } });
            return;
        }
    }, [activeMenu, navigate]);

    const renderContent = () => {
        const ProtectedRoute = ({ children }) => {
            if (!isAuthenticated) {
                navigate('/', { state: { showRegister: true } });
                return null;
            }
            return children;
        };

        return (
            <Routes>
                <Route path="post/:id" element={<ProtectedRoute><UserPost /></ProtectedRoute>} />
                <Route path="profile/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="guardados/folder/:folderId" element={<ProtectedRoute><FolderContent /></ProtectedRoute>} />
                <Route path="explorer" element={<Explorer />} />
                <Route path="offers" element={<Offers />} />
                <Route path="offers/:offerId" element={<Offers />} />
                <Route path="JobOfferDetail/:offerId" element={<JobOfferDetail />} />
                <Route path="EducationalOfferDetail/:offerId" element={<EducationalOfferDetail />} />
                <Route path="creatives" element={<Creatives />} />
                <Route path="fashion" element={<Fashion />} />
                <Route path="blog" element={<Blog />} />
                <Route path="magazine" element={<Magazine />} />
                <Route path="article/:id" element={<div><h1>Artículo en desarrollo</h1></div>} />
                <Route path="info" element={<div><h1>Información</h1></div>} />
                <Route path="editProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="misOfertas" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="configuracion" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><MiPerfil /></ProtectedRoute>} />
                <Route path="community" element={<ProtectedRoute><MyComunity /></ProtectedRoute>} />
                <Route path="createPost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="createOffer" element={<ProtectedRoute><CreateOffer /></ProtectedRoute>} />
                <Route path="createEducationalOffer" element={<ProtectedRoute><CreateEducationalOffer /></ProtectedRoute>} />
                <Route path="guardados" element={<ProtectedRoute><Guardados /></ProtectedRoute>} />
                <Route path="offer/:offerId" element={<ProtectedRoute><ViewOffer /></ProtectedRoute>} />
                <Route path="edit-offer/:offerId" element={<ProtectedRoute><CreateOffer /></ProtectedRoute>} />
                <Route path="edit-educational-offer/:offerId" element={<ProtectedRoute><CreateEducationalOffer /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/ControlPanel/explorer" replace />} />
            </Routes>
        );
    };

    const isUserPost = location.pathname.includes('/post/');
    const contentClassName = isUserPost
        ? 'no-padding'
        : (activeMenu === 'editProfile' ? 'overflow-hidden-desktop' : '');

    return (
        <Layout activeMenu={activeMenu} contentClassName={contentClassName}>
            {renderContent()}
        </Layout>
    );
};

export default ControlPanel;
