import React from 'react';
import { FaDownload, FaFilePdf } from 'react-icons/fa';

const UserDownloadableFilesSection = ({ cvUrl, portfolioUrl }) => {
    return (
        <section className="user-extern-section">
            <h2>Archivos descargables</h2>
            <div className="user-extern-files-container">
                {cvUrl ? (
                    <a 
                        href={cvUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="user-extern-file-button"
                    >
                        <FaFilePdf className="user-extern-file-icon" />
                        Visualizar PDF
                    </a>
                ) : (
                    <button 
                        className="user-extern-file-button" 
                        disabled
                        title="El usuario no ha subido su CV"
                    >
                        <FaFilePdf className="user-extern-file-icon" />
                        CV en PDF
                    </button>
                )}
                
                {portfolioUrl ? (
                    <a 
                        href={portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="user-extern-file-button"
                    >
                        <FaFilePdf className="user-extern-file-icon" />
                        Portfolio
                    </a>
                ) : (
                    <button 
                        className="user-extern-file-button" 
                        disabled
                        title="El usuario no ha subido su portafolio"
                    >
                        <FaFilePdf className="user-extern-file-icon" />
                        Portfolio
                    </button>
                )}
            </div>
        </section>
    );
};

export default UserDownloadableFilesSection;
