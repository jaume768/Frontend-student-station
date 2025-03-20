import React from 'react';

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
                            <button
                                type="button"
                                className="edit-password-button"
                                onClick={() => setIsPasswordEditing(true)}
                            >
                                Cambiar contraseña
                            </button>
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
                                    className="save-password-button"
                                    onClick={handleChangePassword}
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="cancel-password-edit-button"
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
                    <h3>Eliminar cuenta</h3>
                </div>
                <div className="section-content">
                    <div className="delete-account-warning">
                        <p>
                            Al eliminar tu cuenta, todos tus datos personales, publicaciones y ofertas serán eliminados permanentemente.
                            Esta acción no se puede deshacer.
                        </p>
                        <button type="button" className="delete-account-button">
                            Eliminar mi cuenta
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ConfigurationSection;
