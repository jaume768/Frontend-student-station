import React, { useState } from 'react';
import './css/login-modal.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginModal = ({ onClose }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-modal">
            <div className="login-card">
                <h1>Inicio de sesión</h1>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Introduce tu email"
                    />
                </div>

                <div className="input-group password-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Introduce tu contraseña"
                    />
                    <span className="toggle-password" onClick={togglePassword}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <a href="#" className="forgot-link">¿Has olvidado tu contraseña?</a>

                <button className="btn login-btn">Iniciar sesión</button>

                <button className="btn google-btn">
                    Continuar con Google
                </button>

                <div className="extra-links">
                    <p>¿No tienes cuenta? <a href="#">Regístrate</a></p>
                    <a
                        href="#"
                        className="back-link"
                        onClick={(e) => {
                            e.preventDefault();
                            onClose();
                        }}
                    >
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
