import React from 'react';

const EditButton = ({ isEditing, onClick }) => (
    <button
        type="button"
        className={`edit-data-button ${isEditing ? "save-mode" : ""}`}
        onClick={onClick}
    >
        {isEditing ? "Guardar datos" : "Editar datos"}
    </button>
);

export default EditButton;
