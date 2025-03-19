import React from 'react';
import { FaTh, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserProjectsSection = ({ isGalleryView, toggleView, userPosts }) => {
    const navigate = useNavigate();
    
    const totalGridItems = 15;
    const renderProjectsGrid = () => {
        return [...Array(totalGridItems)].map((_, index) => {
            if (index < userPosts.length) {
                const post = userPosts[index];
                return (
                    <div
                        key={index}
                        className="user-profile-project-card"
                        onClick={() => navigate(`/ControlPanel/post/${post._id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={post.mainImage}
                            alt={`Publicación ${index + 1}`}
                            className="user-profile-project-image"
                        />
                    </div>
                );
            } else {
                return (
                    <div key={index} className="user-profile-project-card">
                        {/* Placeholder sin imagen */}
                    </div>
                );
            }
        });
    };

    return (
        <>
            <div className="user-profile-projects-controls">
                <button onClick={toggleView} className="toggle-view-btn">
                    {isGalleryView ? <FaList size={20} /> : <FaTh size={20} />}
                </button>
            </div>
            <div className={`user-profile-project-grid ${isGalleryView ? 'gallery' : 'individual'}`}>
                {renderProjectsGrid()}
            </div>
        </>
    );
};

export default UserProjectsSection;
