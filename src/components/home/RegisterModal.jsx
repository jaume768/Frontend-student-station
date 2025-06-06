import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './css/register-modal.css';

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState("register");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({
    passwordMismatch: '',
    incomplete: '',
    username: '',
    email: '',
  });
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Usamos un arreglo de 6 celdas para el código
  const [codeDigits, setCodeDigits] = useState(Array(6).fill(""));

  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Validar username en tiempo real
    if (name === 'username') {
      // Limpiar mensajes de error previos
      setErrors(prev => ({
        ...prev,
        username: '',
      }));
      
      // Validar espacios en el username
      if (value.includes(' ')) {
        setErrors(prev => ({
          ...prev,
          username: 'El nombre de usuario no puede contener espacios',
        }));
      }
      
      // Validar longitud máxima
      if (value.length > 20) {
        setErrors(prev => ({
          ...prev,
          username: 'El nombre de usuario debe tener máximo 20 caracteres',
        }));
      }
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // No limpiamos los errores de username si estamos editando el username
    if (name !== 'username') {
      setErrors({
        passwordMismatch: '',
        incomplete: '',
        username: errors.username, // Mantener el error de username si existe
        email: '',
      });
    }
    
    setBackendError('');
  };

  // Paso 1: Enviar datos para que se envíe el código (sin crear el usuario)
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

    // Validaciones básicas
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
    
    // Validar espacios en el username
    if (formData.username.includes(' ')) {
      setErrors(prev => ({
        ...prev,
        username: 'El nombre de usuario no puede contener espacios',
      }));
      return;
    }
    
    // Validar longitud máxima del username
    if (formData.username.length > 20) {
      setErrors(prev => ({
        ...prev,
        username: 'El nombre de usuario debe tener máximo 20 caracteres',
      }));
      return;
    }

    try {
      // Llamada al endpoint que envía el código sin crear el usuario
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/auth/send-verification-code-pre-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setBackendError(data.error || 'Error al enviar el código de verificación.');
        return;
      }
      // Si todo va bien, cambiamos al paso de verificación
      setStep("verify");
    } catch (error) {
      console.log(error);
      setBackendError('Error al conectar con el servidor.');
    }
  };

  // Función para manejar el cambio en cada celda del código
  const handleDigitChange = (e, index) => {
    const { value } = e.target;
    // Solo aceptamos un dígito (o borrar)
    if (/^\d?$/.test(value)) {
      const newCodeDigits = [...codeDigits];
      newCodeDigits[index] = value;
      setCodeDigits(newCodeDigits);
      // Si se ingresó un dígito y no es la última celda, enfoca la siguiente
      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`reg-code-digit-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
      // Si se borra y se quiere volver a la celda anterior (opcional)
      if (value === "" && index > 0) {
        const prevInput = document.getElementById(`reg-code-digit-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    }
  };

  // Función para manejar el pegado en la primera celda
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('Text');
    // Extraer solo los dígitos y limitar a 6
    const digits = pasteData.split('').filter(char => /\d/.test(char)).slice(0, 6);
    if (digits.length > 0) {
      setCodeDigits(digits);
      // Enfoca la siguiente celda después del último dígito pegado, si es necesario
      const nextInput = document.getElementById(`reg-code-digit-${Math.min(digits.length, 5)}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Paso 2: Verificar el código introducido por el usuario
  const handleVerify = async (e) => {
    e.preventDefault();
    setVerificationError('');
    setVerificationSuccess('');

    const code = codeDigits.join("");
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/auth/verify-code-pre-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code }),
      });
      const data = await response.json();
      if (!response.ok) {
        setVerificationError(data.error || 'Código incorrecto.');
        return;
      }
      setVerificationSuccess(data.message || '¡Código verificado exitosamente!');
      const { token, user } = data;

      localStorage.setItem("authToken", token);

      onClose();

      navigate("/complete-registration", { state: { username: formData.username } });
    } catch (err) {
      console.log(err);
      setVerificationError('Error de red.');
    }
  };

  // Reenvío del código de verificación
  const handleResend = async (e) => {
    e.preventDefault();
    setResendMessage('');
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/auth/resend-code-pre-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setVerificationError(data.error || 'Error al reenviar el código.');
        return;
      }
      setResendMessage(data.message || 'Código reenviado exitosamente.');
    } catch (error) {
      console.log(error);
      setVerificationError('Error de red.');
    }
  };

  return (
    // Clic en el overlay para cerrar el modal
    <div className="reg-modal-overlay" onClick={onClose}>
      {/* Evitamos que se cierre al hacer clic dentro del modal */}
      <div className="reg-modal" onClick={(e) => e.stopPropagation()}>
        <button className="reg-close-button" onClick={onClose}>
          <FaTimes size={28} />
        </button>
        <div className="reg-modal-content">
          <div className="reg-modal-image">
            <img src="/multimedia/foto-registro.webp" alt="Imagen de registro" />
            <p className="photo-autor-tag">Fotografía de <a href="https://www.instagram.com/manel.png" target="_blank" rel="noopener noreferrer">@manel.png</a></p>
          </div>
          <div className="reg-modal-form">
            {step === "register" ? (
              <>
                <h1>Registra tu email</h1>
                <form onSubmit={handleSubmit}>
                  <div className="reg-input-group">
                    <label htmlFor="username">Nombre de usuario (*)</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Máx. 20 caracteres, sin espacios"
                      value={formData.username}
                      onChange={handleChange}
                      className={errors.username ? 'error-input' : ''}
                      maxLength={20}
                      required
                    />
                    {errors.username && (
                      <p className="reg-error-message">{errors.username}</p>
                    )}
                  </div>
                  <div className="reg-input-group">
                    <label htmlFor="email">Email (*)</label>
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
                      <p className="reg-error-message">{errors.email}</p>
                    )}
                  </div>
                  <div className="reg-input-group">
                    <label htmlFor="password">Contraseña (*)</label>
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
                  <div className="reg-input-group">
                    <label htmlFor="confirmPassword">Repetir contraseña (*)</label>
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
                      <p className="reg-error-message">{errors.passwordMismatch}</p>
                    )}
                  </div>
                  
                  <div className="reg-input-group reg-checkbox-group">
                    <label className="reg-checkbox-label">
                      <input
                        type="checkbox"
                        name="acceptedTerms"
                        checked={formData.acceptedTerms}
                        onChange={handleChange}
                        required
                      />
                      Acepto los <a href="#" onClick={(e) => e.preventDefault()}> términos y condiciones</a>
                    </label>
                  </div>
                  
                  {errors.incomplete && (
                    <p className="reg-error-message">{errors.incomplete}</p>
                  )}
                  
                  {backendError && (
                    <p className="reg-error-message">{backendError}</p>
                  )}
                  {successMessage && (
                    <p className="reg-success-message">{successMessage}</p>
                  )}
                  <button 
                    type="submit" 
                    className="reg-btn reg-register-btn"
                  >
                    Registrarme
                  </button>
                  <button
                    type="button"
                    className="reg-btn reg-google-btn"
                    onClick={() => {
                      const backendUrl = import.meta.env.VITE_BACKEND_URL;
                      window.location.href = `${backendUrl}/api/auth/google`;
                    }}
                  >
                    Continuar con Google
                  </button>
                </form>
                <p className="reg-switch-login">
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
              </>
            ) : (
              <>
                <div className="reg-verification-content">
                  <h1>Código de verificación</h1>
                  <p className="reg-email-sent">
                    Se ha enviado un código al correo{' '}
                    <strong>{formData.email}</strong>
                  </p>
                  <form onSubmit={handleVerify}>
                    <div
                      className="reg-input-group reg-code-inputs"
                      style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexDirection: 'row' }}
                    >
                      {codeDigits.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength="1"
                          value={digit}
                          placeholder="-"
                          onChange={(e) => handleDigitChange(e, index)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          id={`reg-code-digit-${index}`}
                          className="reg-code-cell"
                          inputMode="numeric"
                        />
                      ))}
                    </div>
                    {verificationError && (
                      <p className="reg-error-message">{verificationError}</p>
                    )}
                    {verificationSuccess && (
                      <p className="reg-success-message">{verificationSuccess}</p>
                    )}
                    <p className="reg-resend-text">
                      ¿No has recibido el código?{' '}
                      <button className="reg-resend-button" onClick={handleResend}>
                        Reenviar
                      </button>
                    </p>
                    {resendMessage && (
                      <p className="reg-success-message">{resendMessage}</p>
                    )}
                    <button type="submit" className="reg-btn reg-verify-btn">
                      Verificar
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
