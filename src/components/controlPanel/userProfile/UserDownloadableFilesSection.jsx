import React from 'react';
import { FaFilePdf } from 'react-icons/fa';

const UserDownloadableFilesSection = ({ cvUrl, portfolioUrl }) => {
    return (
        <section className="user-extern-section">
            <h2>Archivos descargables</h2>
            <div className="user-extern-downloads">
                <div className="pdf-row">
                    <a 
                        href="#" 
                        onClick={(e) => e.preventDefault()}
                        className="pdf-button"
                    >
                        Visualizar página PDF
                        <FaFilePdf className="pdf-icon" />
                    </a>
                </div>
                <div className="pdf-row second-row">
                    <a 
                        href={portfolioUrl || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`pdf-button ${!portfolioUrl ? 'disabled' : ''}`}
                        onClick={e => !portfolioUrl && e.preventDefault()}
                    >
                        Portfolio PDF
                        <FaFilePdf className="pdf-icon" />
                    </a>
                    
                    <a 
                        href={cvUrl || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`pdf-button ${!cvUrl ? 'disabled' : ''}`}
                        onClick={e => !cvUrl && e.preventDefault()}
                    >
                        CV PDF
                        <FaFilePdf className="pdf-icon" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default UserDownloadableFilesSection;
