import React from 'react';

const UserDownloadableFilesSection = ({ cvUrl, portfolioUrl }) => {
    return (
        <section className="user-profile-section last-section">
            <h2>Archivos descargables</h2>
            <div className="user-profile-downloads">
                {cvUrl ? (
                    <a 
                        href={cvUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="user-profile-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Descargar CV
                    </a>
                ) : (
                    <button 
                        className="user-profile-btn disabled" 
                        disabled
                        title="El usuario no ha subido su CV"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        CV en PDF
                    </button>
                )}
                
                {portfolioUrl ? (
                    <a 
                        href={portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="user-profile-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Descargar Portfolio
                    </a>
                ) : (
                    <button 
                        className="user-profile-btn disabled" 
                        disabled
                        title="El usuario no ha subido su portafolio"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Portfolio en PDF
                    </button>
                )}
            </div>
        </section>
    );
};

export default UserDownloadableFilesSection;
