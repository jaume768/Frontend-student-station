// Typewriter effect for landing page
export const initTypewriter = () => {
  const textElement = document.querySelector(".landing-typewriter_wrapper");
  const cursor = document.querySelector(".landing-typewriter_cursor");
  
  if (!textElement || !cursor) return;

  const frases = [
    "Muestra tu CV + Portfolio.",
    "Encuentra talento emergente.",
    "Accede a ofertas laborales",
    "Descubre tus próximas prácticas.",
    "Explora formación educativa.",
  ];

  let fraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentFrase = frases[fraseIndex];
    if (isDeleting) {
      textElement.textContent = currentFrase.substring(0, charIndex--);
      delay = 20;
    } else {
      textElement.textContent = currentFrase.substring(0, charIndex++);
      delay = 90;
    }

    if (!isDeleting && charIndex === currentFrase.length) {
      delay = 1200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      fraseIndex = (fraseIndex + 1) % frases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  // Start the typewriter effect
  type();
};

// Profile switching functionality
export const initProfileSwitcher = () => {
  let perfilActivo = null;

  const mostrarExplicacion = (tipo) => {
    const perfiles = ["creativos", "empresa", "institucion"];

    perfiles.forEach((id) => {
      const div = document.getElementById(`explicacion-${id}`);
      const btn = document.querySelector(`button[data-tipo="${id}"]`);
      
      if (!div || !btn) return;

      if (id === tipo) {
        if (perfilActivo === tipo) {
          div.classList.add("oculto");
          btn.classList.remove("activo");
          perfilActivo = null;
        } else {
          div.classList.remove("oculto");
          btn.classList.add("activo");
          perfilActivo = tipo;
        }
      } else {
        div.classList.add("oculto");
        btn.classList.remove("activo");
      }
    });
  };

  // Add click event listeners to profile buttons
  const buttons = document.querySelectorAll(".landing-profile-button button");
  buttons.forEach(button => {
    const tipo = button.getAttribute("data-tipo");
    if (tipo) {
      button.addEventListener("click", () => mostrarExplicacion(tipo));
    }
  });

  // Show creatives by default
  mostrarExplicacion("creativos");
};
