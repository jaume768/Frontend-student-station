import React, { useState } from 'react';
import { FaUpload, FaArrowLeft, FaArrowRight, FaTrash } from 'react-icons/fa';
import './css/CreatePost.css';

const CreatePost = () => {
    // Estados para la parte izquierda (imágenes)
    const [images, setImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    // Estados para la parte derecha (info del post)
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');

    // Estados para las etiquetas de personas a etiquetar
    const [peopleTags, setPeopleTags] = useState([{ name: '', role: '' }]);
    const addPeopleTagCard = () => setPeopleTags([...peopleTags, { name: '', role: '' }]);
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
    };

    // Estados para etiquetas por imagen (Paso 4)
    const [imageTags, setImageTags] = useState({});
    const [newTag, setNewTag] = useState('');

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

    // Actualización de imágenes: se permite agregar imágenes de forma acumulativa hasta 6
    const handleImageUpload = (e) => {
        let files = Array.from(e.target.files);
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

    // Validación simple: se requiere al menos una imagen, título y descripción
    const isFormComplete = images.length > 0 && postTitle.trim() && postDescription.trim();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de envío (ejemplo: armar FormData y llamar a la API)
        console.log({
            images,
            postTitle,
            postDescription,
            peopleTags,
            imageTags
        });
    };

    return (
        <div className="createpost-wrapper">
            {/* Input oculto para subir imágenes (disponible en ambos casos) */}
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
            {/* Panel Izquierdo */}
            <div className="createpost-left">
                {images.length === 0 ? (
                    <div className="left-content">
                        <label htmlFor="image-upload" className="upload-icon">
                            <FaUpload size={40} />
                        </label>
                        <p className="upload-text">Sube tus imágenes</p>
                    </div>
                ) : (
                    <div className="image-preview">
                        <div className="main-image-container">
                            <FaArrowLeft onClick={handlePrevImage} className="arrow left-arrow" />
                            <img
                                src={URL.createObjectURL(images[mainImageIndex])}
                                alt="Imagen principal"
                                className="main-image"
                            />
                            <FaArrowRight onClick={handleNextImage} className="arrow right-arrow" />
                        </div>
                        <div className="thumbnails">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(img)}
                                    alt={`Miniatura ${index}`}
                                    className={`thumbnail ${index === mainImageIndex ? 'active' : ''}`}
                                    onClick={() => setMainImageIndex(index)}
                                />
                            ))}
                            {images.length < 6 && (
                                <label htmlFor="image-upload" className="thumbnail placeholder">
                                    <span className="plus-sign">+</span>
                                </label>
                            )}
                        </div>
                    </div>
                )}
                {images.length > 0 && (
                    <div className="preview-message">
                        La imagen se ajusta durante la vista previa, una vez publicada se mostrará en su tamaño completo.
                    </div>
                )}
            </div>

            {/* Panel Derecho */}
            <div className="createpost-right">
                <form onSubmit={handleSubmit}>
                    <h2 className="section-title">Información del post</h2>

                    {/* Paso 2 */}
                    <div className="step-label-dark">Paso 2</div>
                    <section className="post-section">
                        <h3>Título</h3>
                        <input
                            type="text"
                            placeholder="Introduce el título del post"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            className="post-input"
                        />
                    </section>
                    <section className="post-section">
                        <h3>Descripción</h3>
                        <textarea
                            placeholder="Introduce la descripción del post"
                            value={postDescription}
                            onChange={(e) => setPostDescription(e.target.value)}
                            className="post-textarea"
                        />
                    </section>

                    {/* Paso 3 */}
                    <div className="step-label-dark">Paso 3</div>
                    <section className="post-section">
                        <h3>Etiqueta personas</h3>
                        {peopleTags.map((tag, index) => (
                            <div key={index} className="people-tag-card">
                                <div className="form-group-create-post">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre de usuario a etiquetar"
                                        name="name"
                                        value={tag.name}
                                        onChange={(e) => handlePeopleTagChange(index, e)}
                                        className="post-input"
                                    />
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
                        <button
                            type="button"
                            onClick={addPeopleTagCard}
                            className="add-card-btn"
                        >
                            + Añadir tarjeta para etiquetar
                        </button>
                    </section>

                    {/* Paso 4 - Etiquetas por imagen */}
                    <div className="step-label-dark">Paso 4</div>
                    <section className="post-section">
                        <h3>Añade etiquetas por imagen</h3>
                        <div className="tags-info">
                            <p>Selecciona la imagen para etiquetar haciendo click en ella.</p>
                            <p>Añade una nueva etiqueta presionando "Enter".</p>
                            <p>Máximo 10 etiquetas por imagen.</p>
                        </div>
                        <div className="image-selection">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(img)}
                                    alt={`Miniatura ${index}`}
                                    className={`selection-thumbnail ${index === mainImageIndex ? 'active' : ''}`}
                                    onClick={() => setMainImageIndex(index)}
                                />
                            ))}
                            {images.length < 6 && (
                                <label htmlFor="image-upload" className="selection-thumbnail placeholder">
                                    <span className="plus-sign">+</span>
                                </label>
                            )}
                        </div>
                        <div className="tags-container">
                            {(imageTags[mainImageIndex] || []).map((tag, index) => (
                                <span key={index} className="tag">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeImageTag(index)}
                                        className="remove-tag-btn"
                                    >
                                        X
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Añade etiqueta..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            className="post-input"
                        />
                        <button type="button" className="save-tags-btn">
                            Guardar tags
                        </button>
                    </section>

                    <button type="submit" className="publish-btn" disabled={!isFormComplete}>
                        {isFormComplete ? (
                            <>
                                <FaUpload size={16} /> Publicar post
                            </>
                        ) : (
                            "Publicar post"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
