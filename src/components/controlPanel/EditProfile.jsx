import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPencilAlt, FaBriefcase, FaCog } from 'react-icons/fa';
import './css/EditProfile.css';

const getCreativeTypeText = (type) => {
    switch (type) {
        case 1: return "Estudiante";
        case 2: return "Graduado";
        case 3: return "Estilista";
        case 4: return "Diseñador de marca";
        case 5: return "Otro";
        default: return "";
    }
};

// Componente de botón sin efecto hover, controlado por la prop "isEditing"
// Se agrega la clase "save-mode" cuando isEditing es true para aplicar el estilo verde
const EditButton = ({ isEditing, onClick }) => (
    <button
        type="button"
        className={`edit-data-button ${isEditing ? "save-mode" : ""}`}
        onClick={onClick}
    >
        {isEditing ? "Guardar datos" : "Editar datos"}
    </button>
);

const EditProfile = () => {
    // Datos del perfil
    const [userData, setUserData] = useState({
        profilePicture: '/multimedia/usuarioDefault.jpg',
        fullName: 'Nombre Apellido',
        username: 'username123',
        city: 'Ciudad',
        country: 'País',
        email: 'correo@ejemplo.com',
        creativeType: 'Estudiante',
        profile: { summary: '' },
    });

    // Sección Información básica
    const [basicInfo, setBasicInfo] = useState({
        firstName: '',
        lastName: '',
        country: '',
        city: '',
    });
    // Resumen profesional
    const [professionalSummary, setProfessionalSummary] = useState('');
    // Educación y formación
    const [education, setEducation] = useState({
        institution: '',
        otherInstitution: '',
        formationName: '',
        formationStart: '',
        formationEnd: '',
        currentlyEnrolled: false,
    });
    const [selfTaught, setSelfTaught] = useState(false);
    // Habilidades
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [popularSkills, setPopularSkills] = useState([
        "Patronaje industrial", "Confección básica", "Confección intermedia", "Confección avanzada",
        "Creación de prototipos", "Conocimiento textil y materiales", "Conocimiento y aplicación de tendencias",
        "Desarrollo fichas técnicas", "Diseño de estampados", "Marketing", "Branding", "Ilustración de moda",
        "Gestión de proveedores y materiales", "Edición y retoque de imágenes", "Fotografía de moda y dirección de arte",
        "Organización de desfiles", "Gestión del tiempo", "Desarrollo de identidad de marca", "Comunicación visual",
        "Redacción y periodismo", "Aplicación textil", "Redacción descripción producto e-commerce"
    ]);
    // Software
    const [software, setSoftware] = useState([]);
    const [newSoftware, setNewSoftware] = useState("");
    const [popularSoftware, setPopularSoftware] = useState([
        "Adobe Photoshop", "Adobe Illustrator", "Adobe Indesign", "Canva", "Clo 3D", "Marvelous Designer",
        "Procreate", "Gerber AccuMark", "Lectra", "Optitex", "Blender", "Asana", "Trello", "SewArt",
        "Tailornova", "Shopify", "ZBrush"
    ]);
    // En busca de...
    const [contract, setContract] = useState({ practicas: false, tiempoCompleto: false, parcial: false });
    const [locationType, setLocationType] = useState({ presencial: false, remoto: false, hibrido: false });
    // Contacto y redes sociales
    const [social, setSocial] = useState({
        emailContacto: "",
        sitioWeb: "",
        instagram: "",
        linkedin: "",
        behance: "",
        tumblr: "",
        youtube: "",
        pinterest: ""
    });

    // Control de sección activa (Editar perfil, Mis ofertas, Configuración)
    const [activeOption, setActiveOption] = useState("editProfile");

    // Estados para controlar el modo edición de cada sección
    const [isBasicEditing, setIsBasicEditing] = useState(false);
    const [isSummaryEditing, setIsSummaryEditing] = useState(false);
    const [isEducationEditing, setIsEducationEditing] = useState(false);
    const [isHabilidadesEditing, setIsHabilidadesEditing] = useState(false);
    const [isSoftwareEditing, setIsSoftwareEditing] = useState(false);
    const [isEnBuscaEditing, setIsEnBuscaEditing] = useState(false);
    const [isContactEditing, setIsContactEditing] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const user = response.data;
                setUserData({
                    profilePicture: user.profile.profilePicture || '/multimedia/usuarioDefault.jpg',
                    fullName: user.fullName,
                    username: user.username,
                    city: user.city,
                    country: user.country,
                    email: user.email,
                    creativeType: getCreativeTypeText(user.creativeType),
                    profile: { summary: user.profile.summary || '' },
                });
                if (user.fullName) {
                    const names = user.fullName.split(' ');
                    setBasicInfo({
                        firstName: names[0] || '',
                        lastName: names.slice(1).join(' ') || '',
                        country: user.country || '',
                        city: user.city || '',
                    });
                }
                setProfessionalSummary(user.profile.summary || '');
            } catch (error) {
                console.error('Error al obtener el perfil:', error);
            }
        };
        fetchUserProfile();
    }, []);

    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfessionalSummaryChange = (e) => {
        setProfessionalSummary(e.target.value);
    };

    const handleEducationChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEducation((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSelfTaughtChange = (e) => {
        setSelfTaught(e.target.checked);
    };

    // Manejo de habilidades
    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (newSkill.trim() && skills.length < 12 && !skills.includes(newSkill.trim())) {
                setSkills([...skills, newSkill.trim()]);
                setNewSkill("");
            }
        }
    };

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const addPopularSkill = (skill) => {
        if (skills.length < 12 && !skills.includes(skill)) {
            setSkills([...skills, skill]);
            setPopularSkills(popularSkills.filter(s => s !== skill));
        }
    };

    // Manejo de software
    const handleSoftwareKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (newSoftware.trim() && software.length < 12 && !software.includes(newSoftware.trim())) {
                setSoftware([...software, newSoftware.trim()]);
                setNewSoftware("");
            }
        }
    };

    const removeSoftware = (index) => {
        setSoftware(software.filter((_, i) => i !== index));
    };

    const addPopularSoftware = (sw) => {
        if (software.length < 12 && !software.includes(sw)) {
            setSoftware([...software, sw]);
            setPopularSoftware(popularSoftware.filter(s => s !== sw));
        }
    };

    // En busca de...
    const handleContractChange = (e) => {
        const { name, checked } = e.target;
        setContract((prev) => ({ ...prev, [name]: checked }));
    };

    const handleLocationChange = (e) => {
        const { name, checked } = e.target;
        setLocationType((prev) => ({ ...prev, [name]: checked }));
    };

    // Contacto y redes sociales
    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setSocial((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            userData, basicInfo, professionalSummary, education, selfTaught,
            skills, software, contract, locationType, social
        });
        // Aquí se puede realizar el PUT a /api/users/profile con los datos actualizados
    };

    const currentDate = new Date().toISOString().split('T')[0];

    const countryOptions = [
        "Estados Unidos", "Reino Unido", "Canadá", "Australia", "Alemania",
        "Francia", "España", "Italia", "China", "Japón", "Brasil", "México",
        "India", "Rusia", "Corea del Sur"
    ];

    const institutionOptions = [
        "Universidad de Harvard", "Universidad de Oxford", "Universidad de Stanford",
        "MIT", "Universidad de Cambridge", "Universidad de Tokyo", "Universidad de Salamanca",
        "Universidad de Buenos Aires", "Universidad de Sydney", "Universidad de Pekín"
    ];

    return (
        <div className="edit-profile-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="profile-section">
                    {/* Banner principal */}
                    <div className="profile-banner">
                        <div className="banner-left">
                            <img src={userData.profilePicture} alt="Perfil" className="profile-picture" />
                            <div className="profile-info">
                                <h2 className="profile-name">{userData.fullName}</h2>
                                <p className="profile-username">{userData.username}</p>
                                <p className="profile-location">{userData.city}, {userData.country}</p>
                                <p className="profile-email">{userData.email}</p>
                            </div>
                        </div>
                        <div className="banner-right">
                            <span className="creative-type">{userData.creativeType}</span>
                        </div>
                    </div>
                    {/* Cuerpo del perfil */}
                    <div className="profile-body">
                        <div className="left-options">
                            <div
                                className={`option ${activeOption === "editProfile" ? "active" : ""}`}
                                onClick={() => setActiveOption("editProfile")}
                            >
                                <FaPencilAlt className="option-icon" />
                                <span>Editar mi perfil</span>
                            </div>
                            <div
                                className={`option option-offers ${activeOption === "misOfertas" ? "active" : ""}`}
                                onClick={() => setActiveOption("misOfertas")}
                            >
                                <FaBriefcase className="option-icon" />
                                <span>Mis ofertas</span>
                            </div>
                            <div
                                className={`option option-settings ${activeOption === "configuracion" ? "active" : ""}`}
                                onClick={() => setActiveOption("configuracion")}
                            >
                                <FaCog className="option-icon" />
                                <span>Configuración</span>
                            </div>
                        </div>
                        <div className="right-form">
                            {activeOption === "editProfile" && (
                                <>
                                    {/* 3.1 Información básica */}
                                    <section className="form-section">
                                        <h3>Información básica</h3>
                                        <div className="form-group">
                                            <label>Nombre</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="Introduce tu nombre"
                                                value={basicInfo.firstName}
                                                onChange={handleBasicInfoChange}
                                                disabled={!isBasicEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellidos</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Introduce tus apellidos"
                                                value={basicInfo.lastName}
                                                onChange={handleBasicInfoChange}
                                                disabled={!isBasicEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>País de residencia</label>
                                            <select
                                                name="country"
                                                value={basicInfo.country}
                                                onChange={handleBasicInfoChange}
                                                disabled={!isBasicEditing}
                                            >
                                                <option value="">Selecciona una opción</option>
                                                {countryOptions.map((country, index) => (
                                                    <option key={index} value={country}>{country}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Ciudad de residencia</label>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="Introduce tu ciudad"
                                                value={basicInfo.city}
                                                onChange={handleBasicInfoChange}
                                                disabled={!isBasicEditing}
                                            />
                                        </div>
                                        <div className="button-container">
                                            <EditButton
                                                isEditing={isBasicEditing}
                                                onClick={() => setIsBasicEditing(!isBasicEditing)}
                                            />
                                        </div>
                                    </section>
                                    {/* 3.2 Resumen profesional */}
                                    <section className="form-section">
                                        <h3>Resumen profesional</h3>
                                        <h4>Describe tu recorrido profesional</h4>
                                        <div className="form-group">
                                            <textarea
                                                name="professionalSummary"
                                                placeholder="Escribe tu resumen profesional..."
                                                value={professionalSummary}
                                                onChange={handleProfessionalSummaryChange}
                                                maxLength={350}
                                                disabled={!isSummaryEditing}
                                            />
                                            <small className="char-count" style={{ color: professionalSummary.length === 350 ? 'red' : '#4c85ff' }}>
                                                {professionalSummary.length === 350 ? "Tu texto supera los 350 caracteres" : "Debe tener un máximo de 350 caracteres"}
                                            </small>
                                        </div>
                                        <div className="button-container">
                                            <EditButton
                                                isEditing={isSummaryEditing}
                                                onClick={() => setIsSummaryEditing(!isSummaryEditing)}
                                            />
                                        </div>
                                    </section>
                                    {/* 3.3 Información educativa y formación */}
                                    <section className="form-section">
                                        <h3>Información educativa y formación</h3>
                                        <div className="form-group">
                                            <label>Institución educativa</label>
                                            <select
                                                name="institution"
                                                value={education.institution}
                                                onChange={handleEducationChange}
                                                disabled={!isEducationEditing || selfTaught}
                                            >
                                                <option value="">Selecciona una opción</option>
                                                {institutionOptions.map((inst, index) => (
                                                    <option key={index} value={inst}>{inst}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>¿No encuentras tu escuela o universidad?</label>
                                            <input
                                                type="text"
                                                name="otherInstitution"
                                                placeholder="Introduce el nombre de tu escuela o universidad"
                                                value={education.otherInstitution}
                                                onChange={handleEducationChange}
                                                disabled={!isEducationEditing || selfTaught}
                                            />
                                            <small className="info-text">Por el momento contamos con un número limitado de escuelas y universidades.</small>
                                        </div>
                                        <div className="form-group">
                                            <label>Nombre de la formación que has cursado</label>
                                            <input
                                                type="text"
                                                name="formationName"
                                                placeholder="Introduce el nombre de la formación"
                                                value={education.formationName}
                                                onChange={handleEducationChange}
                                                disabled={!isEducationEditing || selfTaught}
                                            />
                                        </div>
                                        <div className="form-group date-group">
                                            <label>Comienzo de la formación</label>
                                            <input
                                                type="date"
                                                name="formationStart"
                                                placeholder="dd / mm / yyyy"
                                                value={education.formationStart}
                                                onChange={handleEducationChange}
                                                min="1940-01-01"
                                                max={currentDate}
                                                disabled={!isEducationEditing || selfTaught}
                                            />
                                        </div>
                                        <div className="form-group date-group">
                                            <label>Finalización de la formación</label>
                                            <input
                                                type="date"
                                                name="formationEnd"
                                                placeholder="dd / mm / yyyy"
                                                value={education.formationEnd}
                                                onChange={handleEducationChange}
                                                min="1940-01-01"
                                                max={currentDate}
                                                disabled={!isEducationEditing || selfTaught || education.currentlyEnrolled}
                                            />
                                        </div>
                                        <div className="form-group checkbox-group-search">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="currentlyEnrolled"
                                                    checked={education.currentlyEnrolled}
                                                    onChange={handleEducationChange}
                                                    disabled={!isEducationEditing}
                                                />
                                                Actualmente me encuentro en esta formación
                                            </label>
                                        </div>
                                        <div className="button-row">
                                            <div className="button-container">
                                                <button type="button" className="add-formation">+ Añadir formación</button>
                                                <EditButton
                                                    isEditing={isEducationEditing}
                                                    onClick={() => setIsEducationEditing(!isEducationEditing)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group checkbox-group-search">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="selfTaught"
                                                    checked={selfTaught}
                                                    onChange={handleSelfTaughtChange}
                                                    disabled={!isEducationEditing}
                                                />
                                                He adquirido todos mis conocimientos de forma autodidacta
                                            </label>
                                        </div>
                                        <small className="info-text">Por el momento puedes añadir hasta un máximo de tres.</small>
                                    </section>
                                    {/* 3.4 Habilidades */}
                                    <section className="form-section">
                                        <h3>Habilidades</h3>
                                        <div className="form-group">
                                            <label>Añade tus habilidades</label>
                                            <input
                                                type="text"
                                                name="newSkill"
                                                placeholder="Escribe tu habilidad aquí..."
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyDown={handleSkillKeyDown}
                                                disabled={!isHabilidadesEditing}
                                            />
                                            <small className="info-text">Añade una nueva habilidad presionando “enter”.</small>
                                        </div>
                                        <div className="tags-container">
                                            {skills.map((skill, index) => (
                                                <div key={index} className="tag">
                                                    {skill}
                                                    <span className="remove-tag" onClick={() => removeSkill(index)}>×</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="form-group">
                                            <label>Habilidades populares</label>
                                            <div className="popular-tags">
                                                {popularSkills.map((skill, index) => (
                                                    <div key={index} className="tag popular-tag" onClick={() => addPopularSkill(skill)}>
                                                        {skill} <span className="add-tag">+</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <small className="info-text">Añade un máximo de 12 habilidades.</small>
                                        <div className="button-container">
                                            <EditButton
                                                isEditing={isHabilidadesEditing}
                                                onClick={() => setIsHabilidadesEditing(!isHabilidadesEditing)}
                                            />
                                        </div>
                                    </section>
                                    {/* 3.5 Software */}
                                    <section className="form-section">
                                        <h3>Software</h3>
                                        <div className="form-group">
                                            <label>Añade un nuevo software</label>
                                            <input
                                                type="text"
                                                name="newSoftware"
                                                placeholder="Escribe el nombre del software..."
                                                value={newSoftware}
                                                onChange={(e) => setNewSoftware(e.target.value)}
                                                onKeyDown={handleSoftwareKeyDown}
                                                disabled={!isSoftwareEditing}
                                            />
                                            <small className="info-text">Añade un nuevo software presionando “enter”.</small>
                                        </div>
                                        <div className="tags-container">
                                            {software.map((sw, index) => (
                                                <div key={index} className="tag">
                                                    {sw}
                                                    <span className="remove-tag" onClick={() => removeSoftware(index)}>×</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="form-group">
                                            <label>Software populares</label>
                                            <div className="popular-tags">
                                                {popularSoftware.map((sw, index) => (
                                                    <div key={index} className="tag popular-tag" onClick={() => addPopularSoftware(sw)}>
                                                        {sw} <span className="add-tag">+</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <small className="info-text">Añade un máximo de 12 softwares.</small>
                                        <div className="button-container">
                                            <EditButton
                                                isEditing={isSoftwareEditing}
                                                onClick={() => setIsSoftwareEditing(!isSoftwareEditing)}
                                            />
                                        </div>
                                    </section>
                                    {/* 3.6 En busca de... */}
                                    <section className="form-section">
                                        <h3>En busca de...</h3>
                                        <h4>Tipo de contrato</h4>
                                        <div className="form-group checkbox-group-search">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="practicas"
                                                    checked={contract.practicas}
                                                    onChange={handleContractChange}
                                                    disabled={!isEnBuscaEditing}
                                                />
                                                Prácticas
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="tiempoCompleto"
                                                    checked={contract.tiempoCompleto}
                                                    onChange={handleContractChange}
                                                    disabled={!isEnBuscaEditing}
                                                />
                                                Tiempo completo
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="parcial"
                                                    checked={contract.parcial}
                                                    onChange={handleContractChange}
                                                    disabled={!isEnBuscaEditing}
                                                />
                                                Parcial
                                            </label>
                                        </div>
                                        <h4>Tipo de ubicación</h4>
                                        <div className="form-group checkbox-group-search">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="presencial"
                                                    checked={locationType.presencial}
                                                    onChange={handleLocationChange}
                                                    disabled={!isEnBuscaEditing}
                                                />
                                                Presencial
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="remoto"
                                                    checked={locationType.remoto}
                                                    onChange={handleLocationChange}
                                                    disabled={!isEnBuscaEditing}
                                                />
                                                Remoto
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="hibrido"
                                                    checked={locationType.hibrido}
                                                    onChange={handleLocationChange}
                                                    disabled={!isEnBuscaEditing}
                                                />
                                                Híbrido
                                            </label>
                                        </div>
                                        <div className="button-container">
                                            <EditButton
                                                isEditing={isEnBuscaEditing}
                                                onClick={() => setIsEnBuscaEditing(!isEnBuscaEditing)}
                                            />
                                        </div>
                                    </section>
                                    {/* 3.7 Contacto y redes sociales */}
                                    <section className="form-section">
                                        <h3>Contacto y redes sociales</h3>
                                        <div className="form-group">
                                            <label>Email de Contacto</label>
                                            <input
                                                type="text"
                                                name="emailContacto"
                                                placeholder="Introduce el email de Contacto"
                                                value={social.emailContacto}
                                                onChange={handleSocialChange}
                                                disabled={!isContactEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Sitio web</label>
                                            <input
                                                type="text"
                                                name="sitioWeb"
                                                placeholder="Introduce el Sitio web"
                                                value={social.sitioWeb}
                                                onChange={handleSocialChange}
                                                disabled={!isContactEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Instagram</label>
                                            <input
                                                type="text"
                                                name="instagram"
                                                placeholder="Introduce tu Instagram"
                                                value={social.instagram}
                                                onChange={handleSocialChange}
                                                disabled={!isContactEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Linkedin</label>
                                            <input
                                                type="text"
                                                name="linkedin"
                                                placeholder="Introduce tu Linkedin"
                                                value={social.linkedin}
                                                onChange={handleSocialChange}
                                                disabled={!isContactEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Behance</label>
                                            <input
                                                type="text"
                                                name="behance"
                                                placeholder="Introduce tu Behance"
                                                value={social.behance}
                                                onChange={handleSocialChange}
                                                disabled={!isContactEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tumblr</label>
                                            <input
                                                type="text"
                                                name="tumblr"
                                                placeholder="Introduce tu Tumblr"
                                                value={social.tumblr}
                                                onChange={handleSocialChange}
                                                disabled={!isContactEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Youtube</label>
                                            <input
                                                type="text"
                                                name="youtube"
                                                placeholder="Introduce tu Youtube"
                                                value={social.youtube}
                                                onChange={handleSocialChange}
                                                disabled={!isContactEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Pinterest</label>
                                            <input
                                                type="text"
                                                name="pinterest"
                                                placeholder="Introduce tu Pinterest"
                                                value={social.pinterest}
                                                onChange={handleSocialChange}
                                                disabled={!isContactEditing}
                                            />
                                        </div>
                                        <div className="button-container">
                                            <EditButton
                                                isEditing={isContactEditing}
                                                onClick={() => setIsContactEditing(!isContactEditing)}
                                            />
                                        </div>
                                    </section>
                                    {/* 3.8 Mi CV y Portfolio PDF */}
                                    <section className="form-section-final">
                                        <h3>Mi CV y Portfolio PDF</h3>
                                        <small className="info-text">Esta opción todavía no está disponible</small>
                                        <div className="form-group">
                                            <label>CV</label>
                                            <div className="file-input">
                                                <input type="file" name="cv" accept="application/pdf" disabled />
                                                <span className="upload-icon">📤</span>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Portfolio</label>
                                            <div className="file-input">
                                                <input type="file" name="portfolio" accept="application/pdf" disabled />
                                                <span className="upload-icon">📤</span>
                                            </div>
                                        </div>
                                        <div className="button-container">
                                            <EditButton onClick={() => { /* Guardar CV y Portfolio */ }} isEditing={false} />
                                        </div>
                                    </section>
                                </>
                            )}
                            {activeOption === "misOfertas" && (
                                <section className="form-section">
                                    <h3>Mis ofertas</h3>
                                    <p>Aquí se mostrarán las ofertas guardadas o publicadas por el usuario.</p>
                                    <div className="button-container">
                                        <EditButton onClick={() => { /* Guardar cambios en ofertas, si aplica */ }} isEditing={false} />
                                    </div>
                                </section>
                            )}
                            {activeOption === "configuracion" && (
                                <section className="form-section">
                                    <h3>Configuración</h3>
                                    <p>Aquí se mostrarán las opciones de configuración del perfil.</p>
                                    <div className="button-container">
                                        <EditButton onClick={() => { /* Guardar configuración */ }} isEditing={false} />
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
