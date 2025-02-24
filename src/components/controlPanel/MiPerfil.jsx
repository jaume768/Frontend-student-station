import React from 'react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import './css/miPerfil.css';

const MiPerfil = () => {
    return (
        <div className="miPerfil-container">
            {/* Columna izquierda: información personal y datos */}
            <div className="miPerfil-left">
                {/* Encabezado con información personal */}
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
                            <strong>Feb 2023 – Abr 2024:</strong> Prácticas como asistente de
                            diseño en “Marca X” (participación en colecciones primavera-verano y
                            contacto con proveedores).
                        </li>
                        <li>
                            <strong>Feb 2021 – Ene 2024:</strong> Proyecto propio “Marca
                            personal” (desarrollo de una colección cápsula sostenible).
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
                            <strong>Feb 2023 – Ene 2024:</strong> Grado Superior Patronaje y
                            diseño de moda en “Barrio Arte + Diseño”.
                        </li>
                        <li>
                            <strong>Sept 2021 – 2023:</strong> Máster en estilismo y dirección
                            creativa en “Escuela Arts San Telmo”.
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
                            <FaLinkedin />
                        </a>
                        <a
                            href="https://www.instagram.com/daniela_gomez"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagram />
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

            {/* Columna derecha: grid de proyectos */}
            <div className="miPerfil-right">
                <div className="miPerfil-projects-grid">
                    {[...Array(12)].map((_, index) => (
                        <div key={index} className="miPerfil-project-placeholder">
                            {/* Placeholder para proyecto */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;
