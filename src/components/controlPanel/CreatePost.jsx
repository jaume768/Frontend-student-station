import React, { useState, useEffect } from 'react';
import { FaUpload, FaArrowLeft, FaArrowRight, FaTrash, FaCheck, FaEye, FaTimes, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/CreatePost.css';

const CreatePost = () => {
    // Estados para la parte izquierda (imágenes)
    const [images, setImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    // Estados para la parte derecha (información del post)
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');

    // Estados para las etiquetas de personas a etiquetar (Paso 3)
    const [peopleTags, setPeopleTags] = useState([{ name: '', role: '' }]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [activeTagIndex, setActiveTagIndex] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(false);
    
    // Estados para las etiquetas de imagen (Paso 4)
    const [imageTags, setImageTags] = useState({});
    const [newTag, setNewTag] = useState('');

    // Estados para el formulario
    const [isFormComplete, setIsFormComplete] = useState(false);

    // Estados para la validación de usuarios
    const [validationErrors, setValidationErrors] = useState([]);
    const [isValidating, setIsValidating] = useState(false);

    // Estados para la carga y éxito de la publicación
    const [isLoading, setIsLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [createdPostId, setCreatedPostId] = useState(null);
    
    const navigate = useNavigate();

    // Función para buscar usuarios mientras el usuario escribe
    useEffect(() => {
        const searchUsers = async () => {
            if (searchTerm.length < 2 || activeTagIndex === null) return;
            
            setLoadingUsers(true);
            try {
                const token = localStorage.getItem('authToken');
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                const response = await axios.get(
                    `${backendUrl}/api/users/searchUsers?term=${searchTerm}`, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setSuggestedUsers(response.data.users || []);
            } catch (error) {
                console.error('Error buscando usuarios:', error);
                setSuggestedUsers([]);
            } finally {
                setLoadingUsers(false);
            }
        };
        
        const timeoutId = setTimeout(() => {
            searchUsers();
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [searchTerm, activeTagIndex]);

    useEffect(() => {
        // Solo se requiere título y descripción para publicar
        const isComplete = postTitle.trim() !== '' && postDescription.trim() !== '';
        setIsFormComplete(isComplete);
    }, [postTitle, postDescription]);

    // Función para validar un nombre de usuario
    const validateUsername = async (username) => {
        if (!username.trim()) return true; // Empty usernames are fine (no tag)
        
        try {
            const token = localStorage.getItem('authToken');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            const response = await axios.get(
                `${backendUrl}/api/users/check-username/${username}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            return response.data.exists;
        } catch (error) {
            console.error('Error validating username:', error);
            return false;
        }
    };

    // Función para validar todos los nombres de usuario
    const validateAllUsernames = async () => {
        setIsValidating(true);
        setValidationErrors([]);
        
        const errors = [];
        
        for (let i = 0; i < peopleTags.length; i++) {
            const tag = peopleTags[i];
            if (tag.name.trim()) {
                const isValid = await validateUsername(tag.name);
                if (!isValid) {
                    errors.push({ index: i, message: `El usuario "${tag.name}" no existe en la plataforma.` });
                }
            }
        }
        
        setValidationErrors(errors);
        setIsValidating(false);
        return errors.length === 0;
    };

    const addPeopleTagCard = () => {
        // Solo añadir si la última tarjeta tiene al menos un nombre
        const lastTag = peopleTags[peopleTags.length - 1];
        if (lastTag.name.trim()) {
            setPeopleTags([...peopleTags, { name: '', role: '' }]);
        } else {
            // Mostrar mensaje o feedback visual de que debe completar la tarjeta actual
            alert("Completa la tarjeta actual antes de añadir una nueva");
        }
    };
    
    const removePeopleTagCard = (index) => {
        if (peopleTags.length > 1) {
            setPeopleTags(peopleTags.filter((_, i) => i !== index));
        }
    };
    
    const handlePeopleTagChange = (index, e) => {
        const { name, value } = e.target;
        const updated = peopleTags.map((item, i) =>
            i === index ? { ...item, [name]: value } : item
        );
        setPeopleTags(updated);
        
        if (name === 'name') {
            setSearchTerm(value);
            setActiveTagIndex(index);
        }
    };
    
    const selectUser = (username) => {
        if (activeTagIndex !== null) {
            const updated = peopleTags.map((item, i) =>
                i === activeTagIndex ? { ...item, name: username } : item
            );
            setPeopleTags(updated);
            setSearchTerm('');
            setSuggestedUsers([]);
            setActiveTagIndex(null);
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = newTag.trim();
            const currentTags = imageTags[mainImageIndex] || [];
            if (trimmed && currentTags.length < 10 && !currentTags.includes(trimmed)) {
                setImageTags({
                    ...imageTags,
                    [mainImageIndex]: [...currentTags, trimmed]
                });
                setNewTag('');
            }
        }
    };

    const removeImageTag = (tagIndex) => {
        const currentTags = imageTags[mainImageIndex] || [];
        setImageTags({
            ...imageTags,
            [mainImageIndex]: currentTags.filter((_, i) => i !== tagIndex)
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const updatedImages = [...images, ...files].slice(0, 6);
        setImages(updatedImages);
        if (updatedImages.length === 1) {
            setMainImageIndex(0);
        }
    };

    const handleNextImage = () => {
        setMainImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevImage = () => {
        setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Controlador de eventos de teclado para navegación con flechas
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (images.length <= 1) return;
            
            if (e.key === 'ArrowLeft') {
                handlePrevImage();
            } else if (e.key === 'ArrowRight') {
                handleNextImage();
            }
        };

        // Solo añadir el event listener si hay imágenes
        if (images.length > 0) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [images.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormComplete) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }
        
        // Validar nombres de usuario antes de enviar
        setIsLoading(true);
        
        // Validar nombres de usuario
        const allUsernamesValid = await validateAllUsernames();
        
        if (!allUsernamesValid) {
            setIsLoading(false);
            // Scroll to the first error
            if (validationErrors.length > 0) {
                const firstErrorIndex = validationErrors[0].index;
                const errorElement = document.getElementById(`people-tag-${firstErrorIndex}`);
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            return;
        }
        
        const formData = new FormData();
        formData.append('title', postTitle);
        formData.append('description', postDescription);
        images.forEach((img) => {
            formData.append('images', img);
        });
        
        // Filtrar las etiquetas de personas vacías antes de enviarlas
        const validPeopleTags = peopleTags.filter(tag => tag.name.trim() !== '');
        formData.append('peopleTags', JSON.stringify(validPeopleTags));
        formData.append('imageTags', JSON.stringify(imageTags));

        try {
            const token = localStorage.getItem('authToken');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(`${backendUrl}/api/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUploadSuccess(true);
            // Guardamos el ID del post creado para poder navegar a él
            if (response.data && response.data.post && response.data.post._id) {
                setCreatedPostId(response.data.post._id);
            }
            setImages([]);
            setPostTitle('');
            setPostDescription('');
            setPeopleTags([{ name: '', role: '' }]);
            setImageTags({});
            setNewTag('');
            setValidationErrors([]);
        } catch (error) {
            console.error("Error al publicar el post", error);
        } finally {
            setIsLoading(false);
        }
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    // onDragEnd para el drag & drop en thumbnails y orden de fotos
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;
        const newImages = reorder(images, result.source.index, result.destination.index);
        setImages(newImages);
        setMainImageIndex(0); // La primera foto será la principal
    };
    
    // Navegación al post recién creado
    const handleViewPost = () => {
        if (createdPostId) {
            navigate(`/post/${createdPostId}`);
        }
        setUploadSuccess(false);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="createpost-wrapper">
                {/* Input oculto para subir imágenes */}
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
                {/* Panel Izquierdo */}
                <div className={`createpost-left ${images.length > 0 ? 'with-images' : ''}`}>
                    <div className="step-label-dark step-label-blue">Paso 1</div>
                    {images.length === 0 ? (
                        <label htmlFor="image-upload" className="left-content clickable-upload-area">
                            <div className="upload-icon-wrapper">
                                <FaUpload size={40} />
                            </div>
                            <p className="upload-text">Sube tus imágenes</p>
                        </label>
                    ) : (
                        <div className="image-preview">
                            <div className="main-image-container">
                                <div className="main-image-wrapper">
                                    <img
                                        src={URL.createObjectURL(images[mainImageIndex])}
                                        alt="Imagen principal"
                                        className="main-image"
                                    />
                                    <div className="tags-overlay">
                                        <div className="added-tags">
                                            {(imageTags[mainImageIndex] || []).map((tag, index) => (
                                                <span key={index} className="overlay-tag">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImageTag(index)}
                                                        className="overlay-remove-tag"
                                                    >
                                                        X
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="tag-input-wrapper">
                                            <input
                                                type="text"
                                                placeholder='Escribe una etiqueta y pulsa "Enter"'
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyDown={handleTagKeyDown}
                                                className="overlay-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Droppable droppableId="thumbnails" direction="horizontal">
                                {(provided) => (
                                    <div
                                        className="thumbnails"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {images.map((img, index) => (
                                            <Draggable key={`thumb-${index}`} draggableId={`thumb-${index}`} index={index}>
                                                {(providedDraggable) => (
                                                    <img
                                                        ref={providedDraggable.innerRef}
                                                        {...providedDraggable.draggableProps}
                                                        {...providedDraggable.dragHandleProps}
                                                        src={URL.createObjectURL(img)}
                                                        alt={`Miniatura ${index}`}
                                                        className={`thumbnail ${index === mainImageIndex ? 'active' : ''}`}
                                                        onClick={() => setMainImageIndex(index)}
                                                    />
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        {images.length < 6 && (
                                            <label htmlFor="image-upload" className="thumbnail placeholder">
                                                <span className="plus-sign">+</span>
                                            </label>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )}
                    {images.length > 0 && (
                        <div className="preview-message">
                            Describe cada una de tus imágenes mediante tags para que otros usuarios puedan filtrar mejor tu contenido.
                        </div>
                    )}
                </div>
                {/* Panel Derecho */}
                <div className={`createpost-right ${images.length > 0 ? 'with-images' : ''}`}>
                    <form onSubmit={handleSubmit}>
                        <h2 className="section-title">Información del post</h2>
                        <div className="step-label-dark">Paso 2</div>
                        <section className="post-section">
                            <h3>Título*</h3>
                            <input
                                type="text"
                                placeholder="Introduce el título del post"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                className="post-input"
                            />
                        </section>
                        <section className="post-section">
                            <h3>Descripción*</h3>
                            <textarea
                                placeholder="Introduce la descripción del post"
                                value={postDescription}
                                onChange={(e) => setPostDescription(e.target.value)}
                                className="post-textarea"
                            />
                        </section>
                        <div className="step-label-dark">Paso 3</div>
                        <section className="post-section">
                            <h3>Etiqueta personas</h3>
                            {peopleTags.map((tag, index) => (
                                <div 
                                    key={index} 
                                    id={`people-tag-${index}`}
                                    className={`people-tag-card ${validationErrors.some(e => e.index === index) ? 'validation-error' : ''}`}
                                >
                                    <div className="form-group-create-post">
                                        <label>Nombre</label>
                                        <div className="autocomplete-wrapper">
                                            <input
                                                type="text"
                                                placeholder="Nombre de usuario a etiquetar"
                                                name="name"
                                                value={tag.name}
                                                onChange={(e) => handlePeopleTagChange(index, e)}
                                                onFocus={() => {
                                                    setActiveTagIndex(index);
                                                    setSearchTerm(tag.name);
                                                }}
                                                className={`post-input ${validationErrors.some(e => e.index === index) ? 'input-error' : ''}`}
                                            />
                                            {activeTagIndex === index && suggestedUsers.length > 0 && (
                                                <div className="autocomplete-dropdown">
                                                    {loadingUsers ? (
                                                        <div className="loading-users">Buscando usuarios...</div>
                                                    ) : (
                                                        suggestedUsers.map((user) => (
                                                            <div 
                                                                key={user._id} 
                                                                className="autocomplete-item"
                                                                onClick={() => selectUser(user.username)}
                                                            >
                                                                <img 
                                                                    src={user.profile?.profilePicture || "/multimedia/usuarioDefault.jpg"} 
                                                                    alt={user.username} 
                                                                    className="autocomplete-avatar"
                                                                />
                                                                <span>{user.username}</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                            {validationErrors.some(e => e.index === index) && (
                                                <div className="username-error-message">
                                                    <FaExclamationCircle /> {validationErrors.find(e => e.index === index).message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group-create-post">
                                        <label>Rol</label>
                                        <input
                                            type="text"
                                            placeholder="Ejemplo: Modelo, Dirección de arte, etc."
                                            name="role"
                                            value={tag.role}
                                            onChange={(e) => handlePeopleTagChange(index, e)}
                                            className="post-input"
                                        />
                                    </div>
                                    {peopleTags.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePeopleTagCard(index)}
                                            className="remove-card-btn"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addPeopleTagCard} className="add-card-btn">
                                + Añadir tarjeta para etiquetar
                            </button>
                        </section>
                        <div className="step-label-dark">Paso 4</div>
                        {images.length > 0 && (
                            <div className="photo-order-section">
                                <h3>Orden de fotos</h3>
                                <Droppable droppableId="orderList" direction="horizontal">
                                    {(provided) => (
                                        <div
                                            className="order-list"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {images.map((img, index) => (
                                                <Draggable key={`order-${index}`} draggableId={`order-${index}`} index={index}>
                                                    {(providedDraggable) => (
                                                        <div
                                                            ref={providedDraggable.innerRef}
                                                            {...providedDraggable.draggableProps}
                                                            {...providedDraggable.dragHandleProps}
                                                            className="order-item"
                                                        >
                                                            <img
                                                                src={URL.createObjectURL(img)}
                                                                alt={`Foto ${index + 1}`}
                                                                className="order-thumbnail"
                                                            />
                                                            <div className="order-number">{index + 1}</div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                <p className="drag-instruction">
                                    Arrastra para reordenar las fotos. La primera será la imagen principal del post.
                                </p>
                            </div>
                        )}
                        <button
                            type="submit"
                            className={`publish-btn ${isFormComplete ? 'active' : 'inactive'}`}
                            disabled={!isFormComplete || isLoading || isValidating}
                        >
                            {isLoading || isValidating ? 'Validando...' : 'Publicar'}
                        </button>
                    </form>
                </div>
                {isLoading && (
                    <div className="loading-overlay">
                        <p>Cargando...</p>
                    </div>
                )}
                {uploadSuccess && (
                    <div className="success-popup-overlay">
                        <div className="success-popup">
                            <div className="success-popup-header">
                                <h3>¡Post publicado con éxito!</h3>
                            </div>
                            <p>Tu publicación ha sido subida correctamente y ya está disponible para toda la comunidad.</p>
                            <div className="success-popup-actions">
                                <button 
                                    className="view-post-btn"
                                    onClick={handleViewPost}
                                >
                                    <FaEye /> Ver publicación
                                </button>
                                <button 
                                    className="close-btn"
                                    onClick={() => setUploadSuccess(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DragDropContext>
    );
};

export default CreatePost;