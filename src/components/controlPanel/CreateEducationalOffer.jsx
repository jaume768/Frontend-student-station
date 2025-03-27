import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './css/create-educational-offer.css';

const CreateEducationalOffer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        programName: '',
        studyType: '',
        city: '',
        country: '',
        educationType: '',
        modality: '',
        morningSchedule: false,
        duration: '',
        credits: '',
        internships: false,
        erasmus: false,
        bilingualEducation: false,
        enrollmentStartDate: '',
        enrollmentStartMonth: '',
        enrollmentEndDate: '',
        enrollmentEndMonth: '',
        schoolYearStartMonth: '',
        schoolYearEndMonth: '',
        websiteUrl: '',
        description: '',
        requirements: []
    });

    const [files, setFiles] = useState({
        headerImage: null
    });

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [newRequirement, setNewRequirement] = useState('');

    // Validación de campos al cambiar
    useEffect(() => {
        validateForm();
    }, [formData]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data);
            } catch (error) {
                console.error("Error al cargar el perfil", error);
            }
        };
        fetchProfile();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        
        if (formData.programName && formData.programName.length > 100) {
            newErrors.programName = 'El título no puede exceder los 100 caracteres';
        }
        
        if (formData.websiteUrl && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.websiteUrl)) {
            newErrors.websiteUrl = 'Por favor, introduce una URL válida';
        }
        
        if (formData.duration && (isNaN(formData.duration) || parseInt(formData.duration) <= 0)) {
            newErrors.duration = 'La duración debe ser un número positivo';
        }
        
        if (formData.credits && (isNaN(formData.credits) || parseInt(formData.credits) <= 0)) {
            newErrors.credits = 'Los créditos deben ser un número positivo';
        }
        
        // Validaciones de fechas
        if (formData.enrollmentStartDate && formData.enrollmentEndDate) {
            const startDate = new Date(formData.enrollmentStartDate);
            const endDate = new Date(formData.enrollmentEndDate);
            
            if (startDate > endDate) {
                newErrors.enrollmentDates = 'La fecha de inicio no puede ser posterior a la fecha de finalización';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target;
        if (fileList && fileList[0]) {
            // Validar tamaño y tipo de archivo
            const file = fileList[0];
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            
            if (file.size > maxSize) {
                toast.error('El archivo es demasiado grande. Máximo 5MB permitido.');
                return;
            }
            
            if (!allowedTypes.includes(file.type)) {
                toast.error('Tipo de archivo no permitido. Solo se aceptan JPG, PNG y GIF.');
                return;
            }
            
            setFiles(prev => ({
                ...prev,
                [name]: file
            }));
        }
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            if (formData.requirements.length >= 10) {
                toast.warning('Máximo 10 requisitos permitidos');
                return;
            }
            
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
        
        // Validación final antes de enviar
        if (!validateForm()) {
            toast.error('Por favor, corrige los errores antes de continuar');
            return;
        }
        
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Añadir todos los campos del formulario que no estén vacíos
            Object.keys(formData).forEach(key => {
                if (key === 'requirements') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Añadir archivos
            if (files.headerImage) {
                formDataToSend.append('headerImage', files.headerImage);
            }

            formDataToSend.append('institutionName', profile.companyName);

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('No estás autenticado');
            }
            
            const response = await axios.post(
                `${backendUrl}/api/offers/educational`,
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 3000
                }
            );

            toast.success('Oferta educativa creada con éxito');
            navigate('/ControlPanel/fashion');
        } catch (error) {
            console.error('Error al crear la oferta educativa:', error);
            
            if (error.response) {
                // Errores específicos del servidor
                const errorMessage = error.response.data?.message || 'Error al crear la oferta educativa';
                toast.error(errorMessage);
                
                // Si hay errores de validación del servidor, mostrarlos
                if (error.response.data?.errors) {
                    setErrors(prev => ({...prev, ...error.response.data.errors}));
                }
            } else if (error.request) {
                // Error de conexión
                toast.error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else {
                // Otros errores
                toast.error('Error al crear la oferta educativa');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-educational-offer">
            <h2>Publica una oferta educativa</h2>
            <form onSubmit={handleSubmit}>
                {/* Sección para imagen de cabecera */}
                <div className="create-educational-header-image-section">
                    <div className="create-educational-header-image-upload">
                        <label htmlFor="headerImage" className="create-educational-upload-label">
                            <div className="create-educational-upload-icon">
                                <i className="fas fa-arrow-up"></i>
                            </div>
                            <span>Sube tu imagen de cabecera</span>
                        </label>
                        <input
                            type="file"
                            id="headerImage"
                            name="headerImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="create-educational-file-input"
                        />
                    </div>
                    {files.headerImage && (
                        <div className="create-educational-header-image-preview">
                            <img src={URL.createObjectURL(files.headerImage)} alt="Vista previa" />
                        </div>
                    )}
                </div>
                
                {/* Título del programa */}
                <div className="create-educational-form-field">
                    <label htmlFor="programName" className="create-educational-form-title">Título de la formación</label>
                    <input
                        type="text"
                        id="programName"
                        name="programName"
                        value={formData.programName}
                        onChange={handleInputChange}
                        required
                        placeholder="Nombre de la formación. Ejemplo: Artesanía Contemporánea"
                        className="create-educational-large-input"
                    />
                    {errors.programName && <span className="create-educational-error-message">{errors.programName}</span>}
                    <small>Introduce el nombre de la formación sin incluir palabras como "Grado Superior" o "Máster"</small>
                </div>

                {/* Especificaciones */}
                <div className="create-educational-form-section">
                    <h3>Especificaciones</h3>
                    
                    <div className="create-educational-form-row">
                        <div className="create-educational-form-field">
                            <label htmlFor="city">Ubicación</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="Ciudad"
                                required
                            />
                        </div>
                        <div className="create-educational-form-field">
                            <label htmlFor="country">&nbsp;</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder="País"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="create-educational-form-field">
                        <label htmlFor="educationType">Tipo de Educación</label>
                        <select
                            id="educationType"
                            name="educationType"
                            value={formData.educationType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Grado Superior">Grado Superior</option>
                            <option value="Máster">Máster</option>
                            <option value="Grado">Grado</option>
                            <option value="Curso">Curso</option>
                            <option value="Certificación">Certificación</option>
                        </select>
                    </div>
                </div>

                {/* Formación */}
                <div className="create-educational-form-section">
                    <h3>Formación</h3>
                    
                    <div className="create-educational-form-row">
                        <div className="create-educational-form-field">
                            <label htmlFor="modality">Presencial</label>
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
                        <div className="create-educational-form-field create-educational-checkbox-field">
                            <label htmlFor="morningSchedule">Horario de mañana?</label>
                            <input
                                type="checkbox"
                                id="morningSchedule"
                                name="morningSchedule"
                                checked={formData.morningSchedule}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    <div className="create-educational-form-row">
                        <div className="create-educational-form-field">
                            <label htmlFor="duration">Duración (Años)</label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                required
                                min="1"
                                step="1"
                            />
                            {errors.duration && <span className="create-educational-error-message">{errors.duration}</span>}
                        </div>
                        <div className="create-educational-form-field">
                            <label htmlFor="credits">¿Créditos?</label>
                            <input
                                type="number"
                                id="credits"
                                name="credits"
                                value={formData.credits}
                                onChange={handleInputChange}
                                min="1"
                                step="1"
                            />
                            {errors.credits && <span className="create-educational-error-message">{errors.credits}</span>}
                        </div>
                    </div>
                    
                    <div className="create-educational-form-row create-educational-checkbox-group">
                        <div className="create-educational-form-field create-educational-checkbox-field">
                            <label htmlFor="internships">¿Prácticas?</label>
                            <input
                                type="checkbox"
                                id="internships"
                                name="internships"
                                checked={formData.internships}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="create-educational-form-field create-educational-checkbox-field">
                            <label htmlFor="erasmus">¿Erasmus?</label>
                            <input
                                type="checkbox"
                                id="erasmus"
                                name="erasmus"
                                checked={formData.erasmus}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="create-educational-form-field create-educational-checkbox-field">
                            <label htmlFor="bilingualEducation">Educación bilingüe</label>
                            <input
                                type="checkbox"
                                id="bilingualEducation"
                                name="bilingualEducation"
                                checked={formData.bilingualEducation}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Plazo de matriculación */}
                <div className="create-educational-form-section">
                    <h3>Plazo de matriculación</h3>
                    
                    <div className="create-educational-form-row">
                        <div className="create-educational-form-field">
                            <label htmlFor="enrollmentStartDate">Día de inicio</label>
                            <input
                                type="number"
                                id="enrollmentStartDate"
                                name="enrollmentStartDate"
                                value={formData.enrollmentStartDate}
                                onChange={handleInputChange}
                                placeholder="Día"
                                min="1"
                                max="31"
                            />
                        </div>
                        <div className="create-educational-form-field">
                            <label htmlFor="enrollmentStartMonth">Mes</label>
                            <select
                                id="enrollmentStartMonth"
                                name="enrollmentStartMonth"
                                value={formData.enrollmentStartMonth}
                                onChange={handleInputChange}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Enero">Enero</option>
                                <option value="Febrero">Febrero</option>
                                <option value="Marzo">Marzo</option>
                                <option value="Abril">Abril</option>
                                <option value="Mayo">Mayo</option>
                                <option value="Junio">Junio</option>
                                <option value="Julio">Julio</option>
                                <option value="Agosto">Agosto</option>
                                <option value="Septiembre">Septiembre</option>
                                <option value="Octubre">Octubre</option>
                                <option value="Noviembre">Noviembre</option>
                                <option value="Diciembre">Diciembre</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="create-educational-form-row">
                        <div className="create-educational-form-field">
                            <label htmlFor="enrollmentEndDate">Día de finalización</label>
                            <input
                                type="number"
                                id="enrollmentEndDate"
                                name="enrollmentEndDate"
                                value={formData.enrollmentEndDate}
                                onChange={handleInputChange}
                                placeholder="Día"
                                min="1"
                                max="31"
                            />
                        </div>
                        <div className="create-educational-form-field">
                            <label htmlFor="enrollmentEndMonth">Mes</label>
                            <select
                                id="enrollmentEndMonth"
                                name="enrollmentEndMonth"
                                value={formData.enrollmentEndMonth}
                                onChange={handleInputChange}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Enero">Enero</option>
                                <option value="Febrero">Febrero</option>
                                <option value="Marzo">Marzo</option>
                                <option value="Abril">Abril</option>
                                <option value="Mayo">Mayo</option>
                                <option value="Junio">Junio</option>
                                <option value="Julio">Julio</option>
                                <option value="Agosto">Agosto</option>
                                <option value="Septiembre">Septiembre</option>
                                <option value="Octubre">Octubre</option>
                                <option value="Noviembre">Noviembre</option>
                                <option value="Diciembre">Diciembre</option>
                            </select>
                        </div>
                    </div>
                    {errors.enrollmentDates && <span className="create-educational-error-message">{errors.enrollmentDates}</span>}
                </div>
                
                {/* Año escolar */}
                <div className="create-educational-form-section">
                    <h3>Año escolar</h3>
                    
                    <div className="create-educational-form-row">
                        <div className="create-educational-form-field">
                            <label htmlFor="schoolYearStartMonth">Mes de inicio</label>
                            <select
                                id="schoolYearStartMonth"
                                name="schoolYearStartMonth"
                                value={formData.schoolYearStartMonth}
                                onChange={handleInputChange}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Enero">Enero</option>
                                <option value="Febrero">Febrero</option>
                                <option value="Marzo">Marzo</option>
                                <option value="Abril">Abril</option>
                                <option value="Mayo">Mayo</option>
                                <option value="Junio">Junio</option>
                                <option value="Julio">Julio</option>
                                <option value="Agosto">Agosto</option>
                                <option value="Septiembre">Septiembre</option>
                                <option value="Octubre">Octubre</option>
                                <option value="Noviembre">Noviembre</option>
                                <option value="Diciembre">Diciembre</option>
                            </select>
                        </div>
                        <div className="create-educational-form-field">
                            <label htmlFor="schoolYearEndMonth">Mes de finalización</label>
                            <select
                                id="schoolYearEndMonth"
                                name="schoolYearEndMonth"
                                value={formData.schoolYearEndMonth}
                                onChange={handleInputChange}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Enero">Enero</option>
                                <option value="Febrero">Febrero</option>
                                <option value="Marzo">Marzo</option>
                                <option value="Abril">Abril</option>
                                <option value="Mayo">Mayo</option>
                                <option value="Junio">Junio</option>
                                <option value="Julio">Julio</option>
                                <option value="Agosto">Agosto</option>
                                <option value="Septiembre">Septiembre</option>
                                <option value="Octubre">Octubre</option>
                                <option value="Noviembre">Noviembre</option>
                                <option value="Diciembre">Diciembre</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Página web */}
                <div className="create-educational-form-section">
                    <h3>Página web donde ampliar información</h3>
                    <div className="create-educational-form-field">
                        <input
                            type="url"
                            id="websiteUrl"
                            name="websiteUrl"
                            value={formData.websiteUrl}
                            onChange={handleInputChange}
                            placeholder="Escribe aquí tu enlace"
                        />
                        {errors.websiteUrl && <span className="create-educational-error-message">{errors.websiteUrl}</span>}
                    </div>
                </div>
                
                {/* Descripción y requisitos (opcional) */}
                <div className="create-educational-form-section">
                    <h3>Descripción</h3>
                    <div className="create-educational-form-field">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Describe brevemente esta oferta educativa"
                        />
                    </div>
                </div>

                <div className="create-educational-form-actions">
                    <button type="button" onClick={() => navigate(-1)} className="create-educational-cancel-button">
                        Cancelar
                    </button>
                    <button type="submit" className="create-educational-submit-button" disabled={loading}>
                        {loading ? 'Publicando...' : 'Publicar oferta'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEducationalOffer;
