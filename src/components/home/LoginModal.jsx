import React, { useState } from 'react';
import './css/login-modal.css';

import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose, onSwitchToRegister, onSwitchToReset }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();



    const handleLogin = async (e) => {
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
                if (data.user && data.user.professionalType !== undefined) {
                    localStorage.setItem('professionalType', data.user.professionalType);
                }
                navigate('/explorer');
            } else {
                setError(data.message || 'Error en el inicio de sesión');
            }
        } catch (err) {
            setError('Error de red, inténtalo nuevamente.');
        }
    };

    const handleGoogleLogin = () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        window.location.href = `${backendUrl}/api/auth/google`;
    };

    return (
        <div className="login-modal">
            <a
                href="#"
                className="back-link"
                onClick={(e) => {
                    e.preventDefault();
                    onClose();
                }}
                style={{
                    color: '#333',
                    marginTop: '-2px',
                    border: 'solid 1px grey',
                    background: 'white',
                    padding: '6px 12px',
                    position: 'fixed',
                    top: '24px',
                    left: '24px',
                    zIndex: '1',
                    textDecoration: 'none',
                    borderRadius: '16px'
                }}
            >
                ← Volver al inicio
            </a>
            <div className={`login-card ${error ? 'with-error' : ''}`}>
                <h1>Inicio de sesión</h1>
                {error && <p className="error">{error}</p>}
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

                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Introduce tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
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

                <button className="btn google-btn" onClick={handleGoogleLogin}>
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
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
