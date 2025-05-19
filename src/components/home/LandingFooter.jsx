import React from 'react';

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <p>© {currentYear} TheFolder. Todos los derechos reservados</p>
    </footer>
  );
};

export default LandingFooter;
