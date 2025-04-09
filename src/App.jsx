import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ControlPanel from './pages/ControlPanel';
import TokenHandler from './components/TokenHandler';

import CompleteRegistrationProfesional from './pages/profesionales/CompleteRegistrationProfesional';
import CompleteRegistrationProfesionalDatosPersonales from './pages/profesionales/CompleteRegistrationProfesionalDatosPersonales';
import CompleteRegistrationProfesionalInstitucion from './pages/profesionales/CompleteRegistrationProfesionalInstitucion';
import CompleteRegistrationProfesionalMarca05 from './pages/profesionales/CompleteRegistrationProfesionalMarca05';
import CompleteRegistrationProfesionalEmpresa05 from './pages/profesionales/CompleteRegistrationProfesionalEmpresa05';
import CompleteRegistrationProfesionalAgencia05 from './pages/profesionales/CompleteRegistrationProfesionalAgencia05';
import CompleteRegistrationCreativoFinal from './pages/creativos/CompleteRegistrationCreativoFinal';
import UserPost from './components/controlPanel/UserPost';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/token-handler" element={<TokenHandler />} />
        <Route path="/ControlPanel/*" element={<ControlPanel />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Home />} />
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
      </Routes>
    </Router>
  );
}

export default App;
