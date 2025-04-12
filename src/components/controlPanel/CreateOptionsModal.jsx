import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CreateOptionsModal.css';

const CreateOptionsModal = ({ onClose, professionalType }) => {
    const navigate = useNavigate();

    const handleOptionSelect = (option) => {
        onClose();
        switch (option) {
            case 'createPost':
                navigate('/ControlPanel/createPost');
                break;
            case 'createOffer':
                navigate('/ControlPanel/createOffer');
                break;
            case 'createEducationalOffer':
                navigate('/ControlPanel/createEducationalOffer');
                break;
            default:
                break;
        }
    };

    return (
        <div className="create-options-modal">
            <ul className="create-options-content-ul">
                <li onClick={() => handleOptionSelect('createPost')}>Subir una publicación</li>
                
                {/* Mostrar opción de oferta de trabajo para tipos 1, 2, 3 y 5 */}
                {[1, 2, 3, 5].includes(professionalType) && (
                    <li onClick={() => handleOptionSelect('createOffer')}>Crear oferta de trabajo</li>
                )}
                
                {/* Mostrar opción de oferta educativa para tipo 4 */}
                {professionalType === 4 && (
                    <li onClick={() => handleOptionSelect('createEducationalOffer')}>Crear oferta educativa</li>
                )}
            </ul>
        </div>
    );
};

export default CreateOptionsModal;
