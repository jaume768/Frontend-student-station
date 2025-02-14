import React, { useState } from 'react';
import './css/login-modal.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose, onSwitchToRegister, onSwitchToReset }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        // Si se invoca mediante onSubmit, evitamos el comportamiento por defecto del formulario.
        if (e) e.preventDefault();
        setError('');
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Error en el inicio de sesión');
            }
        } catch (err) {
            setError('Error de red, inténtalo nuevamente.');
        }
    };

    return (
        <div className="login-modal">
            <div className={`login-card ${error ? 'with-error' : ''}`}>
                <h1>Inicio de sesión</h1>
                {error && <p className="error">{error}</p>}
                {/* Envolvemos los inputs en un formulario para que al presionar Enter se envíe */}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Introduce tu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group password-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Introduce tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="toggle-password" onClick={togglePassword}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <a
                        href="#"
                        className="forgot-link"
                        onClick={(e) => {
                            e.preventDefault();
                            onSwitchToReset();
                        }}
                    >
                        ¿Has olvidado tu contraseña?
                    </a>

                    <button className="btn login-btn" type="submit">
                        Iniciar sesión
                    </button>
                </form>

                <button className="btn google-btn">
                    Continuar con Google
                </button>

                <div className="extra-links">
                    <p>
                        ¿No tienes cuenta?{' '}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onSwitchToRegister();
                            }}
                        >
                            Regístrate
                        </a>
                    </p>
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
