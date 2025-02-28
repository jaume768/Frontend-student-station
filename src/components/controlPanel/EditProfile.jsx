import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt, FaBriefcase, FaCog, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import './css/EditProfile.css';
import MisOfertasSection from './MisOfertasSection';

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
    const location = useLocation();
    const [activeOption, setActiveOption] = useState(location.state?.activeMenu || "editProfile");

    useEffect(() => {
        if (location.state?.activeMenu) {
            setActiveOption(location.state.activeMenu);
        }
    }, [location.state]);

    const [userData, setUserData] = useState({
        profilePicture: '/multimedia/usuarioDefault.jpg',
        fullName: 'Nombre Apellido',
        username: 'username123',
        city: 'Ciudad',
        country: 'País',
        email: 'correo@ejemplo.com',
        creativeType: 'Estudiante',
        biography: '',
    });

    const [basicInfo, setBasicInfo] = useState({
        firstName: '',
        lastName: '',
        country: '',
        city: '',
    });
    const [professionalSummary, setProfessionalSummary] = useState('');

    // Múltiples formaciones educativas
    const [educationList, setEducationList] = useState([]);
    const [selfTaught, setSelfTaught] = useState(false);

    // Otros estados (habilidades, software, etc.)
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
    const [software, setSoftware] = useState([]);
    const [newSoftware, setNewSoftware] = useState("");
    const [popularSoftware, setPopularSoftware] = useState([
        "Adobe Photoshop", "Adobe Illustrator", "Adobe Indesign", "Canva", "Clo 3D", "Marvelous Designer",
        "Procreate", "Gerber AccuMark", "Lectra", "Optitex", "Blender", "Asana", "Trello", "SewArt",
        "Tailornova", "Shopify", "ZBrush"
    ]);
    const [contract, setContract] = useState({ practicas: false, tiempoCompleto: false, parcial: false });
    const [locationType, setLocationType] = useState({ presencial: false, remoto: false, hibrido: false });
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

    // Estados de edición
    const [isBasicEditing, setIsBasicEditing] = useState(false);
    const [isSummaryEditing, setIsSummaryEditing] = useState(false);
    const [isEducationEditing, setIsEducationEditing] = useState(false);
    const [isHabilidadesEditing, setIsHabilidadesEditing] = useState(false);
    const [isSoftwareEditing, setIsSoftwareEditing] = useState(false);
    const [isEnBuscaEditing, setIsEnBuscaEditing] = useState(false);
    const [isContactEditing, setIsContactEditing] = useState(false);
    const [isEmailEditing, setIsEmailEditing] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Estados para colapsar secciones
    const [isBasicCollapsed, setIsBasicCollapsed] = useState(false);
    const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
    const [isEducationCollapsed, setIsEducationCollapsed] = useState(false);
    const [isHabilidadesCollapsed, setIsHabilidadesCollapsed] = useState(false);
    const [isSoftwareCollapsed, setIsSoftwareCollapsed] = useState(false);
    const [isEnBuscaCollapsed, setIsEnBuscaCollapsed] = useState(false);
    const [isContactCollapsed, setIsContactCollapsed] = useState(false);

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
                    profilePicture: user.profile?.profilePicture || '/multimedia/usuarioDefault.jpg',
                    fullName: user.fullName,
                    username: user.username,
                    city: user.city,
                    country: user.country,
                    email: user.email,
                    creativeType: getCreativeTypeText(user.creativeType),
                    biography: user.biography || '',
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
                setProfessionalSummary(user.biography || '');
                setEducationList(
                    user.education && Array.isArray(user.education) && user.education.length > 0
                        ? user.education.map(edu => ({
                            ...edu,
                            formationStart: edu.formationStart ? edu.formationStart.split("T")[0] : "",
                            formationEnd: edu.formationEnd ? edu.formationEnd.split("T")[0] : ""
                        }))
                        : [{
                            institution: '',
                            otherInstitution: '',
                            formationName: '',
                            formationStart: '',
                            formationEnd: '',
                            currentlyEnrolled: false
                        }]
                );
                setSkills(user.skills || []);
                setSoftware(user.software || []);
                setContract(user.contract || { practicas: false, tiempoCompleto: false, parcial: false });
                setLocationType(user.locationType || { presencial: false, remoto: false, hibrido: false });
                setSocial(user.social || {
                    emailContacto: "",
                    sitioWeb: "",
                    instagram: "",
                    linkedin: "",
                    behance: "",
                    tumblr: "",
                    youtube: "",
                    pinterest: ""
                });
            } catch (error) {
                console.error('Error al obtener el perfil:', error);
            }
        };
        fetchUserProfile();
    }, []);

    useEffect(() => {
        setEmailInput(userData.email);
    }, [userData.email]);

    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleProfessionalSummaryChange = (e) => {
        setProfessionalSummary(e.target.value);
    };

    const handleEducationListChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedList = educationList.map((edu, i) =>
            i === index ? { ...edu, [name]: type === 'checkbox' ? checked : value } : edu
        );
        setEducationList(updatedList);
    };

    const handleSelfTaughtChange = (e) => {
        setSelfTaught(e.target.checked);
    };

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
        if (isHabilidadesEditing && skills.length < 12 && !skills.includes(skill)) {
            setSkills([...skills, skill]);
            setPopularSkills(popularSkills.filter(s => s !== skill));
        }
    };

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
        if (isSoftwareEditing && software.length < 12 && !software.includes(sw)) {
            setSoftware([...software, sw]);
            setPopularSoftware(popularSoftware.filter(s => s !== sw));
        }
    };

    const handleContractChange = (e) => {
        const { name, checked } = e.target;
        setContract(prev => ({ ...prev, [name]: checked }));
    };

    const handleLocationChange = (e) => {
        const { name, checked } = e.target;
        setLocationType(prev => ({ ...prev, [name]: checked }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setSocial(prev => ({ ...prev, [name]: value }));
    };

    const addEducation = () => {
        const emptyEducation = {
            institution: '',
            otherInstitution: '',
            formationName: '',
            formationStart: '',
            formationEnd: '',
            currentlyEnrolled: false
        };
        setEducationList([...educationList, emptyEducation]);
    };

    const removeEducation = (index) => {
        if (educationList.length > 1) {
            const updated = educationList.filter((_, i) => i !== index);
            setEducationList(updated);
        }
    };

    const updateProfileData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const updates = {
                fullName: `${basicInfo.firstName} ${basicInfo.lastName}`,
                city: basicInfo.city,
                country: basicInfo.country,
                biography: professionalSummary,
                education: educationList,
                skills: skills,
                software: software,
                contract: contract,
                locationType: locationType,
                social: social
            };
            const response = await axios.put(`${backendUrl}/api/users/profile`, updates, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedUser = response.data.user;
            setUserData({
                ...userData,
                fullName: updatedUser.fullName,
                city: updatedUser.city,
                country: updatedUser.country,
                biography: updatedUser.biography,
            });
            if (updatedUser.education) {
                setEducationList(updatedUser.education);
            }
            if (updatedUser.skills) {
                setSkills(updatedUser.skills);
            }
            if (updatedUser.software) {
                setSoftware(updatedUser.software);
            }
            if (updatedUser.contract) {
                setContract(updatedUser.contract);
            }
            if (updatedUser.locationType) {
                setLocationType(updatedUser.locationType);
            }
            if (updatedUser.social) {
                setSocial(updatedUser.social);
            }
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            userData, basicInfo, professionalSummary, educationList, selfTaught,
            skills, software, contract, locationType, social
        });
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
                                        <div className="section-header-edit">
                                            <h3>Información básica</h3>
                                            <button type="button" className="collapse-toggle" onClick={() => setIsBasicCollapsed(!isBasicCollapsed)}>
                                                {isBasicCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                                            </button>
                                        </div>
                                        {!isBasicCollapsed && (
                                            <div className="section-content">
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
                                                        onClick={() => {
                                                            if (isBasicEditing) {
                                                                updateProfileData();
                                                            }
                                                            setIsBasicEditing(!isBasicEditing);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                    {/* 3.2 Resumen profesional */}
                                    <section className="form-section">
                                        <div className="section-header-edit">
                                            <h3>Resumen profesional</h3>
                                            <button type="button" className="collapse-toggle" onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}>
                                                {isSummaryCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                                            </button>
                                        </div>
                                        {!isSummaryCollapsed && (
                                            <div className="section-content">
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
                                                        onClick={() => {
                                                            if (isSummaryEditing) {
                                                                updateProfileData();
                                                            }
                                                            setIsSummaryEditing(!isSummaryEditing);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                    {/* 3.3 Información educativa y formación */}
                                    <section className="form-section">
                                        <div className="section-header-edit">
                                            <h3>Información educativa y formación</h3>
                                            <button type="button" className="collapse-toggle" onClick={() => setIsEducationCollapsed(!isEducationCollapsed)}>
                                                {isEducationCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                                            </button>
                                        </div>
                                        {!isEducationCollapsed && (
                                            <div className="section-content">
                                                {educationList.map((edu, index) => (
                                                    <div key={index} className="education-entry">
                                                        <div className="form-group">
                                                            <label>Institución educativa</label>
                                                            <select
                                                                name="institution"
                                                                value={edu.institution}
                                                                onChange={(e) => handleEducationListChange(index, e)}
                                                                disabled={!isEducationEditing || selfTaught}
                                                            >
                                                                <option value="">Selecciona una opción</option>
                                                                {institutionOptions.map((inst, idx) => (
                                                                    <option key={idx} value={inst}>{inst}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>¿No encuentras tu escuela o universidad?</label>
                                                            <input
                                                                type="text"
                                                                name="otherInstitution"
                                                                placeholder="Introduce el nombre de tu escuela o universidad"
                                                                value={edu.otherInstitution}
                                                                onChange={(e) => handleEducationListChange(index, e)}
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
                                                                value={edu.formationName}
                                                                onChange={(e) => handleEducationListChange(index, e)}
                                                                disabled={!isEducationEditing || selfTaught}
                                                            />
                                                        </div>
                                                        <div className="form-group date-group">
                                                            <label>Comienzo de la formación</label>
                                                            <input
                                                                type="date"
                                                                name="formationStart"
                                                                value={edu.formationStart}
                                                                onChange={(e) => handleEducationListChange(index, e)}
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
                                                                value={edu.formationEnd}
                                                                onChange={(e) => handleEducationListChange(index, e)}
                                                                min="1940-01-01"
                                                                max={currentDate}
                                                                disabled={!isEducationEditing || selfTaught || edu.currentlyEnrolled}
                                                            />
                                                        </div>
                                                        <div className="form-group checkbox-group-search">
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="currentlyEnrolled"
                                                                    checked={edu.currentlyEnrolled}
                                                                    onChange={(e) => handleEducationListChange(index, e)}
                                                                    disabled={!isEducationEditing}
                                                                />
                                                                Actualmente me encuentro en esta formación
                                                            </label>
                                                            {educationList.length > 1 && isEducationEditing && (
                                                                <button type="button" className="remove-education" onClick={() => removeEducation(index)}>
                                                                    <FaTrash />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <hr />
                                                    </div>
                                                ))}
                                                <div className="button-row">
                                                    <div className="button-container">
                                                        {isEducationEditing && (
                                                            <button
                                                                type="button"
                                                                className="add-formation"
                                                                onClick={addEducation}
                                                                style={{ backgroundColor: "#989898", border: "none" }}
                                                            >
                                                                + Añadir formación
                                                            </button>
                                                        )}
                                                        <EditButton
                                                            isEditing={isEducationEditing}
                                                            onClick={() => {
                                                                if (isEducationEditing) {
                                                                    updateProfileData();
                                                                }
                                                                setIsEducationEditing(!isEducationEditing);
                                                            }}
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
                                                <small className="info-text">Puedes añadir tantas formaciones como desees.</small>
                                            </div>
                                        )}
                                    </section>
                                    {/* 3.4 Habilidades */}
                                    <section className="form-section">
                                        <div className="section-header-edit">
                                            <h3>Habilidades</h3>
                                            <button type="button" className="collapse-toggle" onClick={() => setIsHabilidadesCollapsed(!isHabilidadesCollapsed)}>
                                                {isHabilidadesCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                                            </button>
                                        </div>
                                        {!isHabilidadesCollapsed && (
                                            <div className="section-content">
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
                                                            <div
                                                                key={index}
                                                                className="tag popular-tag"
                                                                onClick={() => { if (isHabilidadesEditing) addPopularSkill(skill); }}
                                                                style={{ cursor: isHabilidadesEditing ? 'pointer' : 'default' }}
                                                            >
                                                                {skill} <span className="add-tag">+</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <small className="info-text">Añade un máximo de 12 habilidades.</small>
                                                <div className="button-container">
                                                    <EditButton
                                                        isEditing={isHabilidadesEditing}
                                                        onClick={() => {
                                                            if (isHabilidadesEditing) {
                                                                updateProfileData();
                                                            }
                                                            setIsHabilidadesEditing(!isHabilidadesEditing);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                    {/* 3.5 Software */}
                                    <section className="form-section">
                                        <div className="section-header-edit">
                                            <h3>Software</h3>
                                            <button type="button" className="collapse-toggle" onClick={() => setIsSoftwareCollapsed(!isSoftwareCollapsed)}>
                                                {isSoftwareCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                                            </button>
                                        </div>
                                        {!isSoftwareCollapsed && (
                                            <div className="section-content">
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
                                                            <div
                                                                key={index}
                                                                className="tag popular-tag"
                                                                onClick={() => { if (isSoftwareEditing) addPopularSoftware(sw); }}
                                                                style={{ cursor: isSoftwareEditing ? 'pointer' : 'default' }}
                                                            >
                                                                {sw} <span className="add-tag">+</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <small className="info-text">Añade un máximo de 12 softwares.</small>
                                                <div className="button-container">
                                                    <EditButton
                                                        isEditing={isSoftwareEditing}
                                                        onClick={() => {
                                                            if (isSoftwareEditing) {
                                                                updateProfileData();
                                                            }
                                                            setIsSoftwareEditing(!isSoftwareEditing);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                    {/* 3.6 En busca de... */}
                                    <section className="form-section">
                                        <div className="section-header-edit">
                                            <h3>En busca de...</h3>
                                            <button type="button" className="collapse-toggle" onClick={() => setIsEnBuscaCollapsed(!isEnBuscaCollapsed)}>
                                                {isEnBuscaCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                                            </button>
                                        </div>
                                        {!isEnBuscaCollapsed && (
                                            <div className="section-content">
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
                                                        onClick={() => {
                                                            if (isEnBuscaEditing) {
                                                                updateProfileData();
                                                            }
                                                            setIsEnBuscaEditing(!isEnBuscaEditing);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                    {/* 3.7 Contacto y redes sociales */}
                                    <section className="form-section">
                                        <div className="section-header-edit">
                                            <h3>Contacto y redes sociales</h3>
                                            <button type="button" className="collapse-toggle" onClick={() => setIsContactCollapsed(!isContactCollapsed)}>
                                                {isContactCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                                            </button>
                                        </div>
                                        {!isContactCollapsed && (
                                            <div className="section-content">
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
                                                        onClick={() => {
                                                            if (isContactEditing) {
                                                                updateProfileData();
                                                            }
                                                            setIsContactEditing(!isContactEditing);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
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
                                    <MisOfertasSection />
                                </section>
                            )}
                            {activeOption === "configuracion" && (
                                <>
                                    {/* Sección para modificar email */}
                                    <section className="form-section">
                                        <h3>Modifica tu email</h3>
                                        {!isEmailEditing ? (
                                            <>
                                                <div className="form-group">
                                                    <label>Email de contacto</label>
                                                    <input
                                                        type="email"
                                                        placeholder="emailderegistro@gmail.com"
                                                        value={emailInput}
                                                        onChange={(e) => setEmailInput(e.target.value)}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="button-container">
                                                    <button
                                                        type="button"
                                                        className="edit-data-button"
                                                        onClick={() => setIsEmailEditing(true)}
                                                    >
                                                        Modificar email
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="form-group">
                                                    <label>Nueva email de contacto</label>
                                                    <input
                                                        type="email"
                                                        placeholder="Introduce tu nuevo email"
                                                        value={newEmail}
                                                        onChange={(e) => setNewEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Confirma tu email</label>
                                                    <input
                                                        type="email"
                                                        placeholder="Confirma tu nuevo email"
                                                        value={confirmEmail}
                                                        onChange={(e) => setConfirmEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="button-container">
                                                    <button
                                                        type="button"
                                                        className="edit-data-button"
                                                        style={{ background: 'green', color: 'white' }}
                                                        onClick={() => {
                                                            // Validar que newEmail y confirmEmail coincidan
                                                            setIsEmailEditing(false);
                                                        }}
                                                    >
                                                        Confirmar el cambio de email
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </section>
                                    {/* Sección para cambiar contraseña */}
                                    <section className="form-section">
                                        <h3>Cambiar contraseña</h3>
                                        {!isPasswordEditing ? (
                                            <>
                                                <div className="form-group">
                                                    <label>Tu contraseña</label>
                                                    <input
                                                        type="password"
                                                        placeholder="*************"
                                                        value={""}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="button-container">
                                                    <button
                                                        type="button"
                                                        className="edit-data-button"
                                                        onClick={() => setIsPasswordEditing(true)}
                                                    >
                                                        Cambiar mi contraseña
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="form-group">
                                                    <label>Nueva contraseña</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Introduce tu nueva contraseña"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Confirma tu contraseña</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Confirma tu nueva contraseña"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>
                                                <div className="button-container">
                                                    <button
                                                        type="button"
                                                        className="edit-data-button"
                                                        style={{ background: 'green', color: 'white' }}
                                                        onClick={() => {
                                                            // Validar y confirmar el cambio de contraseña
                                                            setIsPasswordEditing(false);
                                                        }}
                                                    >
                                                        Confirmar el cambio de contraseña
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </section>
                                    {/* Sección para eliminar perfil */}
                                    <section className="form-section-final">
                                        <h3>Elimina tu perfil</h3>
                                        <div className="form-group">
                                            <label>Borrar cuenta</label>
                                            <p style={{ color: '#4c85ff' }}>
                                                Eliminar tu cuenta significa que perderás el acceso a todos tus datos y servicios asociados. Si tienes alguna duda o inquietud, te recomendamos contactar con nuestro soporte antes de proceder: studentstationspain@gmail.com
                                            </p>
                                        </div>
                                        <div className="button-container">
                                            <button
                                                type="button"
                                                className="edit-data-button"
                                                onClick={() => {
                                                    // Activar proceso de borrado de cuenta
                                                }}
                                            >
                                                Borrar mi cuenta
                                            </button>
                                        </div>
                                    </section>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
