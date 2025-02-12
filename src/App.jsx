// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CompleteRegistration from './pages/CompleteRegistration';
import CompleteRegistrationCreativo from './pages/CompleteRegistrationCreativo';
import CompleteRegistrationCreativo02 from './pages/CompleteRegistrationCreativo02';
import CompleteRegistrationCreativo03 from './pages/CompleteRegistrationCreativo03';
import CompleteRegistrationCreativo04 from './pages/CompleteRegistrationCreativo04';
// Rutas para los flujos según la opción seleccionada:
import CompleteRegistrationCreativoEstudiante05 from './pages/CompleteRegistrationCreativoEstudiante05';
import CompleteRegistrationCreativoEstudiante06 from './pages/CompleteRegistrationCreativoEstudiante06';
import CompleteRegistrationCreativoGraduado06 from './pages/CompleteRegistrationCreativoGraduado06';
import CompleteRegistrationCreativoEstilista05 from './pages/CompleteRegistrationCreativoEstilista05';
import CompleteRegistrationCreativoEstilista06 from './pages/CompleteRegistrationCreativoEstilista06';
import CompleteRegistrationCreativoDisenador05 from './pages/CompleteRegistrationCreativoDisenador05';
import CompleteRegistrationCreativoOtro05 from './pages/CompleteRegistrationCreativoOtro05';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/complete-registration" element={<CompleteRegistration />} />
        <Route path="/CompleteRegistrationCreativo" element={<CompleteRegistrationCreativo />} />
        <Route path="/CompleteRegistrationCreativo02" element={<CompleteRegistrationCreativo02 />} />
        <Route path="/CompleteRegistrationCreativo03" element={<CompleteRegistrationCreativo03 />} />
        <Route path="/CompleteRegistrationCreativo04" element={<CompleteRegistrationCreativo04 />} />
        {/* Rutas según la opción del creativo */}
        <Route path="/CompleteRegistrationCreativoEstudiante05" element={<CompleteRegistrationCreativoEstudiante05 />} />
        <Route path="/CompleteRegistrationCreativoEstudiante06" element={<CompleteRegistrationCreativoEstudiante06 />} />
        <Route path="/CompleteRegistrationCreativoGraduado06" element={<CompleteRegistrationCreativoGraduado06 />} />
        <Route path="/CompleteRegistrationCreativoEstilista05" element={<CompleteRegistrationCreativoEstilista05 />} />
        <Route path="/CompleteRegistrationCreativoEstilista06" element={<CompleteRegistrationCreativoEstilista06 />} />
        <Route path="/CompleteRegistrationCreativoDisenador05" element={<CompleteRegistrationCreativoDisenador05 />} />
        <Route path="/CompleteRegistrationCreativoOtro05" element={<CompleteRegistrationCreativoOtro05 />} />
      </Routes>
    </Router>
  );
}

export default App;
