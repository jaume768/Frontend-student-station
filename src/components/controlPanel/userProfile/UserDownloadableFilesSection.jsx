import React, { useState, useEffect } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import axios from 'axios';
import { printUserProfile } from '../miPerfil/printProfile';

const UserDownloadableFilesSection = ({ cvUrl, portfolioUrl, userId, username }) => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Cargar los datos del perfil solo cuando se necesiten para imprimir
        if (userId) {
            const fetchProfileData = async () => {
                try {
                    setIsLoading(true);
                    const token = localStorage.getItem('authToken');
                    if (!token) {
                        setIsLoading(false);
                        return;
                    }
                    
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const headers = { Authorization: `Bearer ${token}` };
                    const res = await axios.get(`${backendUrl}/api/users/profile/${username}`, { headers });
                    
                    setProfileData(res.data);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error al cargar los datos del perfil para imprimir:', error);
                    setIsLoading(false);
                }
            };
            
            fetchProfileData();
        }
    }, [userId, username]);

    const handlePrintProfile = () => {
        if (!profileData) {
            alert('Cargando datos del perfil. Por favor, espere un momento.');
            return;
        }
        
        // Usar la misma función de impresión que se usa en MiPerfil
        printUserProfile(profileData);
    };

    return (
        <section className="user-extern-section">
            <h2>Archivos descargables</h2>
            <div className="user-extern-downloads">
                <div className="pdf-row">
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handlePrintProfile();
                        }}
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
