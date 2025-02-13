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
import Dashboard from './pages/Dashboard';

// Rutas para el registro PROFESIONAL
import CompleteRegistrationProfesional from './pages/profesionales/CompleteRegistrationProfesional';
import CompleteRegistrationProfesionalDatosPersonales from './pages/profesionales/CompleteRegistrationProfesionalDatosPersonales';
import CompleteRegistrationProfesionalInstitucion from './pages/profesionales/CompleteRegistrationProfesionalInstitucion';
import CompleteRegistrationProfesionalMarca05 from './pages/profesionales/CompleteRegistrationProfesionalMarca05';
import CompleteRegistrationProfesionalEmpresa05 from './pages/profesionales/CompleteRegistrationProfesionalEmpresa05';
import CompleteRegistrationProfesionalAgencia05 from './pages/profesionales/CompleteRegistrationProfesionalAgencia05';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/complete-registration" element={<CompleteRegistration />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/CompleteRegistrationCreativo" element={<CompleteRegistrationCreativo />} />
        <Route path="/CompleteRegistrationCreativo02" element={<CompleteRegistrationCreativo02 />} />
        <Route path="/CompleteRegistrationCreativo03" element={<CompleteRegistrationCreativo03 />} />
        <Route path="/CompleteRegistrationCreativo04" element={<CompleteRegistrationCreativo04 />} />
        <Route path="/CompleteRegistrationCreativoEstudiante05" element={<CompleteRegistrationCreativoEstudiante05 />} />
        <Route path="/CompleteRegistrationCreativoEstudiante06" element={<CompleteRegistrationCreativoEstudiante06 />} />
        <Route path="/CompleteRegistrationCreativoGraduado06" element={<CompleteRegistrationCreativoGraduado06 />} />
        <Route path="/CompleteRegistrationCreativoEstilista05" element={<CompleteRegistrationCreativoEstilista05 />} />
        <Route path="/CompleteRegistrationCreativoEstilista06" element={<CompleteRegistrationCreativoEstilista06 />} />
        <Route path="/CompleteRegistrationCreativoDisenador05" element={<CompleteRegistrationCreativoDisenador05 />} />
        <Route path="/CompleteRegistrationCreativoOtro05" element={<CompleteRegistrationCreativoOtro05 />} />

        <Route path="/CompleteRegistrationProfesional" element={<CompleteRegistrationProfesional />} />
        <Route path="/CompleteRegistrationProfesionalDatosPersonales" element={<CompleteRegistrationProfesionalDatosPersonales />} />
        <Route path="/CompleteRegistrationProfesionalInstitucion" element={<CompleteRegistrationProfesionalInstitucion />} />
        <Route path="/CompleteRegistrationProfesionalMarca05" element={<CompleteRegistrationProfesionalMarca05 />} />
        <Route path="/CompleteRegistrationProfesionalEmpresa05" element={<CompleteRegistrationProfesionalEmpresa05 />} />
        <Route path="/CompleteRegistrationProfesionalAgencia05" element={<CompleteRegistrationProfesionalAgencia05 />} />
      </Routes>
    </Router>
  );
}

export default App;
