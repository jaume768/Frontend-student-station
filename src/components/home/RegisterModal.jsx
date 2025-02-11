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

    // Estado para almacenar errores de validación locales y de disponibilidad
    const [errors, setErrors] = useState({
        passwordMismatch: '',
        incomplete: '',
        username: '',
        email: '',
    });

    const [backendError, setBackendError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        // Limpiamos los errores al escribir
        setErrors({
            passwordMismatch: '',
            incomplete: '',
            username: '',
            email: '',
        });
        setBackendError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({
            passwordMismatch: '',
            incomplete: '',
            username: '',
            email: '',
        });
        setBackendError('');
        setSuccessMessage('');

        if (
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.acceptedTerms
        ) {
            setErrors(prev => ({
                ...prev,
                incomplete: 'Completa todos los campos para continuar',
            }));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                passwordMismatch: 'Las contraseñas no coinciden',
            }));
            return;
        }

        try {
            const availabilityResponse = await fetch('http://localhost:5000/api/users/check-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                }),
            });

            const availabilityData = await availabilityResponse.json();

            if (!availabilityResponse.ok) {
                setErrors(prev => ({
                    ...prev,
                    username: availabilityData.errors?.username || '',
                    email: availabilityData.errors?.email || '',
                }));
                return;
            }

            setSuccessMessage('¡Registro exitoso!');

        } catch (error) {
            console.log(error);
            setBackendError('Error al verificar disponibilidad. Inténtalo de nuevo.');
            return;
        }
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
                                {errors.username && (
                                    <p className="error-message">{errors.username}</p>
                                )}
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
                                {errors.email && (
                                    <p className="error-message">{errors.email}</p>
                                )}
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
                                {errors.passwordMismatch && (
                                    <p className="error-message">{errors.passwordMismatch}</p>
                                )}
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
                                {errors.incomplete && (
                                    <p className="error-message">{errors.incomplete}</p>
                                )}
                            </div>
                            {backendError && (
                                <p className="error-message">{backendError}</p>
                            )}
                            {successMessage && (
                                <p className="success-message">{successMessage}</p>
                            )}
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