import React from 'react';

const ExtraQuestionsForm = ({ formData, setFormData }) => {
    // Añadir una nueva pregunta vacía
    const addQuestion = () => {
        if (!formData.extraQuestions) {
            setFormData(prev => ({
                ...prev,
                extraQuestions: [{
                    question: '',
                    responseType: 'text'
                }]
            }));
        } else if (formData.extraQuestions.length < 3) {
            setFormData(prev => ({
                ...prev,
                extraQuestions: [
                    ...prev.extraQuestions,
                    {
                        question: '',
                        responseType: 'text'
                    }
                ]
            }));
        }
    };

    // Eliminar una pregunta
    const removeQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            extraQuestions: prev.extraQuestions.filter((_, i) => i !== index)
        }));
    };

    // Actualizar una pregunta
    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...(formData.extraQuestions || [])];
        if (!updatedQuestions[index]) {
            updatedQuestions[index] = { question: '', responseType: 'text' };
        }
        updatedQuestions[index][field] = value;
        
        setFormData(prev => ({
            ...prev,
            extraQuestions: updatedQuestions
        }));
    };

    return (
        <div className="form-section">
            <h3 className="section-title">Preguntas extra</h3>
            <p className="section-description">
                ¿Te gustaría preguntar algo concreto a los candidatos que se interesen por tu oferta?
            </p>

            {formData.extraQuestions && formData.extraQuestions.length > 0 && (
                <div className="questions-list">
                    {formData.extraQuestions.map((question, index) => (
                        <div key={index} className="question-item">
                            <div className="question-header">
                                <h4>Pregunta {index + 1}</h4>
                                <button 
                                    type="button" 
                                    className="remove-question-btn"
                                    onClick={() => removeQuestion(index)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={question.question || ''}
                                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                    placeholder="Escribe aquí tu pregunta"
                                    className="question-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Selecciona el tipo de respuesta</label>
                                <select
                                    value={question.responseType || 'text'}
                                    onChange={(e) => updateQuestion(index, 'responseType', e.target.value)}
                                    className="question-select"
                                >
                                    <option value="text">Texto</option>
                                    <option value="number">Numérico</option>
                                    <option value="boolean">Sí/No - Verdadero/Falso</option>
                                    <option value="url">Enlace</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {(!formData.extraQuestions || formData.extraQuestions.length < 3) && (
                <button 
                    type="button" 
                    className="add-question-btn"
                    onClick={addQuestion}
                >
                    <i className="fas fa-plus"></i> Añadir pregunta
                </button>
            )}
        </div>
    );
};

export default ExtraQuestionsForm;
