import React, { useState } from 'react';
import { FaTh, FaList, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './css/miPerfil.css';

const MiPerfil = () => {
    // Estado para alternar la vista de proyectos (galería/individual)
    const [isGalleryView, setIsGalleryView] = useState(true);
    // Estado para controlar la pestaña activa en vista móvil ('perfil' o 'publicaciones')
    const [activeTab, setActiveTab] = useState('perfil');

    const toggleView = () => {
        setIsGalleryView((prev) => !prev);
    };

    return (
        <div className="miPerfil-container">
            {/* Encabezado y pestañas para móvil */}
            <div className="miPerfil-header-container">
                <header className="miPerfil-header">
                    <img
                        src="/multimedia/usuarioDefault.jpg"
                        alt="Perfil"
                        className="miPerfil-photo"
                    />
                    <div className="miPerfil-personal-info">
                        <h1 className="miPerfil-name">Daniela Gómez</h1>
                        <p className="miPerfil-occupations">
                            Periodista | Estilista | Dirección creativa
                        </p>
                        <p className="miPerfil-location">Valencia, España</p>
                    </div>
                </header>
                {/* Pestañas solo para vista móvil */}
                <div className="miPerfil-mobile-tabs">
                    <button
                        className={activeTab === 'perfil' ? 'active' : ''}
                        onClick={() => setActiveTab('perfil')}
                    >
                        Mi perfil
                    </button>
                    <button
                        className={activeTab === 'publicaciones' ? 'active' : ''}
                        onClick={() => setActiveTab('publicaciones')}
                    >
                        Mis publicaciónes
                    </button>
                </div>
            </div>

            {/* Contenedor de contenidos: en escritorio se muestran ambos; en móvil se muestra el activo */}
            <div className="miPerfil-content">
                <div className={`miPerfil-left-content ${activeTab === 'perfil' ? 'active' : ''}`}>
                    {/* Sección Descripción */}
                    <section className="miPerfil-section">
                        <h2>Descripción</h2>
                        <p>
                            Con amplia experiencia en diseño de moda, sostenibilidad, tendencias
                            y creatividad. Apasionada por fusionar el periodismo con la dirección
                            creativa para generar propuestas innovadoras y responsables.
                        </p>
                    </section>

                    {/* Experiencia profesional */}
                    <section className="miPerfil-section">
                        <h2>Experiencia profesional</h2>
                        <ul className="miPerfil-list">
                            <li>
                                <strong>Feb 2023 – Abr 2024</strong>
                                <p>
                                    Prácticas como asistente de diseño en “Marca X” (participación en
                                    colecciones primavera-verano y contacto con proveedores).
                                </p>
                            </li>
                            <li>
                                <strong>Feb 2021 – Ene 2024</strong>
                                <p>
                                    Proyecto propio “Marca personal” (desarrollo de una colección
                                    cápsula sostenible).
                                </p>
                            </li>
                        </ul>
                    </section>

                    {/* Habilidades */}
                    <section className="miPerfil-section">
                        <h2>Habilidades</h2>
                        <div className="miPerfil-chips">
                            <span className="miPerfil-chip">Colección cápsula</span>
                            <span className="miPerfil-chip">Ilustración de moda</span>
                            <span className="miPerfil-chip">Branding</span>
                            <span className="miPerfil-chip">Marketing</span>
                            <span className="miPerfil-chip">Diseño gráfico</span>
                            <span className="miPerfil-chip">Patronaje industrial</span>
                            <span className="miPerfil-chip">Maquillaje</span>
                        </div>
                    </section>

                    {/* Software */}
                    <section className="miPerfil-section">
                        <h2>Software</h2>
                        <div className="miPerfil-chips">
                            <span className="miPerfil-chip">InDesign</span>
                            <span className="miPerfil-chip">Photoshop</span>
                            <span className="miPerfil-chip">Illustrator</span>
                            <span className="miPerfil-chip">Canva</span>
                            <span className="miPerfil-chip">Lectra</span>
                            <span className="miPerfil-chip">Gerber</span>
                            <span className="miPerfil-chip">Procreate</span>
                        </div>
                    </section>

                    {/* Formación educativa */}
                    <section className="miPerfil-section">
                        <h2>Formación educativa</h2>
                        <ul className="miPerfil-list">
                            <li>
                                <strong>Feb 2023 – Ene 2024</strong>
                                <p>
                                    Grado Superior Patronaje y diseño de moda en “Barrio Arte + Diseño”.
                                </p>
                            </li>
                            <li>
                                <strong>Sept 2021 – 2023</strong>
                                <p>
                                    Máster en estilismo y dirección creativa en “Escuela Arts San Telmo”.
                                </p>
                            </li>
                        </ul>
                    </section>

                    {/* Redes sociales */}
                    <section className="miPerfil-section miPerfil-social">
                        <h2>Redes sociales</h2>
                        <div className="miPerfil-social-links">
                            <a
                                href="https://www.linkedin.com/in/daniela-gomez"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaLinkedin size={24} />
                            </a>
                            <a
                                href="https://www.instagram.com/daniela_gomez"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaInstagram size={24} />
                            </a>
                        </div>
                    </section>

                    {/* Archivos descargables */}
                    <section className="miPerfil-section">
                        <h2>Archivos descargables</h2>
                        <div className="miPerfil-downloads">
                            <a href="/ruta/a/CV.pdf" download className="miPerfil-btn">
                                CV en PDF
                            </a>
                            <a href="/ruta/a/Portfolio.pdf" download className="miPerfil-btn">
                                Portfolio en PDF
                            </a>
                        </div>
                        <button className="miPerfil-btn miPerfil-view-btn">
                            Visualizar página PDF
                        </button>
                    </section>
                </div>

                <div className={`miPerfil-right ${activeTab === 'publicaciones' ? 'active' : ''}`}>
                    {/* Controles para alternar la vista de proyectos */}
                    <div
                        className="miPerfil-projects-controls"
                        style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}
                    >
                        <button onClick={toggleView} className="toggle-view-btn">
                            {isGalleryView ? <FaList size={20} /> : <FaTh size={20} />}
                        </button>
                    </div>

                    {/* Contenedor de proyectos: se aplican clases según el estado */}
                    <div
                        className={`miPerfil-projects-grid ${isGalleryView ? 'gallery' : 'individual'}`}
                    >
                        {[...Array(15)].map((_, index) => (
                            <div key={index} className="miPerfil-project-placeholder">
                                {/* Placeholder para proyecto */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;
