import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import './css/magazineDetail.css';

const MagazineDetail = () => {
    const { id } = useParams();
    const [magazine, setMagazine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMagazineDetails = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/api/magazines/${id}`);
                
                if (response.data.success) {
                    setMagazine(response.data.data);
                    setError(null);
                } else {
                    setError('No se pudieron cargar los detalles de la revista');
                }
            } catch (err) {
                console.error('Error al cargar detalles de la revista:', err);
                setError('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMagazineDetails();
        }
    }, [id]);

    // Formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="magazine-detail-container">
                <div className="magazine-detail-loading">
                    <FaSpinner className="spinner" />
                    <p>Cargando detalles de la revista...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="magazine-detail-container">
                <div className="magazine-detail-error">
                    <FaExclamationTriangle />
                    <p>{error}</p>
                    <Link to="/ControlPanel/magazine" className="back-button">
                        <FaArrowLeft /> Volver a revistas
                    </Link>
                </div>
            </div>
        );
    }

    if (!magazine) {
        return (
            <div className="magazine-detail-container">
                <div className="magazine-detail-not-found">
                    <p>Revista no encontrada</p>
                    <Link to="/ControlPanel/magazine" className="back-button">
                        <FaArrowLeft /> Volver a revistas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="magazine-detail-container">
            <div className="magazine-detail-header">
                <Link to="/ControlPanel/magazine" className="back-button">
                    <FaArrowLeft /> Volver a revistas
                </Link>
                <h1>{magazine.name}</h1>
            </div>

            <div className="magazine-detail-content">
                <div className="magazine-detail-image">
                    <img src={magazine.image} alt={magazine.name} />
                </div>
                <div className="magazine-detail-info">
                    <div className="magazine-detail-price">
                        {formatPrice(magazine.price)}
                    </div>
                    <div className="magazine-detail-date">
                        Publicado: {new Date(magazine.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                    <div className="magazine-detail-description">
                        <h2>Sobre esta edición</h2>
                        <p>La revista del diseño independiente y diseñadores emergentes. Esta edición presenta contenido exclusivo de las últimas tendencias y diseñadores emergentes en el mundo de la moda.</p>
                    </div>
                    <div className="magazine-detail-actions">
                        {magazine.link ? (
                            <a href={magazine.link} target="_blank" rel="noopener noreferrer" className="primary-button">
                                Comprar ahora
                            </a>
                        ) : (
                            <button className="primary-button disabled" disabled>
                                No disponible
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MagazineDetail;
