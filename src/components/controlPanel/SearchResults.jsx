import React from 'react';
import { FaUser, FaImage, FaBriefcase, FaGraduationCap, FaSpinner, FaArrowRight } from 'react-icons/fa';
import './css/searchResults.css';

const SearchResults = ({ results, onResultClick, isLoading, onViewAll }) => {
    const { users = [], posts = [], offers = [], educationalOffers = [] } = results || {};
    const hasResults = users.length > 0 || posts.length > 0 || offers.length > 0 || educationalOffers.length > 0;
    const totalResults = users.length + posts.length + offers.length + educationalOffers.length;

    if (isLoading) {
        return (
            <div className="search-results-container">
                <div className="search-loading">
                    <FaSpinner className="spin-icon" />
                    <p>Buscando...</p>
                </div>
            </div>
        );
    }

    if (!hasResults) {
        return (
            <div className="search-results-container">
                <div className="no-results">
                    <p>No se encontraron resultados</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-results-container">
            <div className="search-results-header">
                <div className="results-count">
                    {totalResults} resultado{totalResults !== 1 ? 's' : ''}
                </div>
                <button className="view-all-btn" onClick={onViewAll}>
                    Ver todos <FaArrowRight />
                </button>
            </div>

            {users.length > 0 && (
                <div className="results-section">
                    <h3>
                        <FaUser className="section-icon" />
                        Usuarios
                    </h3>
                    <div className="results-list">
                        {users.slice(0, 3).map(user => (
                            <div 
                                key={`user-${user._id}`} 
                                className="result-item"
                                onClick={() => onResultClick('user', user)}
                            >
                                <div className="result-image">
                                    {user.profile && user.profile.profilePicture ? (
                                        <img src={user.profile.profilePicture} alt={user.username} />
                                    ) : (
                                        <div className="placeholder-image"><FaUser /></div>
                                    )}
                                </div>
                                <div className="result-info">
                                    <h4>{user.username}</h4>
                                    <p>{user.companyName || user.fullName || ''}</p>
                                    {user.professionalTitle && <p className="subtitle">{user.professionalTitle}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    {users.length > 3 && (
                        <div className="more-results" onClick={onViewAll}>
                            +{users.length - 3} más...
                        </div>
                    )}
                </div>
            )}

            {posts.length > 0 && (
                <div className="results-section">
                    <h3>
                        <FaImage className="section-icon" />
                        Publicaciones
                    </h3>
                    <div className="results-list">
                        {posts.slice(0, 3).map(post => (
                            <div 
                                key={`post-${post._id}`} 
                                className="result-item"
                                onClick={() => onResultClick('post', post)}
                            >
                                <div className="result-image">
                                    {post.mainImage ? (
                                        <img src={post.mainImage} alt={post.title} />
                                    ) : (
                                        <div className="placeholder-image"><FaImage /></div>
                                    )}
                                </div>
                                <div className="result-info">
                                    <h4>{post.title}</h4>
                                    {post.user && <p>Por: {post.user.username}</p>}
                                    <p className="description">{post.description?.substring(0, 60)}...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {posts.length > 3 && (
                        <div className="more-results" onClick={onViewAll}>
                            +{posts.length - 3} más...
                        </div>
                    )}
                </div>
            )}

            {offers.length > 0 && (
                <div className="results-section">
                    <h3>
                        <FaBriefcase className="section-icon" />
                        Ofertas de trabajo
                    </h3>
                    <div className="results-list">
                        {offers.slice(0, 2).map(offer => (
                            <div 
                                key={`offer-${offer._id}`} 
                                className="result-item"
                                onClick={() => onResultClick('offer', offer)}
                            >
                                <div className="result-image">
                                    {offer.companyLogo ? (
                                        <img src={offer.companyLogo} alt={offer.companyName} />
                                    ) : (
                                        <div className="placeholder-image"><FaBriefcase /></div>
                                    )}
                                </div>
                                <div className="result-info">
                                    <h4>{offer.position}</h4>
                                    <p>{offer.companyName}</p>
                                    <p className="subtitle">{offer.city} • {new Date(offer.publicationDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {offers.length > 2 && (
                        <div className="more-results" onClick={onViewAll}>
                            +{offers.length - 2} más...
                        </div>
                    )}
                </div>
            )}

            {educationalOffers.length > 0 && (
                <div className="results-section">
                    <h3>
                        <FaGraduationCap className="section-icon" />
                        Oportunidades educativas
                    </h3>
                    <div className="results-list">
                        {educationalOffers.slice(0, 2).map(eduOffer => (
                            <div 
                                key={`edu-${eduOffer._id}`} 
                                className="result-item"
                                onClick={() => onResultClick('educationalOffer', eduOffer)}
                            >
                                <div className="result-image">
                                    {eduOffer.images && eduOffer.images.length > 0 ? (
                                        <img src={eduOffer.images[0].url} alt={eduOffer.programName} />
                                    ) : (
                                        <div className="placeholder-image"><FaGraduationCap /></div>
                                    )}
                                </div>
                                <div className="result-info">
                                    <h4>{eduOffer.programName}</h4>
                                    <p>{eduOffer.studyType} • {eduOffer.knowledgeArea}</p>
                                    <p className="subtitle">{eduOffer.modality} • Inicia: {new Date(eduOffer.startDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {educationalOffers.length > 2 && (
                        <div className="more-results" onClick={onViewAll}>
                            +{educationalOffers.length - 2} más...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
