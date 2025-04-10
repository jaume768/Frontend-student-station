import React from 'react';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="delete-account-modal">
                <div className="modal-header">
                    <h3>Elimina tu perfil</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <p className="warning-text">¿Estás seguro de que deseas continuar?</p>
                    <p className="warning-description">
                        Esta acción es permanente y no podrás recuperar tu información.
                    </p>
                    <div className="modal-actions">
                        <button 
                            className="cancel-button edit-data-button" 
                            onClick={onClose}
                        >
                            Volver al panel
                        </button>
                        <button 
                            className="confirm-button edit-data-button" 
                            onClick={onConfirm}
                        >
                            Borrar cuenta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
