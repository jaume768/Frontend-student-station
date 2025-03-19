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
            <div className="create-options-content">
                <div 
                    className="create-option" 
                    onClick={() => handleOptionSelect('createPost')}
                >
                    <span>Subir una publicación</span>
                </div>
                
                {/* Mostrar opción de oferta de trabajo para tipos 1, 2, 3 y 5 */}
                {[1, 2, 3, 5].includes(professionalType) && (
                    <div 
                        className="create-option" 
                        onClick={() => handleOptionSelect('createOffer')}
                    >
                        <span>Crear oferta de trabajo</span>
                    </div>
                )}
                
                {/* Mostrar opción de oferta educativa para tipo 4 */}
                {professionalType === 4 && (
                    <div 
                        className="create-option" 
                        onClick={() => handleOptionSelect('createEducationalOffer')}
                    >
                        <span>Crear oferta educativa</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateOptionsModal;
