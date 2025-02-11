import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="wrapper">
                <div className="footer-left">
                    <div className="logo">
                        <img src="/multimedia/st-isotipo-temporal.png" alt="Student Station Logo" />
                    </div>
                    <div className="social-icons">
                        <img src="/multimedia/instagram.png" alt="Instagram" />
                        <img src="/multimedia/youtube.png" alt="YouTube" />
                    </div>
                </div>

                <div className="footer-center">
                    <h3>Menú</h3>
                    <ul>
                        <li><a href="#">Explorar</a></li>
                        <li><a href="#">Encuentra diseñadores</a></li>
                        <li><a href="#">Estudiar moda</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contacto</a></li>
                    </ul>
                </div>

                <div className="footer-right">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="#">Aviso legal</a></li>
                        <li><a href="#">Política de cookies</a></li>
                        <li><a href="#">Política de privacidad</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
