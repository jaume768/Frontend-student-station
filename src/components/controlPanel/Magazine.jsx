import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/magazine.css';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const Magazine = () => {
    const [magazines, setMagazines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener las revistas activas del backend
    useEffect(() => {
        const fetchMagazines = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/api/magazines`);
                
                if (response.data.success) {
                    setMagazines(response.data.data);
                    setError(null);
                } else {
                    setError('No se pudieron cargar las revistas');
                }
            } catch (err) {
                console.error('Error al cargar revistas:', err);
                setError('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchMagazines();
    }, []);

    // Formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    return (
        <div className="magazine-container">
            <div className="magazine-header">
                <h1>Revista</h1>
                <p className="magazine-description">
                    La revista del diseño independiente y diseñadores emergentes.
                </p>
            </div>

            {loading ? (
                <div className="magazine-loading">
                    <FaSpinner className="spinner" />
                    <p>Cargando revistas...</p>
                </div>
            ) : error ? (
                <div className="magazine-error">
                    <FaExclamationTriangle />
                    <p>{error}</p>
                </div>
            ) : magazines.length === 0 ? (
                <div className="magazine-empty">
                    <p>No hay revistas disponibles en este momento.</p>
                </div>
            ) : (
                <div className="magazine-grid">
                    {magazines.map((magazine) => (
                        <div key={magazine._id} className="magazine-card">
                            <a href={magazine.link || '#'} target="_blank" rel="noopener noreferrer" 
                               onClick={(e) => !magazine.link && e.preventDefault()}
                               className={!magazine.link ? 'no-link' : ''}>
                                <div className="magazine-image">
                                    <img src={magazine.image} alt={magazine.name} />
                                </div>
                                <div className="magazine-info">
                                    <h2>{magazine.name}</h2>
                                    <p className="magazine-price">{formatPrice(magazine.price)}</p>
                                    {!magazine.link && <p className="magazine-no-link">No disponible</p>}
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Magazine;
