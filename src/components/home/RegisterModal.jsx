import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './css/register-modal.css';

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="register-modal-overlay">
            <div className="register-modal">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="modal-content">
                    <div className="modal-image">
                        <img
                            src="/multimedia/foto-registro.png"
                            alt="Imagen de registro"
                        />
                    </div>

                    <div className="modal-form">
                        <h1>Registro</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="username">Nombre de usuario *</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Introduce tu nombre de usuario"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Introduce tu email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Contraseña *</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Introduce tu contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="confirmPassword">Repetir contraseña *</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Repite tu contraseña"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="acceptedTerms"
                                    checked={formData.acceptedTerms}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="terms">
                                    Acepto haber leído los{' '}
                                    <a href="#">Términos y condiciones</a> y la{' '}
                                    <a href="#">Política de privacidad</a>.
                                </label>
                            </div>

                            <button type="submit" className="btn register-btn">
                                Registrarse
                            </button>
                            <button type="button" className="btn google-btn">
                                Continuar con Google
                            </button>
                        </form>
                        <p className="switch-login">
                            ¿Ya tienes cuenta?{' '}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSwitchToLogin();
                                }}
                            >
                                Acede
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;