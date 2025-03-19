import React from 'react';
import { FaTh, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProjectsSection = ({ isGalleryView, toggleView, userPosts = [] }) => {
    const navigate = useNavigate();
    
    const totalGridItems = 15;
    const renderProjectsGrid = () => {
        // Asegurarse de que userPosts sea un array
        const posts = Array.isArray(userPosts) ? userPosts : [];
        
        return [...Array(totalGridItems)].map((_, index) => {
            if (index < posts.length) {
                const post = posts[index];
                return (
                    <div
                        key={index}
                        className="miPerfil-project-placeholder"
                        onClick={() => navigate(`/ControlPanel/post/${post._id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={post.mainImage}
                            alt={`Publicación ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </div>
                );
            } else {
                return (
                    <div key={index} className="miPerfil-project-placeholder">
                        {/* Placeholder sin imagen */}
                    </div>
                );
            }
        });
    };

    return (
        <div className="miPerfil-right">
            <div
                className="miPerfil-projects-controls"
                style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
            >
                <button onClick={toggleView} className="toggle-view-btn">
                    {isGalleryView ? <FaList size={20} /> : <FaTh size={20} />}
                </button>
            </div>
            <div
                className={`miPerfil-projects-grid ${isGalleryView ? 'gallery' : 'individual'}`}
            >
                {renderProjectsGrid()}
            </div>
        </div>
    );
};

export default ProjectsSection;
