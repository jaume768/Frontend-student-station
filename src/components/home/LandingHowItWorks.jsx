import React, { useState } from 'react';

const LandingHowItWorks = ({ onRegisterClick }) => {
  const [activeProfile, setActiveProfile] = useState(null);

  const handleProfileChange = (profile) => {
    if (activeProfile === profile) {
      setActiveProfile(null);
    } else {
      setActiveProfile(profile);
    }
  };

  return (
    <section className="landing-how-it-works">
      <h2 className="landing-h2">¿Cómo funciona?</h2>

      <div className="landing-chooseprofile">
        <h3 className="landing-h3">Elige tu perfil</h3>
      </div>

      <div className="landing-profile-button">
        <button 
          data-tipo="creativos" 
          className={activeProfile === "creativos" ? "activo" : ""}
          onClick={() => handleProfileChange("creativos")}
        >
          🎨 Creativo
        </button>
        <button 
          data-tipo="empresa" 
          className={activeProfile === "empresa" ? "activo" : ""}
          onClick={() => handleProfileChange("empresa")}
        >
          🏢 Empresa
        </button>
        <button 
          data-tipo="institucion" 
          className={activeProfile === "institucion" ? "activo" : ""}
          onClick={() => handleProfileChange("institucion")}
        >
          🏫 Institución
        </button>
      </div>

      {/* Steps for all profiles */}
      <div className={`landing-step ${activeProfile ? "visible" : ""}`}>
        {activeProfile === "creativos" && (
          <>
            <div className="landing-steps-gif">
              <img className="landing-step-gif" src="/multimedia/creatives.gif" alt="Paso 1" />
              <span>1</span>
              <h4>Accede</h4>
              <p>Regístrate y añade una foto de perfil.</p>
            </div>

            <div className="landing-steps-gif">
              <img className="landing-step-gif" src="/multimedia/creatives-2.gif" alt="Paso 2" />
              <span>2</span>
              <h4>Edita tu perfil</h4>
              <p>Completa tu perfil profesional. <br/> Edita tu CV y añade contenido a tu portfolio.</p>
            </div>

            <div className="landing-steps-gif">
              <img className="landing-step-gif" src="/multimedia/creatives-3.gif" alt="Paso 3" />
              <span>3</span>
              <h4>¡Listo!</h4>
              <p>Descubre creativos. Conecta con ofertas de empleo, prácticas y formación educativa.</p>
            </div>
          </>
        )}

        {activeProfile === "empresa" && (
          <>
            <div className="landing-steps-gif">
              <img className="landing-step-gif" src="/multimedia/creatives.gif" alt="Paso 1" />
              <span>1</span>
              <h4>Registra tu empresa</h4>
              <p>Regístrate y añade el logo de tu empresa.</p>
            </div>

            <div className="landing-steps-gif">
              <img className="landing-step-gif" src="/multimedia/creatives-2.gif" alt="Paso 2" />
              <span>2</span>
              <h4>Publica ofertas de empleo</h4>
              <p>Edita tu perfil y empieza a publicar ofertas <br/> de empleo o prácticas. Revisa tus candidatos.</p>
            </div>

            <div className="landing-steps-gif">
              <img className="landing-step-gif" src="/multimedia/creatives-3.gif" alt="Paso 3" />
              <span>3</span>
              <h4>Encuentra talento</h4>
              <p>¿Buscas algo concreto? Utiliza los filtros para encontrar creativos que se adapten a tus necesidades.</p>
            </div>
          </>
        )}

        {activeProfile === "institucion" && (
          <>
            <div className="landing-steps-gif">
              <img className="landing-step-gif" src="/multimedia/creatives.gif" alt="Paso 1" />
              <span>1</span>
              <h4>Registra tu institución</h4>
              <p>Regístrate y añade el logo de tu institución.</p>
            </div>

            <div className="landing-steps-gif">
              <img className="landing-step-gif" src="/multimedia/creatives-2.gif" alt="Paso 2" />
              <span>2</span>
              <h4>Publica tu oferta educativa</h4>
              <p>Edita tu perfil y empieza a publicar tu oferta educativa a la comunidad creativa.</p>
            </div>

            <div className="landing-steps-gif">
              <img className="landing-step-gif" src="/multimedia/creatives-3.gif" alt="Paso 3" />
              <span>3</span>
              <h4>Comunidad alumni</h4>
              <p>Sigue a tus alumni y descubre sus recorridos profesionales.</p>
            </div>
          </>
        )}
      </div>

      {/* Content for Creativos */}
      {activeProfile === "creativos" && (
        <section className="landing-foryou">
          <h2 className="landing-h2">Tu salto al mundo profesional</h2>
          <div className="landing-grid">
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/estrella.svg" alt="Icono estrella" />
              Destaca frente a las empresas por a la calidad de tus proyectos.
            </div>
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/diana.svg" alt="Icono diana" />
              Olvídate del diseño gráfico. Céntrate en proyectar tu talento.
            </div>
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/avion.svg" alt="Icono avión" />
              Comparte tu CV y portfolio con un solo enlace.
            </div>
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/lupa.svg" alt="Icono lupa" />
              Filtra las ofertas laborales según tus preferencias.
            </div>
          </div>

          <a 
            href="#" 
            className="landing-btn landing-registro"
            onClick={(e) => {
              e.preventDefault();
              onRegisterClick();
            }}
          >
            Quiero crear mi perfil
          </a>
        </section>
      )}

      {/* Content for Empresas */}
      {activeProfile === "empresa" && (
        <section className="landing-foryou">
          <h2 className="landing-h2">Conecta con el talento emergente</h2>
          <div className="landing-grid">
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/anuncio.svg" alt="Icono anuncio" />
              Publica ofertas de trabajo y prácticas directamente a la comunidad creativa.
            </div>
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/carpeta.svg" alt="Icono carpeta" />
              Revisa currículums y portafolios de candidatos en un solo lugar.
            </div>
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/lupa.svg" alt="Icono lupa" />
              Filtra perfiles con herramientas inteligentes y encuentra al talento ideal.
            </div>
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/estrella.svg" alt="Icono estrella" />
              Descubre el mejor talento emergente, listo para ser contratado.
            </div>
          </div>

          <a 
            href="#" 
            className="landing-btn landing-registro"
            onClick={(e) => {
              e.preventDefault();
              onRegisterClick();
            }}
          >
            Quiero registrar mi empresa
          </a>
        </section>
      )}

      {/* Content for Institución */}
      {activeProfile === "institucion" && (
        <section className="landing-foryou">
          <h2 className="landing-h2">Impulsa el futuro de tus alumnos</h2>
          <div className="landing-grid">
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/birrete.svg" alt="Icono birrete" />
              Da a conocer tu oferta educativa a la comunidad creativa.
            </div>
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/lupa.svg" alt="Icono lupa" />
              Conoce las necesidades reales del mercado laboral.
            </div>
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/estrella.svg" alt="Icono estrella" />
              Ayuda a potenciar el perfil profesional de tus estudiantes.
            </div>
            <div className="landing-step-card">
              <img className="landing-step-icon" src="/multimedia/alumni.svg" alt="Icono alumni" />
              Construye tu comunidad de alumni.
            </div>
          </div>

          <a 
            href="#" 
            className="landing-btn landing-registro"
            onClick={(e) => {
              e.preventDefault();
              onRegisterClick();
            }}
          >
            Publicar mi oferta educativa
          </a>
        </section>
      )}
    </section>
  );
};

export default LandingHowItWorks;
