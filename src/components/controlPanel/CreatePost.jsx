import React, { useState } from 'react';
import { FaUpload, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './css/CreatePost.css';

const CreatePost = () => {
    // Estados para la parte izquierda
    const [images, setImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    // Estados para la parte derecha (post info)
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');

    // Estados para etiquetas de personas a etiquetar
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

    // Estados para las etiquetas del post
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = newTag.trim();
            if (trimmed && tags.length < 10 && !tags.includes(trimmed)) {
                setTags([...tags, trimmed]);
                setNewTag('');
            }
        }
    };

    const handleImageUpload = (e) => {
        let files = Array.from(e.target.files);
        if (files.length > 6) {
            files = files.slice(0, 6);
        }
        setImages(files);
        setMainImageIndex(0);
    };

    const handleNextImage = () => {
        setMainImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevImage = () => {
        setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    // Validación simple: requerimos que se suba al menos una imagen, y que se complete título y descripción
    const isFormComplete = images.length > 0 && postTitle.trim() && postDescription.trim();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de envío (por ejemplo, armar FormData y llamar a la API)
        console.log({
            images,
            postTitle,
            postDescription,
            peopleTags,
            tags,
        });
    };


    return (
        <div className="createpost-wrapper">
            {/* Panel Izquierdo */}
            <div className="createpost-left">
                {images.length === 0 ? (
                    <div className="left-content">
                        <label htmlFor="image-upload" className="upload-icon">
                            <FaUpload size={40} />
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
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
                        </div>
                    </div>
                )}
            </div>
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

                    {/* Paso 4 */}
                    <div className="step-label-dark">Paso 4</div>
                    <section className="post-section">
                        <h3>Añade etiquetas</h3>
                        <div className="tags-info">
                            <p>Añade una nueva etiqueta presionando "Enter".</p>
                            <p>Añade hasta un máximo de 10 etiquetas.</p>
                            <p>Una vez que hayas finalizado de escribir tus etiquetas guárdalas.</p>
                        </div>
                        <div className="tags-container">
                            {tags.map((tag, index) => (
                                <span key={index} className="tag">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(index)}
                                        className="remove-tag-btn"
                                    >
                                        X
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Ejemplo: Falda de volantes, rosa, lentejuelas, accesorio metálico, etc."
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
