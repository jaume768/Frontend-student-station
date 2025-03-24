import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/blog.css';
import { FaSearch, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const Blog = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    // Lista de categorías
    const categories = [
        { id: 'all', name: 'Todos' },
        { id: 'trends', name: 'Tendencias' },
        { id: 'designers', name: 'Diseñadores' },
        { id: 'events', name: 'Eventos' },
        { id: 'sustainability', name: 'Sostenibilidad' },
        { id: 'business', name: 'Negocio' }
    ];

    // Datos de ejemplo para el blog (normalmente vendrían de una API)
    const sampleArticles = [
        {
            id: 1,
            title: 'Las tendencias de primavera 2025: colores y estampados que dominarán la temporada',
            excerpt: 'Descubre las principales tendencias de la moda para la próxima temporada primavera-verano 2025.',
            image: '/multimedia/blog/trends-spring-2025.png',
            date: '2025-03-20',
            category: 'trends',
            author: 'María Fernández',
            featured: true,
            size: 'large-blog'
        },
        {
            id: 2,
            title: 'Entrevista exclusiva: El ascenso del nuevo talento en diseño sostenible',
            excerpt: 'Conversamos con cinco diseñadores emergentes que están revolucionando la moda sostenible.',
            image: '/multimedia/blog/sustainable-designers.jpg',
            date: '2025-03-18',
            category: 'designers',
            author: 'Carlos Ruiz',
            featured: false,
            size: 'medium-blog'
        },
        {
            id: 3,
            title: 'Semana de la Moda de Madrid: Lo más destacado',
            excerpt: 'Un resumen de las colecciones más impactantes de la última edición.',
            image: '/multimedia/blog/madrid-fashion-week.webp',
            date: '2025-03-15',
            category: 'events',
            author: 'Laura González',
            featured: false,
            size: 'medium-blog'
        },
        {
            id: 4,
            title: 'El auge de los materiales textiles innovadores',
            excerpt: 'Exploramos los nuevos materiales que están transformando la industria de la moda.',
            image: '/multimedia/blog/innovative-textiles.jpg',
            date: '2025-03-12',
            category: 'sustainability',
            author: 'Ana Martínez',
            featured: false,
            size: 'small-blog'
        },
        {
            id: 5,
            title: 'Cómo la IA está transformando el diseño de moda',
            excerpt: 'Un análisis del impacto de la inteligencia artificial en los procesos creativos.',
            image: '/multimedia/blog/ai-fashion-design.jpg',
            date: '2025-03-10',
            category: 'business',
            author: 'Javier Torres',
            featured: false,
            size: 'small-blog'
        },
        {
            id: 6,
            title: 'El regreso de los 90: Nostalgia en la pasarela',
            excerpt: 'Analizamos cómo las tendencias de los 90 están volviendo con fuerza.',
            image: '/multimedia/blog/90s-revival.jpg',
            date: '2025-03-08',
            category: 'trends',
            author: 'Clara Sánchez',
            featured: false,
            size: 'medium-blog'
        },
        {
            id: 8,
            title: 'Entrevista con Carolina Herrera: 50 años de elegancia',
            excerpt: 'La icónica diseñadora reflexiona sobre su trayectoria y el futuro de su marca.',
            image: '/multimedia/blog/carolina-herrera.jpg',
            date: '2025-03-02',
            category: 'designers',
            author: 'Elena Vázquez',
            featured: true,
            size: 'large-blog'
        }
    ];

    useEffect(() => {
        // Simulación de carga de datos de una API
        const fetchArticles = async () => {
            try {
                setLoading(true);
                // Aquí normalmente habría una llamada axios a una API real
                // const backendUrl = import.meta.env.VITE_BACKEND_URL;
                // const response = await axios.get(`${backendUrl}/api/blog/articles`);
                
                // Simulamos una respuesta con datos de ejemplo
                setTimeout(() => {
                    setArticles(sampleArticles);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error al cargar los artículos del blog:', error);
                setError('Ocurrió un error al cargar los artículos. Por favor, inténtalo de nuevo más tarde.');
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Filtrar artículos por categoría
    const filteredArticles = activeCategory === 'all' 
        ? articles 
        : articles.filter(article => article.category === activeCategory);

    // Formatear fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading) {
        return (
            <div className="blog-container">
                <div className="blog-loading">
                    <FaSpinner className="fa-spin" />
                    <span>Cargando artículos...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-container">
                <div className="blog-error">
                    <FaExclamationTriangle />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-container">
            <div className="blog-header">
                <h1>Magazine</h1>
                <p className="blog-description">
                    Explora las últimas noticias, tendencias y entrevistas del mundo de la moda
                </p>
                
                <div className="blog-categories">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`blog-category-button ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="blog-bento-grid">
                {filteredArticles.length === 0 ? (
                    <div className="no-articles-message">
                        <FaSearch />
                        <p>No se encontraron artículos en esta categoría</p>
                    </div>
                ) : (
                    filteredArticles.map(article => (
                        <div 
                            key={article.id} 
                            className={`blog-card ${article.size} ${article.featured ? 'featured-blog' : ''}`}
                        >
                            <div className="blog-card-image-container">
                                <img 
                                    src={article.image || "/multimedia/blog/default-article.jpg"} 
                                    alt={article.title}
                                    className="blog-card-image"
                                    onError={(e) => {
                                        e.target.src = "/multimedia/blog/default-article.jpg";
                                    }}
                                />
                                <div className="blog-card-category">
                                    {categories.find(cat => cat.id === article.category)?.name || 'Categoría'}
                                </div>
                            </div>
                            <div className="blog-card-content">
                                <div>
                                    <h3 className="blog-card-title">{article.title}</h3>
                                    <p className="blog-card-excerpt">{article.excerpt}</p>
                                </div>
                                <div>
                                    <div className="blog-card-meta">
                                        <span className="blog-card-author">{article.author}</span>
                                        <span className="blog-card-date">{formatDate(article.date)}</span>
                                    </div>
                                    <Link to={`/ControlPanel/article/${article.id}`} className="blog-card-link">
                                        Leer más
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Blog;
