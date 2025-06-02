import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteAccountModal from './DeleteAccountModal';

const ConfigurationSection = ({
    userData,
    isEmailEditing,
    setIsEmailEditing,
    emailInput,
    setEmailInput,
    newEmail,
    setNewEmail,
    confirmEmail,
    setConfirmEmail,
    isPasswordEditing,
    setIsPasswordEditing,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleChangePassword,
    handleUpdateEmail
}) => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            const token = localStorage.getItem('authToken');
            if (!token) return;
            
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.delete(`${backendUrl}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Cerrar sesión
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            
            // Redirigir al inicio
            navigate('/');
        } catch (error) {
            console.error('Error al eliminar la cuenta:', error);
            alert('Ha ocurrido un error al eliminar la cuenta. Por favor, inténtalo de nuevo.');
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    // Handler para cerrar sesión
    const handleLogout = () => {
        // Eliminar token de autenticación y rol
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        // Redirigir a la página principal
        navigate('/');
    };

    return (
        <div className="configuration-section">
            <h2>Configuración de la cuenta</h2>
            <section className="form-section">
                <div className="section-header-edit">
                    <h3>Contraseña</h3>
                </div>
                <div className="section-content">
                    {!isPasswordEditing ? (
                        <div className="password-display">
                            <p>********</p>
                            <div className="button-row">
                                <button
                                    type="button"
                                    className="edit-password-button edit-data-button"
                                    onClick={() => setIsPasswordEditing(true)}
                                >
                                    Cambiar contraseña
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="password-edit-form">
                            {!userData.googleId && (
                                <div className="form-group-edit">
                                    <label>Contraseña actual</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Introduce tu contraseña actual"
                                    />
                                </div>
                            )}
                            <div className="form-group-edit">
                                <label>Nueva contraseña</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Introduce tu nueva contraseña"
                                />
                            </div>
                            <div className="form-group-edit">
                                <label>Confirmar nueva contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirma tu nueva contraseña"
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <div className="password-edit-actions">
                                <button
                                    type="button"
                                    className="save-password-button edit-data-button save-mode"
                                    onClick={handleChangePassword}
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="cancel-password-edit-button edit-data-button"
                                    onClick={() => {
                                        setIsPasswordEditing(false);
                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                        // setError("");
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="form-section">
                <div className="section-header-edit">
                    <h3>Cerrar sesión</h3>
                </div>
                <div className="section-content">
                    <div className="button-row">
                        <button
                            type="button"
                            className="logout-button edit-data-button"
                            onClick={handleLogout}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </section>

            <section className="form-section-final">
                <div className="section-header-edit">
                    <h3>Eliminar cuenta</h3>
                </div>
                <div className="section-content">
                    <div className="delete-account-warning">
                        <p>
                            Al eliminar tu cuenta, todos tus datos personales, publicaciones y ofertas serán eliminados permanentemente.
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="button-row">
                            <button 
                                type="button" 
                                className="delete-account-button edit-data-button"
                                onClick={() => setIsDeleteModalOpen(true)}
                            >
                                Eliminar mi cuenta
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <DeleteAccountModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </div>
    );
};

export default ConfigurationSection;
