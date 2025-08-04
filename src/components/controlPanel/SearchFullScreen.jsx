import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaImage, FaBriefcase, FaGraduationCap, FaSpinner, FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';
import './css/searchResults.css';

const SearchFullScreen = ({ initialResults, initialQuery, onClose, onSearch, onResultClick }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState(initialQuery || '');
    const [results, setResults] = useState(initialResults || {});
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef(null);
    
    const { users = [], posts = [], offers = [], educationalOffers = [] } = results || {};
    const hasResults = users.length > 0 || posts.length > 0 || offers.length > 0 || educationalOffers.length > 0;
    const totalResults = users.length + posts.length + offers.length + educationalOffers.length;
    
    useEffect(() => {
        // Enfocar el input cuando se abre
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
        
        // Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        
        if (searchQuery.trim().length < 2) return;
        
        try {
            setIsSearching(true);
            const newResults = await onSearch(searchQuery);
            setResults(newResults || {});
            setIsSearching(false);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            setIsSearching(false);
        }
    };
    
    const clearSearch = () => {
        setSearchQuery('');
        setResults({});
    };
    
    const renderFilterTabs = () => {
        const tabs = [
            { id: 'all', label: 'Todos', count: totalResults },
            { id: 'users', label: 'Usuarios', count: users.length },
            { id: 'posts', label: 'Publicaciones', count: posts.length },
            { id: 'offers', label: 'Ofertas de trabajo', count: offers.length },
            { id: 'educationalOffers', label: 'Oportunidades educativas', count: educationalOffers.length }
        ];
        
        return (
            <div className="filter-tabs">
                {tabs.map(tab => (
                    <div 
                        key={tab.id}
                        className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                        <span className="filter-tab-count">{tab.count}</span>
                    </div>
                ))}
            </div>
        );
    };
    
    const renderResults = () => {
        if (isSearching) {
            return (
                <div className="search-loading">
                    <FaSpinner className="spin-icon" />
                    <p>Buscando...</p>
                </div>
            );
        }
        
        if (!hasResults) {
            return (
                <div className="no-filter-results">
                    <FaSearch style={{ fontSize: '32px', color: '#ddd' }} />
                    <p>No se encontraron resultados para "{searchQuery}"</p>
                    <p className="no-results-tip">Intenta con términos más generales o revisa la ortografía</p>
                </div>
            );
        }
        
        let contentToRender = [];
        
        if (activeTab === 'all' || activeTab === 'users') {
            const userItems = users.map(user => (
                <div 
                    key={`user-${user._id}`} 
                    className="grid-result-item user-grid-item"
                    onClick={() => onResultClick('user', user)}
                >
                    <div className="grid-img-container">
                        {user.profile && user.profile.profilePicture ? (
                            <img src={user.profile.profilePicture} alt={user.fullName || user.companyName || 'Usuario'} />
                        ) : (
                            <div className="placeholder-image"><FaUser /></div>
                        )}
                    </div>
                    <div className="grid-result-info">
                        <h3>{user.fullName || user.companyName || 'Usuario'}</h3>
                        <p className="subtitle">{user.professionalTitle || user.username}</p>
                        {user.professionalType === 1 && <span className="user-badge creative">Creativo</span>}
                        {user.professionalType === 2 && <span className="user-badge company">Empresa</span>}
                        {user.professionalType === 3 && <span className="user-badge institution">Institución</span>}
                        {user.professionalType === 4 && <span className="user-badge expert">Institución</span>}
                        {user.professionalType && [1, 2, 4].includes(user.professionalType) ? (
                            <p className="subtitle">Empresa</p>
                        ) : (
                            <p className="subtitle">Creativo</p>
                        )}
                    </div>
                </div>
            ));
            
            if (activeTab === 'users') {
                contentToRender = userItems;
            } else if (userItems.length > 0) {
                contentToRender.push(
                    <div key="users-section" className="fullscreen-section">
                        <h3 className="fullscreen-section-title">
                            <FaUser className="section-icon" />
                            Usuarios
                        </h3>
                        <div className="fullscreen-section-grid">
                            {userItems}
                        </div>
                    </div>
                );
            }
        }
        
        if (activeTab === 'all' || activeTab === 'posts') {
            const postItems = posts.map(post => (
                <div 
                    key={`post-${post._id}`} 
                    className="grid-result-item"
                    onClick={() => onResultClick('post', post)}
                >
                    <div className="grid-img-container">
                        {post.mainImage ? (
                            <img src={post.mainImage} alt={post.title} />
                        ) : (
                            <div className="placeholder-image"><FaImage size={32} /></div>
                        )}
                    </div>
                    <div className="grid-result-info">
                        <h3>{post.title}</h3>
                        {post.user && <p>Por: {post.user.fullName || post.user.companyName || post.user.username}</p>}
                        <p className="grid-description">{post.description?.substring(0, 100)}{post.description?.length > 100 ? '...' : ''}</p>
                    </div>
                </div>
            ));
            
            if (activeTab === 'posts') {
                contentToRender = postItems;
            } else if (postItems.length > 0) {
                contentToRender.push(
                    <div key="posts-section" className="fullscreen-section">
                        <h3 className="fullscreen-section-title">
                            <FaImage className="section-icon" />
                            Publicaciones
                        </h3>
                        <div className="fullscreen-section-grid">
                            {postItems}
                        </div>
                    </div>
                );
            }
        }
        
        if (activeTab === 'all' || activeTab === 'offers') {
            const offerItems = offers.map(offer => (
                <div 
                    key={`offer-${offer._id}`} 
                    className="grid-result-item"
                    onClick={() => onResultClick('offer', offer)}
                >
                    <div className="grid-img-container">
                        {offer.companyLogo ? (
                            <img src={offer.companyLogo} alt={offer.companyName} />
                        ) : (
                            <div className="placeholder-image"><FaBriefcase size={32} /></div>
                        )}
                    </div>
                    <div className="grid-result-info">
                        <h3>{offer.position}</h3>
                        <p>{offer.companyName}</p>
                        <p className="subtitle">{offer.city} • {new Date(offer.publicationDate).toLocaleDateString()}</p>
                    </div>
                </div>
            ));
            
            if (activeTab === 'offers') {
                contentToRender = offerItems;
            } else if (offerItems.length > 0) {
                contentToRender.push(
                    <div key="offers-section" className="fullscreen-section">
                        <h3 className="fullscreen-section-title">
                            <FaBriefcase className="section-icon" />
                            Ofertas de trabajo
                        </h3>
                        <div className="fullscreen-section-grid">
                            {offerItems}
                        </div>
                    </div>
                );
            }
        }
        
        if (activeTab === 'all' || activeTab === 'educationalOffers') {
            const eduOfferItems = educationalOffers.map(eduOffer => (
                <div 
                    key={`edu-${eduOffer._id}`} 
                    className="grid-result-item"
                    onClick={() => onResultClick('educationalOffer', eduOffer)}
                >
                    <div className="grid-img-container">
                        {eduOffer.images && eduOffer.images.length > 0 ? (
                            <img src={eduOffer.images[0].url} alt={eduOffer.programName} />
                        ) : (
                            <div className="placeholder-image"><FaGraduationCap size={32} /></div>
                        )}
                    </div>
                    <div className="grid-result-info">
                        <h3>{eduOffer.programName}</h3>
                        <p>{eduOffer.studyType} • {eduOffer.knowledgeArea}</p>
                        <p className="subtitle">{eduOffer.modality} • Inicia: {new Date(eduOffer.startDate).toLocaleDateString()}</p>
                    </div>
                </div>
            ));
            
            if (activeTab === 'educationalOffers') {
                contentToRender = eduOfferItems;
            } else if (eduOfferItems.length > 0) {
                contentToRender.push(
                    <div key="edu-section" className="fullscreen-section">
                        <h3 className="fullscreen-section-title">
                            <FaGraduationCap className="section-icon" />
                            Oportunidades educativas
                        </h3>
                        <div className="fullscreen-section-grid">
                            {eduOfferItems}
                        </div>
                    </div>
                );
            }
        }
        
        if (contentToRender.length === 0 && activeTab !== 'all') {
            return (
                <div className="no-filter-results">
                    <p>No hay resultados para la categoría "{activeTab === 'users' ? 'Usuarios' : 
                       activeTab === 'posts' ? 'Publicaciones' : 
                       activeTab === 'offers' ? 'Ofertas de trabajo' : 'Oportunidades educativas'}"</p>
                </div>
            );
        }
        
        if (activeTab === 'all') {
            return <div className="fullscreen-results-container">{contentToRender}</div>;
        } else {
            return <div className="fullscreen-results-grid">{contentToRender}</div>;
        }
    };
    
    return (
        <div className="search-fullscreen">
            <div className="search-fullscreen-header">
                <button className="back-button" onClick={onClose}>
                    <FaArrowLeft />
                </button>
                <div className="search-input-container full-screen">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Buscar personas, publicaciones, ofertas..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                        ref={searchInputRef}
                        className="modern-search-input"
                    />
                    {searchQuery && (
                        <FaTimes 
                            className="search-clear-icon" 
                            onClick={clearSearch}
                            style={{ cursor: 'pointer', position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}
                        />
                    )}
                </div>
            </div>
            
            <div className="search-fullscreen-content">
                {renderFilterTabs()}
                {renderResults()}
            </div>
        </div>
    );
};

export default SearchFullScreen;
