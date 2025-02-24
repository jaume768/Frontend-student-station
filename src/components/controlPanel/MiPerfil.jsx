import React, { useState } from 'react';
import { FaTh, FaList } from 'react-icons/fa';
import './css/miPerfil.css';

const MiPerfil = () => {
    const [isGalleryView, setIsGalleryView] = useState(true);

    const toggleView = () => {
        setIsGalleryView((prev) => !prev);
    };

    return (
        <div className="miPerfil-container">
            <div className="miPerfil-left">
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
                            {/* Icono de LinkedIn */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 0h-14c-2.761 0-5 2.238-5 5v14c0 2.761 2.239 5 5 5h14c2.762 
                                0 5-2.239 5-5v-14c0-2.762-2.238-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.285c-.966 
                                0-1.75-.786-1.75-1.75s.784-1.75 1.75-1.75 1.75.786 1.75 1.75-.784 1.75-1.75 
                                1.75zm13.5 10.285h-3v-4.5c0-1.071-.021-2.451-1.5-2.451-1.5 0-1.732 1.171-1.732 
                                2.377v4.574h-3v-9h2.879v1.233h.041c.401-.76 1.379-1.562 2.838-1.562 3.034 0 3.597 1.997 3.597 4.594v4.735z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.instagram.com/daniela_gomez"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {/* Icono de Instagram */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.326 3.608 1.3.975.975 1.238 2.242 1.3 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.326 2.633-1.3 3.608-.975.975-2.242 1.238-3.608 1.3-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.326-3.608-1.3-.975-.975-1.238-2.242-1.3-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.062-1.366.326-2.633 1.3-3.608.975-.975 2.242-1.238 3.608-1.3 1.265-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.012-4.947.072-1.281.06-2.592.35-3.608 1.367-1.016 1.016-1.307 2.327-1.367 3.608-.06 1.28-.072 1.688-.072 4.947s.012 3.667.072 4.947c.06 1.281.35 2.592 1.367 3.608 1.016 1.016 2.327 1.307 3.608 1.367 1.28.06 1.688.072 4.947.072s3.667-.012 4.947-.072c1.281-.06 2.592-.35 3.608-1.367 1.016-1.016 1.307-2.327 1.367-3.608.06-1.28.072-1.688.072-4.947s-.012-3.667-.072-4.947c-.06-1.281-.35-2.592-1.367-3.608-1.016-1.016-2.327-1.307-3.608-1.367-1.28-.06-1.688-.072-4.947-.072z" />
                                <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998z" />
                                <circle cx="18.406" cy="5.594" r="1.44" />
                            </svg>
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
                {/* Controles para alternar la vista */}
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
