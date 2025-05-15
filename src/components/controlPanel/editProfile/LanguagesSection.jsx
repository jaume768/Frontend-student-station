import React from 'react';
import { FaChevronDown, FaChevronUp, FaTimes, FaPlus } from 'react-icons/fa';
import EditButton from './EditButton';

const LanguagesSection = ({
    isLanguagesCollapsed,
    setIsLanguagesCollapsed,
    isLanguagesEditing,
    setIsLanguagesEditing,
    languages,
    newLanguage,
    setNewLanguage,
    handleLanguageKeyDown,
    removeLanguage,
    popularLanguages,
    addPopularLanguage,
    updateProfileData
}) => {
    return (
        <section className="form-section">
            <div className="section-header-edit">
                <h3>Idiomas</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsLanguagesCollapsed(!isLanguagesCollapsed)}>
                    {isLanguagesCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>
            {!isLanguagesCollapsed && (
                <div className="section-content">
                    <p className="tag-instruction">
                        Agrega idiomas a tu perfil usando etiquetas.
                    </p>
                    
                    <div className="tags-input-container">
                        <div className="tags-container">
                            {Array.isArray(languages) && languages.map((language, index) => (
                                <div key={index} className="tag">
                                    {language}
                                    {isLanguagesEditing && (
                                        <button
                                            type="button"
                                            className="tag-remove"
                                            onClick={() => removeLanguage(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            {/* Input para añadir idiomas escribiendo */}
                            {isLanguagesEditing && languages.length < 5 && (
                                <input
                                    type="text"
                                    className="tag-input"
                                    placeholder="Escribe aquí."
                                    value={newLanguage}
                                    onChange={(e) => setNewLanguage(e.target.value)}
                                    onKeyDown={handleLanguageKeyDown}
                                    maxLength={50}
                                />
                            )}
                        </div>
                    </div>

                    <p className="tag-hint">
                        Presiona "Enter" al finalizar de escribir para añadir una etiqueta. Elimina haciendo clic en la X.
                    </p>
                    
                    {isLanguagesEditing && (
                        <>
                            {Array.isArray(languages) && languages.length < 5 && (
                                <div className="popular-tags-container">
                                    <h4>Idiomas populares</h4>
                                    <div className="popular-tags">
                                        {popularLanguages.map((language, index) => (
                                            <div
                                                key={index}
                                                className="popular-tag"
                                                onClick={() => addPopularLanguage(language)}
                                            >
                                                {language}
                                                <span className="add-tag"><FaPlus /></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    
                    <div className="button-container">
                        <EditButton
                            isEditing={isLanguagesEditing}
                            onClick={() => {
                                if (isLanguagesEditing) {
                                    updateProfileData();
                                }
                                setIsLanguagesEditing(!isLanguagesEditing);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default LanguagesSection;
