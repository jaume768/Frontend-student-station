import React from 'react';
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
        <section className="form-section-final">
            <div className="section-header-edit">
                <h3>CV y Portfolio</h3>
            </div>
            <div className="section-content">
                <div className="pdf-section-intro">
                    <p>Sube tu CV y portfolio en formato PDF para que los reclutadores puedan conocer mejor tu trabajo.</p>
                    {isPdfEditing ? (
                        <div className="pdf-upload-actions">
                            <button 
                                type="button" 
                                className="save-pdf-button edit-data-button save-mode"
                                onClick={uploadPdfFiles}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Subiendo...' : 'Guardar archivos'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-pdf-edit-button edit-data-button"
                                onClick={() => setIsPdfEditing(false)}
                                disabled={isUploading}
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button 
                            type="button" 
                            className="edit-pdf-button edit-data-button"
                            onClick={() => setIsPdfEditing(true)}
                        >
                            {(userData.cvUrl || userData.portfolioUrl) ? 'Cambiar archivos' : 'Subir archivos'}
                        </button>
                    )}
                </div>
                {(userData.cvUrl || userData.portfolioUrl) && !isPdfEditing ? 
                    <div className="current-pdf-files">
                        <h4>Archivos actuales</h4>
                        {userData.cvUrl && (
                            <a 
                                href={userData.cvUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="view-pdf-link"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                Descargar CV actual
                            </a>
                        )}
                        {userData.portfolioUrl && (
                            <a 
                                href={userData.portfolioUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="view-pdf-link"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                Ver Portfolio actual
                            </a>
                        )}
                    </div> : null
                }
                <div className="pdf-upload-container">
                    <div className="form-group pdf-upload-group">
                        <label>CV (PDF)</label>
                        <div className={`pdf-file-input ${isPdfEditing ? 'active' : ''}`}>
                            <input 
                                type="file" 
                                id="cv-file"
                                name="cv" 
                                accept="application/pdf" 
                                onChange={handleFileChange}
                                disabled={!isPdfEditing}
                            />
                            <label htmlFor="cv-file" className="pdf-file-label">
                                <span className="pdf-upload-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h3l-4 4-4-4h3z"/>
                                    </svg>
                                </span>
                                <span className="pdf-upload-text">
                                    {cvFileName ? 'Cambiar archivo' : 'Seleccionar CV'}
                                </span>
                            </label>
                            {cvFileName && (
                                <div className="pdf-file-name">
                                    <span className="pdf-file-icon">📄</span>
                                    {cvFileName}
                                    {isPdfEditing && (
                                        <button 
                                            type="button" 
                                            className="pdf-clear-file" 
                                            onClick={(e) => {
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
                        <small className="info-text">Formato: PDF • Tamaño máximo: 10MB</small>
                    </div>

                    <div className="form-group pdf-upload-group">
                        <label>Portfolio (PDF)</label>
                        <div className={`pdf-file-input ${isPdfEditing ? 'active' : ''}`}>
                            <input 
                                type="file" 
                                id="portfolio-file"
                                name="portfolio" 
                                accept="application/pdf" 
                                onChange={handleFileChange}
                                disabled={!isPdfEditing}
                            />
                            <label htmlFor="portfolio-file" className="pdf-file-label">
                                <span className="pdf-upload-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h3l-4 4-4-4h3z"/>
                                    </svg>
                                </span>
                                <span className="pdf-upload-text">
                                    {portfolioFileName ? 'Cambiar archivo' : 'Seleccionar Portfolio'}
                                </span>
                            </label>
                            {portfolioFileName && (
                                <div className="pdf-file-name">
                                    <span className="pdf-file-icon">📄</span>
                                    {portfolioFileName}
                                    {isPdfEditing && (
                                        <button 
                                            type="button" 
                                            className="pdf-clear-file" 
                                            onClick={(e) => {
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
                        <small className="info-text">Formato: PDF • Tamaño máximo: 10MB</small>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PDFUploadSection;
