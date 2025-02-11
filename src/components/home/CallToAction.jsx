import React from 'react';

const CallToAction = ({ onLoginClick }) => {
    return (
        <div className='call-to-action'>
            <section className="inicio-sesion">
                <div className="logo-movil">
                    <img src="/multimedia/logo-completo.png" alt="Student Station Logo" />
                </div>
                <h1>El portal que te conecta con las nuevas generaciones de la moda</h1>
                <p>
                    Déjate descubrir por los profesionales de la industria y conecta con otros creativos.
                </p>
                <div className="botones">
                    <a href="#">Soy un creativo</a>
                    <a href="#">Soy una empresa</a>
                </div>
                <div className='boton-inicio-movil'>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        onLoginClick();
                    }}>
                        Inicio sesión
                    </a>
                </div>
                <a href="#" className="more">Saber más</a>
            </section>
        </div>
    );
};

export default CallToAction;