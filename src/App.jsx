import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import CompleteRegistration from './pages/CompleteRegistration';

// Rutas para el registro CRIATIVO
import CompleteRegistrationCreativo from './pages/creativos/CompleteRegistrationCreativo';
import CompleteRegistrationCreativo02 from './pages/creativos/CompleteRegistrationCreativo02';
import CompleteRegistrationCreativo03 from './pages/creativos/CompleteRegistrationCreativo03';
import CompleteRegistrationCreativo04 from './pages/creativos/CompleteRegistrationCreativo04';
import CompleteRegistrationCreativoEstudiante05 from './pages/creativos/CompleteRegistrationCreativoEstudiante05';
import CompleteRegistrationCreativoEstudiante06 from './pages/creativos/CompleteRegistrationCreativoEstudiante06';
import CompleteRegistrationCreativoGraduado06 from './pages/creativos/CompleteRegistrationCreativoGraduado06';
import CompleteRegistrationCreativoEstilista05 from './pages/creativos/CompleteRegistrationCreativoEstilista05';
import CompleteRegistrationCreativoEstilista06 from './pages/creativos/CompleteRegistrationCreativoEstilista06';
import CompleteRegistrationCreativoDisenador05 from './pages/creativos/CompleteRegistrationCreativoDisenador05';
import CompleteRegistrationCreativoOtro05 from './pages/creativos/CompleteRegistrationCreativoOtro05';
import TokenHandler from './components/TokenHandler';

import CompleteRegistrationProfesional from './pages/profesionales/CompleteRegistrationProfesional';
import CompleteRegistrationProfesionalDatosPersonales from './pages/profesionales/CompleteRegistrationProfesionalDatosPersonales';
import CompleteRegistrationProfesionalInstitucion from './pages/profesionales/CompleteRegistrationProfesionalInstitucion';
import CompleteRegistrationProfesionalMarca05 from './pages/profesionales/CompleteRegistrationProfesionalMarca05';
import CompleteRegistrationProfesionalEmpresa05 from './pages/profesionales/CompleteRegistrationProfesionalEmpresa05';
import CompleteRegistrationProfesionalAgencia05 from './pages/profesionales/CompleteRegistrationProfesionalAgencia05';
import CompleteRegistrationCreativoFinal from './pages/creativos/CompleteRegistrationCreativoFinal';

// Importar todos los componentes que antes estaban en ControlPanel
import Layout from './components/controlPanel/Layout';
import EditProfile from './components/controlPanel/EditProfile';
import MiPerfil from './components/controlPanel/MiPerfil';
import MyComunity from './components/controlPanel/MyComunity';
import CreatePost from './components/controlPanel/CreatePost';
import CreateOffer from './components/controlPanel/CreateOffer';
import CreateEducationalOffer from './components/controlPanel/CreateEducationalOffer';
import UserPost from './components/controlPanel/UserPost';
import Guardados from './components/controlPanel/Guardados';
import UserProfile from './components/controlPanel/UserProfile';
import FolderContent from './components/controlPanel/FolderContent';
import Creatives from './components/controlPanel/Creatives';
import Explorer from './components/controlPanel/Explorer';
import Offers from './components/controlPanel/Offers';
import ViewOffer from './components/controlPanel/ViewOffer';
import JobOfferDetail from './components/controlPanel/JobOfferDetail';
import EducationalOfferDetail from './components/controlPanel/EducationalOfferDetail';
import Fashion from './components/controlPanel/Fashion';
import Blog from './components/controlPanel/Blog';
import Magazine from './components/controlPanel/Magazine';
import ArticleDetail from './components/controlPanel/ArticleDetail';
import AvisoLegal from './components/controlPanel/AvisoLegal';
import Privacidad from './components/controlPanel/Privacidad';
import Cookies from './components/controlPanel/Cookies';
import Contacto from './components/controlPanel/Contacto';
import About from './components/controlPanel/About';

// Importar CSS
import './pages/css/control-panel.css';

