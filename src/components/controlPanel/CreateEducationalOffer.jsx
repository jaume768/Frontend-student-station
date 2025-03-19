import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './css/create-educational-offer.css';

const CreateEducationalOffer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        programName: '',
        studyType: '',
        knowledgeArea: '',
        modality: '',
        durationValue: '',
        durationUnit: 'meses',
        startDate: '',
        endDate: '',
        city: '',
        country: '',
        address: '',
        price: '',
        currency: 'EUR',
        requirements: [],
        description: '',
        schedule: '',
        language: '',
        availableSeats: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        website: ''
    });

    const [files, setFiles] = useState({
        banner: null,
        gallery: [],
        brochure: null
    });

    const [loading, setLoading] = useState(false);
    const [newRequirement, setNewRequirement] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target;
        if (name === 'gallery') {
            setFiles(prev => ({
                ...prev,
                [name]: [...prev[name], ...fileList]
            }));
        } else {
            setFiles(prev => ({
                ...prev,
                [name]: fileList[0]
            }));
        }
    };

    const handleRemoveGalleryImage = (index) => {
        setFiles(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()]
            }));
            setNewRequirement('');
        }
    };

    const removeRequirement = (index) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Añadir todos los campos del formulario
            Object.keys(formData).forEach(key => {
                if (key === 'requirements') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Añadir archivos
            if (files.banner) {
                formDataToSend.append('banner', files.banner);
            }
            files.gallery.forEach(file => {
                formDataToSend.append('gallery', file);
            });
            if (files.brochure) {
                formDataToSend.append('brochure', files.brochure);
            }

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(
                `${backendUrl}/api/offers/educational`,
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success('Oferta educativa creada con éxito');
            navigate('/ControlPanel/offers');
        } catch (error) {
            console.error('Error al crear la oferta educativa:', error);
            toast.error(error.response?.data?.message || 'Error al crear la oferta educativa');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-educational-offer">
            <h2>Crear Oferta Educativa</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section-educational">
                    <h3>Información Básica</h3>
                    <div className="form-group">
                        <label htmlFor="programName">Nombre del Programa *</label>
                        <input
                            type="text"
                            id="programName"
                            name="programName"
                            value={formData.programName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="studyType">Tipo de Estudio *</label>
                            <select
                                id="studyType"
                                name="studyType"
                                value={formData.studyType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Grado">Grado</option>
                                <option value="Máster">Máster</option>
                                <option value="Curso">Curso</option>
                                <option value="Certificación">Certificación</option>
                                <option value="Taller">Taller</option>
                                <option value="Diplomado">Diplomado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="knowledgeArea">Área de Conocimiento *</label>
                            <input
                                type="text"
                                id="knowledgeArea"
                                name="knowledgeArea"
                                value={formData.knowledgeArea}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section-educational">
                    <h3>Modalidad y Duración</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="modality">Modalidad *</label>
                            <select
                                id="modality"
                                name="modality"
                                value={formData.modality}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Presencial">Presencial</option>
                                <option value="Online">Online</option>
                                <option value="Híbrida">Híbrida</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="durationValue">Duración *</label>
                            <div className="duration-input">
                                <input
                                    type="number"
                                    id="durationValue"
                                    name="durationValue"
                                    value={formData.durationValue}
                                    onChange={handleInputChange}
                                    required
                                />
                                <select
                                    name="durationUnit"
                                    value={formData.durationUnit}
                                    onChange={handleInputChange}
                                >
                                    <option value="horas">horas</option>
                                    <option value="meses">meses</option>
                                    <option value="años">años</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">Fecha de Inicio *</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">Fecha de Fin</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                {(formData.modality === 'Presencial' || formData.modality === 'Híbrida') && (
                    <div className="form-section-educational">
                        <h3>Ubicación</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">Ciudad *</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="country">País *</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Dirección *</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="form-section-educational">
                    <h3>Detalles del Programa</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Precio</label>
                            <div className="price-input">
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                >
                                    <option value="EUR">EUR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="availableSeats">Plazas Disponibles</label>
                            <input
                                type="number"
                                id="availableSeats"
                                name="availableSeats"
                                value={formData.availableSeats}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="schedule">Horario *</label>
                            <select
                                id="schedule"
                                name="schedule"
                                value={formData.schedule}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="mañana">Mañana</option>
                                <option value="tarde">Tarde</option>
                                <option value="noche">Noche</option>
                                <option value="fin de semana">Fin de semana</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="language">Idioma de Impartición *</label>
                            <input
                                type="text"
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section-educational">
                    <h3>Requisitos</h3>
                    <div className="requirements-input">
                        <input
                            type="text"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            placeholder="Añadir requisito..."
                        />
                        <button type="button" onClick={addRequirement}>
                            Añadir
                        </button>
                    </div>
                    <div className="requirements-list">
                        {formData.requirements.map((req, index) => (
                            <div key={index} className="requirement-item">
                                <span>{req}</span>
                                <button type="button" onClick={() => removeRequirement(index)}>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section-educational">
                    <h3>Descripción</h3>
                    <div className="form-group">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows="6"
                        />
                    </div>
                </div>

                <div className="form-section-educational">
                    <h3>Multimedia</h3>
                    <div className="form-group">
                        <label htmlFor="banner">Banner Principal</label>
                        <input
                            type="file"
                            id="banner"
                            name="banner"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gallery">Galería de Imágenes</label>
                        <input
                            type="file"
                            id="gallery"
                            name="gallery"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                        <div className="gallery-preview">
                            {Array.from(files.gallery).map((file, index) => (
                                <div key={index} className="gallery-item">
                                    <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                                    <button type="button" onClick={() => handleRemoveGalleryImage(index)}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="brochure">Folleto (PDF)</label>
                        <input
                            type="file"
                            id="brochure"
                            name="brochure"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div className="form-section-educational">
                    <h3>Redes Sociales</h3>
                    <div className="social-links">
                        <div className="form-group">
                            <label htmlFor="facebook">Facebook</label>
                            <input
                                type="url"
                                id="facebook"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleInputChange}
                                placeholder="https://facebook.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="instagram">Instagram</label>
                            <input
                                type="url"
                                id="instagram"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleInputChange}
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="twitter">Twitter</label>
                            <input
                                type="url"
                                id="twitter"
                                name="twitter"
                                value={formData.twitter}
                                onChange={handleInputChange}
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="linkedin">LinkedIn</label>
                            <input
                                type="url"
                                id="linkedin"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleInputChange}
                                placeholder="https://linkedin.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="website">Sitio Web</label>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate(-1)} className="cancel-button">
                        Cancelar
                    </button>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Oferta Educativa'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEducationalOffer;
