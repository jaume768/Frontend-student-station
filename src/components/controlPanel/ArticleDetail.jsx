import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './css/blog.css';
import './css/article-detail.css';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaSpinner, FaExclamationTriangle, FaArrowRight, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullScreenPreview, setShowFullScreenPreview] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.REACT_APP_API_URL || 'https://backend-studen-station-production.up.railway.app';
                
                // Obtener el artículo actual
                const articleResponse = await axios.get(`${apiUrl}/api/blog/${id}`);
                
                if (articleResponse.data.success) {
                    setArticle(articleResponse.data.data);
                    
                    // Obtener artículos relacionados (todos los artículos excepto el actual)
                    const allArticlesResponse = await axios.get(`${apiUrl}/api/blog`);
                    
                    if (allArticlesResponse.data.success) {
                        // Filtrar para excluir el artículo actual y limitar a 3 artículos
                        const filtered = allArticlesResponse.data.data
                            .filter(article => article._id !== id)
                            .slice(0, 3);
                            
                        setRelatedArticles(filtered);
                    }
                    
                    setError(null);
                } else {
                    setError('No se pudo cargar el artículo');
                }
            } catch (error) {
                console.error('Error al cargar el artículo:', error);
                setError('Ocurrió un error al cargar el artículo. Por favor, inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    if (loading) {
        return (
            <div className="article-container">
                <div className="article-loading">
                    <FaSpinner className="fa-spin" />
                    <span>Cargando artículo...</span>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="article-container">
                <div className="article-error">
                    <FaExclamationTriangle />
                    <span>{error || 'No se pudo cargar el artículo'}</span>
                    <Link to="/ControlPanel/blog" className="back-to-blog-btn">
                        <FaArrowLeft /> Volver al blog
                    </Link>
                </div>
            </div>
        );
    }

    // Función para renderizar el contenido con formato HTML
    const renderContent = (content) => {
        return { __html: content };
    };

    return (
        <div className="article-container">
            <div className="article-header">
                <Link to="/ControlPanel/blog" className="back-to-blog-btn">
                    <FaTimes />
                </Link>
            </div>
            
            {/* Imagen principal en la parte superior */}
            <div className="article-main-image-container">
                <img 
                    src={article.image || "/multimedia/blog/default-article.jpg"} 
                    alt={article.title}
                    className="article-main-image"
                    onClick={() => {
                        setSelectedImage(article.image);
                        setShowFullScreenPreview(true);
                    }}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => {
                        e.target.src = "/multimedia/blog/default-article.jpg";
                    }}
                />
            </div>
            
            <div className="article-content-container">
                <div className="article-meta">
                    <div className="article-meta-info">
                        <span className="article-category">{article.category}</span>
                        <span className="article-date">{formatDate(article.publishedDate)}</span>
                    </div>
                </div>
                
                <h1 className="article-title">{article.title}</h1>
                <h2 className="article-subtitle">{article.excerpt || 'Subtítulo del artículo'}</h2>
                <p className="article-author">Palabras de <span className="article-author-name"> {article.author}</span></p>
                
                {/* Contenido principal del artículo */}
                <div 
                    className="article-content"
                    dangerouslySetInnerHTML={renderContent(article.content)}
                />
                
                {/* Imágenes adicionales en la parte inferior */}
                {article.additionalImages && article.additionalImages.length > 0 && (
                    <div className="article-additional-images">
                        {article.additionalImages.map((image, index) => (
                            <div key={index} className="additional-image-container">
                                <img 
                                    src={image} 
                                    alt={`${article.title} - imagen ${index + 1}`}
                                    className="additional-image"
                                    onClick={() => {
                                        setSelectedImage(image);
                                        setShowFullScreenPreview(true);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    onError={(e) => {
                                        e.target.src = "/multimedia/blog/default-article.jpg";
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Etiquetas del artículo */}
                {article.tags && article.tags.length > 0 && (
                    <div className="article-tags">
                        {article.tags.map((tag, index) => (
                            <span key={index} className="article-tag">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Sección de artículos relacionados */}
            {relatedArticles.length > 0 && (
                <div className="related-articles-section">
                    <h2 className="related-articles-title">+</h2>
                    <div className="related-articles-grid">
                        {relatedArticles.map(relatedArticle => (
                            <div key={relatedArticle._id} className="related-article-card">
                                <div className="related-article-image-container">
                                    <img 
                                        src={relatedArticle.image || "/multimedia/blog/default-article.jpg"} 
                                        alt={relatedArticle.title}
                                        className="related-article-image"
                                        onError={(e) => {
                                            e.target.src = "/multimedia/blog/default-article.jpg";
                                        }}
                                    />
                                </div>
                                <div className="related-article-content">
                                    <div className="related-article-meta">
                                        <span className="related-article-category">{relatedArticle.category}</span>
                                        <span className="related-article-date">{formatDate(relatedArticle.publishedDate)}</span>
                                    </div>
                                    <h3 className="related-article-title">{relatedArticle.title}</h3>
                                    <p className="related-article-excerpt">{relatedArticle.excerpt}</p>
                                    <Link to={`/ControlPanel/article/${relatedArticle._id}`} className="related-article-link">
                                        Leer más
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Modal de vista previa a pantalla completa */}
            {showFullScreenPreview && selectedImage && (
                <div className="fullscreen-preview-overlay" onClick={() => setShowFullScreenPreview(false)}>
                    <div className="fullscreen-preview-content">
                        <button className="fullscreen-close-btn" onClick={() => setShowFullScreenPreview(false)}>
                            <FaTimes size={24} />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Vista previa a pantalla completa"
                            className="fullscreen-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleDetail;