function App() {
  const AppWithLayout = ({ children, activeMenu, contentClassName }) => {
    return (
      <Layout activeMenu={activeMenu} contentClassName={contentClassName}>
        {children}
      </Layout>
    );
  };

  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    if (!isAuthenticated) {
      window.location.href = '/?showRegister=true';
      return null;
    }
    return children;
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/token-handler" element={<TokenHandler />} />
        
        {/* Rutas de registro */}
        <Route path="/complete-registration" element={<CompleteRegistration />} />
        <Route path="/creativo/registro" element={<CompleteRegistrationCreativo />} />
        <Route path="/creativo/registro/02" element={<CompleteRegistrationCreativo02 />} />
        <Route path="/photo/registro/03" element={<CompleteRegistrationCreativo03 />} />
        <Route path="/conocidos/registro/04" element={<CompleteRegistrationCreativo04 />} />
        <Route path="/creativo/registro/estudiante/05" element={<CompleteRegistrationCreativoEstudiante05 />} />
        <Route path="/creativo/registro/estudiante/06" element={<CompleteRegistrationCreativoEstudiante06 />} />
        <Route path="/creativo/registro/graduado/06" element={<CompleteRegistrationCreativoGraduado06 />} />
        <Route path="/creativo/registro/estilista/05" element={<CompleteRegistrationCreativoEstilista05 />} />
        <Route path="/creativo/registro/estilista/06" element={<CompleteRegistrationCreativoEstilista06 />} />
        <Route path="/creativo/registro/disenador/05" element={<CompleteRegistrationCreativoDisenador05 />} />
        <Route path="/creativo/registro/otro/05" element={<CompleteRegistrationCreativoOtro05 />} />
        <Route path="/creativo/registro/final" element={<CompleteRegistrationCreativoFinal />} />
        <Route path="/profesional/registro" element={<CompleteRegistrationProfesional />} />
        <Route path="/profesional/registro/datos-personales" element={<CompleteRegistrationProfesionalDatosPersonales />} />
        <Route path="/profesional/registro/institucion" element={<CompleteRegistrationProfesionalInstitucion />} />
        <Route path="/profesional/registro/marca/05" element={<CompleteRegistrationProfesionalMarca05 />} />
        <Route path="/profesional/registro/empresa/05" element={<CompleteRegistrationProfesionalEmpresa05 />} />
        <Route path="/profesional/registro/agencia/05" element={<CompleteRegistrationProfesionalAgencia05 />} />
        
        {/* Rutas públicas con Layout */}
        <Route path="/explorer" element={<AppWithLayout activeMenu="explorer"><Explorer /></AppWithLayout>} />
        <Route path="/offers" element={<AppWithLayout activeMenu="offers"><Offers /></AppWithLayout>} />
        <Route path="/offers/:offerId" element={<AppWithLayout activeMenu="offers"><Offers /></AppWithLayout>} />
        <Route path="/JobOfferDetail/:offerId" element={<AppWithLayout activeMenu="offers"><JobOfferDetail /></AppWithLayout>} />
        <Route path="/EducationalOfferDetail/:offerId" element={<AppWithLayout activeMenu="offers"><EducationalOfferDetail /></AppWithLayout>} />
        <Route path="/creatives" element={<AppWithLayout activeMenu="creatives"><Creatives /></AppWithLayout>} />
        <Route path="/fashion" element={<AppWithLayout activeMenu="fashion"><Fashion /></AppWithLayout>} />
        <Route path="/blog" element={<AppWithLayout activeMenu="blog"><Blog /></AppWithLayout>} />
        <Route path="/magazine" element={<AppWithLayout activeMenu="magazine"><Magazine /></AppWithLayout>} />
        <Route path="/article/:id" element={<AppWithLayout activeMenu="blog"><ArticleDetail /></AppWithLayout>} />
        <Route path="/legal" element={<AppWithLayout activeMenu="info"><AvisoLegal /></AppWithLayout>} />
        <Route path="/privacy" element={<AppWithLayout activeMenu="info"><Privacidad /></AppWithLayout>} />
        <Route path="/cookies" element={<AppWithLayout activeMenu="info"><Cookies /></AppWithLayout>} />
        <Route path="/contact" element={<AppWithLayout activeMenu="info"><Contacto /></AppWithLayout>} />
        <Route path="/about" element={<AppWithLayout activeMenu="info"><About /></AppWithLayout>} />
        <Route path="/info" element={<AppWithLayout activeMenu="info"><div><h1>Información</h1></div></AppWithLayout>} />
        
        {/* Rutas públicas sin protección pero con layout especial */}
        <Route path="/profile/:username" element={<AppWithLayout activeMenu="creatives"><UserProfile /></AppWithLayout>} />
        <Route path="/post/:id" element={<AppWithLayout activeMenu="community" contentClassName="no-padding"><ProtectedRoute><UserPost /></ProtectedRoute></AppWithLayout>} />
        
        {/* Rutas protegidas */}
        <Route path="/editProfile" element={<AppWithLayout activeMenu="editProfile" contentClassName="overflow-hidden-desktop"><ProtectedRoute><EditProfile /></ProtectedRoute></AppWithLayout>} />
        <Route path="/misOfertas" element={<AppWithLayout activeMenu="misOfertas" contentClassName="overflow-hidden-desktop"><ProtectedRoute><EditProfile /></ProtectedRoute></AppWithLayout>} />
        <Route path="/configuracion" element={<AppWithLayout activeMenu="configuracion" contentClassName="overflow-hidden-desktop"><ProtectedRoute><EditProfile /></ProtectedRoute></AppWithLayout>} />
        <Route path="/profile" element={<AppWithLayout activeMenu="profile"><ProtectedRoute><MiPerfil /></ProtectedRoute></AppWithLayout>} />
        <Route path="/community" element={<AppWithLayout activeMenu="community"><ProtectedRoute><MyComunity /></ProtectedRoute></AppWithLayout>} />
        <Route path="/createPost" element={<AppWithLayout activeMenu="community"><ProtectedRoute><CreatePost /></ProtectedRoute></AppWithLayout>} />
        <Route path="/createOffer" element={<AppWithLayout activeMenu="offers"><ProtectedRoute><CreateOffer /></ProtectedRoute></AppWithLayout>} />
        <Route path="/createEducationalOffer" element={<AppWithLayout activeMenu="offers"><ProtectedRoute><CreateEducationalOffer /></ProtectedRoute></AppWithLayout>} />
        <Route path="/guardados" element={<AppWithLayout activeMenu="guardados"><ProtectedRoute><Guardados /></ProtectedRoute></AppWithLayout>} />
        <Route path="/guardados/folder/:folderId" element={<AppWithLayout activeMenu="guardados"><ProtectedRoute><FolderContent /></ProtectedRoute></AppWithLayout>} />
        <Route path="/offer/:offerId" element={<AppWithLayout activeMenu="offers"><ProtectedRoute><ViewOffer /></ProtectedRoute></AppWithLayout>} />
        <Route path="/edit-offer/:offerId" element={<AppWithLayout activeMenu="offers"><ProtectedRoute><CreateOffer /></ProtectedRoute></AppWithLayout>} />
        <Route path="/edit-educational-offer/:offerId" element={<AppWithLayout activeMenu="offers"><ProtectedRoute><CreateEducationalOffer /></ProtectedRoute></AppWithLayout>} />
        
        {/* Rutas de home y login */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
