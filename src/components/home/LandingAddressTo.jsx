import React from 'react';

const LandingAddressTo = () => {
  return (
    <section className="landing-adress-to">
      <h2 className="landing-h2">¿A quién va dirigido?</h2>
      <div className="landing-grid">
        <div className="landing-card">
          <img src="/multimedia/graduados.png" alt="Graduados y estudiantes" />
          <h3 className="landing-h3">Graduados y estudiantes</h3>
          <p>Diseña tu portafolio sin conocimientos técnicos. Edita tu CV y encuentra oportunidades laborales en la industria.</p>
        </div>
        <div className="landing-card">
          <img src="/multimedia/empresas.png" alt="Empresas y reclutadores" />
          <h3 className="landing-h3">Empresas y reclutadores</h3>
          <p>Descubrir y filtrar el talento nunca fue tan fácil. Ten acceso a currículums claros y portafolios organizados. Olvida los portfolios infinitos y descargas de 100MB.</p>
        </div>
        <div className="landing-card">
          <img src="/multimedia/institucion.png" alt="Instituciones educativas" />
          <h3 className="landing-h3">Instituciones educativas</h3>
          <p>Conecta con futuros estudiantes. Da visibilidad a tu alumnado y mantén vivo el vínculo con tus graduados, aunque cambien de ciudad (y de email).</p>
        </div>
      </div>
    </section>
  );
};

export default LandingAddressTo;
