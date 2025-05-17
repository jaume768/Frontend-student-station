import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EditButton from './EditButton';

const PDFUploadSection = ({
    isPdfEditing,
    setIsPdfEditing,
    cvFileName,
    portfolioFileName,
    handleFileChange,
    uploadPdfFiles,
    isUploading,
    userData,
    setCvFile,
    setCvFileName,
    setPortfolioFile,
    setPortfolioFileName
}) => {
    return (
        <section className="form-section pdf-upload-section">
            <div className="section-header-edit">
                <h3>Sube tus archivos</h3>
                <button type="button" className="collapse-toggle" onClick={() => setIsPdfEditing(!isPdfEditing)}>
                    {isPdfEditing ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>
            <div className="section-content">
                <div className="pdf-section-intro">
                    <p>¿Tienes tu CV o Portfolio en PDF? Súbelo y se mostrará en tu perfil.</p>
                </div>
                <div className="pdf-upload-container">
                    <div className="pdf-columns">
                        <div className="pdf-column">
                            <h4>CV</h4>
                            <div className={`upload-box ${isPdfEditing && !isUploading ? 'active' : ''}`}>
                                <input 
                                    type="file" 
                                    id="cv-file"
                                    name="cv" 
                                    accept="application/pdf" 
                                    onChange={handleFileChange}
                                    disabled={!isPdfEditing || isUploading}
                                    className="file-input-hidden"
                                />
                                <label htmlFor="cv-file" className="upload-area">
                                    <span>Sube un archivo</span>
                                </label>
                                {cvFileName && (
                                    <div className="selected-file">
                                        {cvFileName}
                                        {isPdfEditing && (
                                            <button 
                                                type="button" 
                                                className="remove-file-btn" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setCvFile(null);
                                                    setCvFileName('');
                                                }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="file-info">Formato: PDF • Tamaño máximo: 10MB</div>
                        </div>

                        <div className="pdf-column">
                            <h4>Portfolio</h4>
                            <div className={`upload-box ${isPdfEditing && !isUploading ? 'active' : ''}`}>
                                <input 
                                    type="file" 
                                    id="portfolio-file"
                                    name="portfolio" 
                                    accept="application/pdf" 
                                    onChange={handleFileChange}
                                    disabled={!isPdfEditing || isUploading}
                                    className="file-input-hidden"
                                />
                                <label htmlFor="portfolio-file" className="upload-area">
                                    <span>Sube un archivo</span>
                                </label>
                                {portfolioFileName && (
                                    <div className="selected-file">
                                        {portfolioFileName}
                                        {isPdfEditing && (
                                            <button 
                                                type="button" 
                                                className="remove-file-btn" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setPortfolioFile(null);
                                                    setPortfolioFileName('');
                                                }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="file-info">Formato: PDF • Tamaño máximo: 10MB</div>
                        </div>
                    </div>

                    {(userData.cvUrl || userData.portfolioUrl) && (
                        <div className="current-pdf-files">
                            {userData.cvUrl && (
                                <a 
                                    href={userData.cvUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="view-pdf-link"
                                >
                                    Ver CV actual
                                </a>
                            )}
                            {userData.portfolioUrl && (
                                <a 
                                    href={userData.portfolioUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="view-pdf-link"
                                >
                                    Ver Portfolio actual
                                </a>
                            )}
                        </div>
                    )}

                    <div className="button-container">
                        <EditButton
                            isEditing={isPdfEditing}
                            onClick={() => {
                                if (isPdfEditing) {
                                    if (cvFileName || portfolioFileName) {
                                        uploadPdfFiles();
                                    } else {
                                        setIsPdfEditing(false);
                                    }
                                } else {
                                    setIsPdfEditing(true);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PDFUploadSection;
