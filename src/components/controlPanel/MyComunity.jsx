import React, { useState } from 'react';
import './css/MyComunity.css';

const MyComunity = () => {
    const [activeTab, setActiveTab] = useState('seguidos'); // 'seguidos' o 'seguidores'

    // Datos simulados para los perfiles
    const seguidos = [
        { id: 1, name: 'Juan Pérez', role: 'Estilista | Periodista', profilePicture: '/multimedia/usuarioDefault.jpg' },
        { id: 2, name: 'Ana Martínez', role: 'Diseñadora | Creativa', profilePicture: '/multimedia/usuarioDefault.jpg' },
        { id: 3, name: 'Carlos López', role: 'Fotógrafo | Editor', profilePicture: '/multimedia/usuarioDefault.jpg' },
        { id: 4, name: 'Luisa Gómez', role: 'Modista | Ilustradora', profilePicture: '/multimedia/usuarioDefault.jpg' },
        { id: 5, name: 'María Rodríguez', role: 'Periodista | Crítica de moda', profilePicture: '/multimedia/usuarioDefault.jpg' },
        { id: 6, name: 'Pedro Sánchez', role: 'Estilista | Consultor', profilePicture: '/multimedia/usuarioDefault.jpg' },
        // Puedes agregar más perfiles según sea necesario
    ];

    const seguidores = [
        { id: 101, name: 'Sofía Ruiz', role: 'Diseñadora', profilePicture: '/multimedia/usuarioDefault.jpg' },
        { id: 102, name: 'Miguel Torres', role: 'Periodista', profilePicture: '/multimedia/usuarioDefault.jpg' },
        // Más perfiles para “Mis seguidores”
    ];

    const profilesToDisplay = activeTab === 'seguidos' ? seguidos : seguidores;

    return (
        <div className="mycomunity-container">
            <h1 className="mycomunity-title">
                Mi comunidad &gt; {activeTab === 'seguidos' ? 'Perfiles que sigues' : 'Perfiles que te siguen'}
            </h1>

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

            {/* Contenedor de perfiles usando flex */}
            <div className="mycomunity-flex">
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
