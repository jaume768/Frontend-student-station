import React, { useState } from 'react';
import './css/MyComunity.css';

const MyComunity = () => {
    const [activeTab, setActiveTab] = useState('seguidos'); // 'seguidos' o 'seguidores'

    // Datos simulados para los perfiles
    const seguidos = [
        { id: 1, name: 'Juan Pérez', role: 'Estilista | Periodista', profilePicture: '/multimedia/profile1.jpg' },
        { id: 2, name: 'Ana Martínez', role: 'Diseñadora | Creativa', profilePicture: '/multimedia/profile2.jpg' },
        { id: 3, name: 'Carlos López', role: 'Fotógrafo | Editor', profilePicture: '/multimedia/profile3.jpg' },
        { id: 4, name: 'Luisa Gómez', role: 'Modista | Ilustradora', profilePicture: '/multimedia/profile4.jpg' },
        { id: 5, name: 'María Rodríguez', role: 'Periodista | Crítica de moda', profilePicture: '/multimedia/profile5.jpg' },
        { id: 6, name: 'Pedro Sánchez', role: 'Estilista | Consultor', profilePicture: '/multimedia/profile6.jpg' },
        // Puedes agregar más perfiles según sea necesario
    ];

    const seguidores = [
        { id: 101, name: 'Sofía Ruiz', role: 'Diseñadora', profilePicture: '/multimedia/profile7.jpg' },
        { id: 102, name: 'Miguel Torres', role: 'Periodista', profilePicture: '/multimedia/profile8.jpg' },
        // Más perfiles para “Mis seguidores”
    ];

    const profilesToDisplay = activeTab === 'seguidos' ? seguidos : seguidores;

    return (
        <div className="mycomunity-container">
            <h1 className="mycomunity-title">Mi comunidad &gt; Perfiles que sigues</h1>

            {/* Contenedor de pestañas centrado */}
            <div className="mycomunity-tabs">
                <button
                    className={`mycomunity-tab ${activeTab === 'seguidos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('seguidos')}
                >
                    Mis seguidos (40)
                </button>
                <button
                    className={`mycomunity-tab ${activeTab === 'seguidores' ? 'active' : ''}`}
                    onClick={() => setActiveTab('seguidores')}
                >
                    Mis seguidores (98)
                </button>
            </div>

            {/* Cuadrícula de perfiles centrada */}
            <div className="mycomunity-grid">
                {profilesToDisplay.map((user) => (
                    <div key={user.id} className="mycomunity-card">
                        <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="mycomunity-profile-img"
                        />
                        <h3 className="mycomunity-user-name">{user.name}</h3>
                        <p className="mycomunity-user-role">{user.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyComunity;
