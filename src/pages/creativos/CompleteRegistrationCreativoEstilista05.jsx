// CompleteRegistrationCreativoEstilista05.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/complete-registration.css';

const CompleteRegistrationCreativoEstilista05 = () => {
  const navigate = useNavigate();
  const [formationType, setFormationType] = useState("");

  const handleNext = async () => {
    if (!formationType) return;
    try {
      const token = localStorage.getItem("authToken");
      // Actualizamos formationType
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ formationType })
      });
      const data = await response.json();
      if (response.ok) {
        if (formationType === "Estudié en una escuela o universidad") {
          navigate('/CompleteRegistrationCreativoEstilista06');
        } else {
          navigate('/dashboard');
        }
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="complete-registration-container">
      <div className="contenedor-registro-objetivo">
        <p className="paso" style={{ color: 'gray', fontSize: '0.8rem' }}>paso 5</p>
        <h2 className="titulo">Tu formación</h2>
        <p className="question">¿Qué tipo de formación cursaste?</p>
        <div className="objectives-list">
          <button
            className={`objective-button ${formationType === "Estudié en una escuela o universidad" ? "selected" : ""}`}
            onClick={() => setFormationType("Estudié en una escuela o universidad")}
          >
            Estudié en una escuela o universidad
          </button>
          <button
            className={`objective-button ${formationType === "Me he formado por mi cuenta" ? "selected" : ""}`}
            onClick={() => setFormationType("Me he formado por mi cuenta")}
          >
            Me he formado por mi cuenta
          </button>
        </div>
        <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <button className="back-button" onClick={handleBack} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
            &#8592; Volver atrás
          </button>
          <button className="next-button" disabled={!formationType} onClick={handleNext}>
            Siguiente
          </button>
        </div>
        <div className="pagination-dots" style={{ marginTop: '1rem' }}>
          {[1,2,3,4,5].map((dot, index) => (
            <span key={index} style={{ margin: '0 4px', fontSize: index === 4 ? '1.2rem' : '1rem', color: 'gray' }}>
              &#9679;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistrationCreativoEstilista05;
