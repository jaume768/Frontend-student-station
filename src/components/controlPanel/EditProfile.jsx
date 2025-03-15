import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt, FaBriefcase, FaCog, FaChevronDown, FaChevronUp, FaTrash, FaCamera, FaCheck, FaTimes } from 'react-icons/fa';
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

    // Estados para la sección de formación educativa
    const [educationList, setEducationList] = useState([]);
    const [selfTaught, setSelfTaught] = useState(false);

    // Nuevo estado para la sección de Formación Profesional
    const [professionalFormationList, setProfessionalFormationList] = useState([{
        trainingName: '',
        institution: '',
        trainingStart: '',
        trainingEnd: '',
        currentlyInProgress: false
    }]);

    // Estados para otras secciones
    const [skills, setSkills] = useState([]);
    const [currentPassword, setCurrentPassword] = useState("");
    const [error, setError] = useState("");
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
    const [professionalTitle, setProfessionalTitle] = useState('');
    const [isProfessionalTitleEditing, setIsProfessionalTitleEditing] = useState(false);
    const [isProfessionalTitleCollapsed, setIsProfessionalTitleCollapsed] = useState(false);

    // Estados para la nueva sección de Formación Profesional
    const [isProfessionalFormationEditing, setIsProfessionalFormationEditing] = useState(false);
    const [isProfessionalFormationCollapsed, setIsProfessionalFormationCollapsed] = useState(false);

    // Estados para CV y Portfolio
    const [cvFile, setCvFile] = useState(null);
    const [portfolioFile, setPortfolioFile] = useState(null);
    const [isPdfEditing, setIsPdfEditing] = useState(false);
    const [cvFileName, setCvFileName] = useState('');
    const [portfolioFileName, setPortfolioFileName] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Estados para la edición de la foto de perfil
    const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [isUploadingProfilePicture, setIsUploadingProfilePicture] = useState(false);
    const profileImageInputRef = useRef(null);

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
                    googleId: user.googleId,
                    hasPassword: user.hasPassword,
                });
                setProfessionalTitle(user.professionalTitle || '');
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
                // Si el usuario tiene formación profesional, se asigna; de lo contrario se usa el valor por defecto.
                if (user.professionalFormation && Array.isArray(user.professionalFormation) && user.professionalFormation.length > 0) {
                    setProfessionalFormationList(
                        user.professionalFormation.map(item => ({
                            ...item,
                            trainingStart: item.trainingStart ? item.trainingStart.split("T")[0] : "",
                            trainingEnd: item.trainingEnd ? item.trainingEnd.split("T")[0] : ""
                        }))
                    );
                }
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
                // Actualizar nombres de archivo si están disponibles
                if (user.cvUrl) {
                    setCvFileName(user.cvUrl.split('/').pop());
                }
                if (user.portfolioUrl) {
                    setPortfolioFileName(user.portfolioUrl.split('/').pop());
                }
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

    const handleChangePassword = async () => {
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas nuevas no coinciden.");
            return;
        }
        if (!userData.googleId && !currentPassword) {
            setError("Debes ingresar tu contraseña actual.");
            return;
        }
        try {
            const token = localStorage.getItem("authToken");
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const payload = { newPassword, confirmPassword };
            if (!userData.googleId) {
                payload.currentPassword = currentPassword;
            }
            const response = await axios.put(
                `${backendUrl}/api/users/change-password`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            setNewPassword("");
            setConfirmPassword("");
            setCurrentPassword("");
            setIsPasswordEditing(false);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Error al cambiar la contraseña.");
            }
        }
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

    // Handlers para Formación Profesional
    const handleProfessionalFormationChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedList = professionalFormationList.map((item, i) =>
            i === index ? { ...item, [name]: type === 'checkbox' ? checked : value } : item
        );
        setProfessionalFormationList(updatedList);
    };

    const addProfessionalFormation = () => {
        setProfessionalFormationList([...professionalFormationList, {
            trainingName: '',
            institution: '',
            trainingStart: '',
            trainingEnd: '',
            currentlyInProgress: false
        }]);
    };

    const removeProfessionalFormation = (index) => {
        if (professionalFormationList.length > 1) {
            setProfessionalFormationList(professionalFormationList.filter((_, i) => i !== index));
        }
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
                professionalFormation: professionalFormationList,
                skills: skills,
                software: software,
                contract: contract,
                locationType: locationType,
                social: social,
                professionalTitle: professionalTitle,
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
            if (updatedUser.professionalTitle) {
                setProfessionalTitle(updatedUser.professionalTitle);
            }
            if (updatedUser.professionalFormation) {
                setProfessionalFormationList(updatedUser.professionalFormation);
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
            professionalFormationList, skills, software, contract, locationType, social
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

    // Manejador para cambios en los archivos
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            const file = files[0];
            if (file.type !== 'application/pdf') {
                alert('Solo se permiten archivos PDF');
                return;
            }
            
            // Tamaño máximo: 10MB
            if (file.size > 10 * 1024 * 1024) {
                alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
                return;
            }
            
            if (name === 'cv') {
                setCvFile(file);
                setCvFileName(file.name);
            } else if (name === 'portfolio') {
                setPortfolioFile(file);
                setPortfolioFileName(file.name);
            }
        }
    };

    // Función para subir archivos PDF
    const uploadPdfFiles = async () => {
        if (!cvFile && !portfolioFile) {
            alert('No se ha seleccionado ningún archivo');
            return;
        }

        setIsUploading(true);
        try {
            const token = localStorage.getItem('authToken');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            let updatedData = {};
            
            // Subir CV si está seleccionado
            if (cvFile) {
                const cvFormData = new FormData();
                cvFormData.append('file', cvFile);
                cvFormData.append('type', 'cv');
                
                const cvResponse = await axios.post(
                    `${backendUrl}/api/users/upload-pdf`, 
                    cvFormData, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                if (cvResponse.data.success) {
                    updatedData.cvUrl = cvResponse.data.fileUrl;
                    alert('CV subido con éxito');
                }
            }
            
            // Subir Portfolio si está seleccionado
            if (portfolioFile) {
                const portfolioFormData = new FormData();
                portfolioFormData.append('file', portfolioFile);
                portfolioFormData.append('type', 'portfolio');
                
                const portfolioResponse = await axios.post(
                    `${backendUrl}/api/users/upload-pdf`, 
                    portfolioFormData, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                if (portfolioResponse.data.success) {
                    updatedData.portfolioUrl = portfolioResponse.data.fileUrl;
                    alert('Portfolio subido con éxito');
                }
            }
            
            // Actualizar el perfil con las nuevas URLs
            if (Object.keys(updatedData).length > 0) {
                await axios.put(
                    `${backendUrl}/api/users/profile`, 
                    updatedData, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                // Refrescar los datos del usuario
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
                            googleId: user.googleId,
                            hasPassword: user.hasPassword,
                        });
                        // Actualizar datos del usuario (reusando código existente)
                        if (user.fullName) {
                            const names = user.fullName.split(' ');
                            setBasicInfo({
                                firstName: names[0] || '',
                                lastName: names.slice(1).join(' ') || '',
                                country: user.country || '',
                                city: user.city || '',
                            });
                        }
                        // Actualizar nombres de archivo si están disponibles
                        if (user.cvUrl) {
                            setCvFileName(user.cvUrl.split('/').pop());
                        }
                        if (user.portfolioUrl) {
                            setPortfolioFileName(user.portfolioUrl.split('/').pop());
                        }
                    } catch (error) {
                        console.error('Error al obtener el perfil:', error);
                    }
                };
                fetchUserProfile();
            }
            
            setIsPdfEditing(false);
            setCvFile(null);
            setPortfolioFile(null);
        } catch (error) {
            console.error('Error al subir archivos PDF:', error);
            alert('Error al subir los archivos. Inténtalo de nuevo.');
        } finally {
            setIsUploading(false);
        }
    };

    // Manejador para abrir el selector de imagen de perfil
    const handleProfilePictureClick = () => {
        if (profileImageInputRef.current) {
            profileImageInputRef.current.click();
        }
    };

    // Manejador para el cambio de archivo de imagen de perfil
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedProfileImage(URL.createObjectURL(file));
            setProfileImageFile(file);
            setIsEditingProfilePicture(true);
        }
    };

    // Manejador para guardar la imagen de perfil
    const handleSaveProfileImage = async () => {
        if (!profileImageFile) {
            return;
        }
        
        setIsUploadingProfilePicture(true);
        
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            const formData = new FormData();
            formData.append('file', profileImageFile);
            
            const response = await fetch(`${backendUrl}/api/users/profile-picture`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Actualizar la imagen de perfil en el estado
                setUserData(prev => ({
                    ...prev,
                    profilePicture: data.profilePicture || prev.profilePicture
                }));
                
                // Limpiar el estado de edición
                setSelectedProfileImage(null);
                setProfileImageFile(null);
                setIsEditingProfilePicture(false);
            } else {
                console.error("Error al actualizar la foto:", data.error);
            }
        } catch (err) {
            console.error("Error en la actualización de la foto:", err);
        } finally {
            setIsUploadingProfilePicture(false);
        }
    };

    // Manejador para cancelar la edición de la imagen de perfil
    const handleCancelProfileImageEdit = () => {
        setSelectedProfileImage(null);
        setProfileImageFile(null);
        setIsEditingProfilePicture(false);
    };

    return (
        <div className="edit-profile-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="profile-section">
                    <div className="profile-banner">
                        <div className="banner-left">
                            <div className="profile-picture-container" onClick={handleProfilePictureClick}>
                                <img src={selectedProfileImage || userData.profilePicture} alt="Perfil" className="profile-picture-edit" />
                                <div className="profile-picture-overlay">
                                    <FaCamera />
                                    <span>Cambiar foto</span>
                                </div>
                            </div>
                            <div className="profile-info">
                                <h2 className="profile-name">{userData.fullName}</h2>
                                <p className="profile-username">{userData.username}</p>
                                <p className="profile-location">{userData.city}, {userData.country}</p>
                                <p className="profile-email">{userData.email}</p>
                            </div>
                        </div>
                        <div className="banner-right">
                            <span className="creative-type">{userData.creativeType}</span>
                            <input 
                                type="file" 
                                id="profile-picture-input"
                                name="profile-picture"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                ref={profileImageInputRef}
                                style={{ display: 'none' }}
                            />
                            {isEditingProfilePicture && (
                                <div className="profile-picture-edit-actions">
                                    <button 
                                        type="button" 
                                        className="save-profile-picture-button"
                                        onClick={handleSaveProfileImage}
                                        disabled={isUploadingProfilePicture}
                                    >
                                        {isUploadingProfilePicture ? 'Guardando...' : 'Guardar'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="cancel-profile-picture-edit-button"
                                        onClick={handleCancelProfileImageEdit}
                                        disabled={isUploadingProfilePicture}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
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
                                    <section className="form-section">
                                        <div className="section-header-edit">
                                            <h3>Título profesional</h3>
                                            <button
                                                type="button"
                                                className="collapse-toggle"
                                                onClick={() => setIsProfessionalTitleCollapsed(!isProfessionalTitleCollapsed)}
                                            >
                                                {isProfessionalTitleCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                                            </button>
                                        </div>
                                        {!isProfessionalTitleCollapsed && (
                                            <div className="section-content">
                                                <div className="form-group">
                                                    <label>Título profesional</label>
                                                    <input
                                                        type="text"
                                                        name="professionalTitle"
                                                        placeholder="Introduce tu título profesional"
                                                        value={professionalTitle}
                                                        onChange={(e) => setProfessionalTitle(e.target.value)}
                                                        disabled={!isProfessionalTitleEditing}
                                                    />
                                                </div>
                                                <div className="button-container">
                                                    <EditButton
                                                        isEditing={isProfessionalTitleEditing}
                                                        onClick={() => {
                                                            if (isProfessionalTitleEditing) {
                                                                updateProfileData();
                                                            }
                                                            setIsProfessionalTitleEditing(!isProfessionalTitleEditing);
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
                                                                style={{ backgroundColor: "#989898", border: "none", padding: "5px" }}
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
                                    <section className="form-section">
                                        <div className="section-header-edit">
                                            <h3>Formación Profesional</h3>
                                            <button type="button" className="collapse-toggle" onClick={() => setIsProfessionalFormationCollapsed(!isProfessionalFormationCollapsed)}>
                                                {isProfessionalFormationCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                                            </button>
                                        </div>
                                        {!isProfessionalFormationCollapsed && (
                                            <div className="section-content">
                                                {professionalFormationList.map((item, index) => (
                                                    <div key={index} className="professional-formation-entry">
                                                        <div className="form-group">
                                                            <label>Nombre de la formación</label>
                                                            <input
                                                                type="text"
                                                                name="trainingName"
                                                                placeholder="Introduce el nombre de la formación"
                                                                value={item.trainingName}
                                                                onChange={(e) => handleProfessionalFormationChange(index, e)}
                                                                disabled={!isProfessionalFormationEditing}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Institución</label>
                                                            <input
                                                                type="text"
                                                                name="institution"
                                                                placeholder="Introduce el nombre de la institución"
                                                                value={item.institution}
                                                                onChange={(e) => handleProfessionalFormationChange(index, e)}
                                                                disabled={!isProfessionalFormationEditing}
                                                            />
                                                        </div>
                                                        <div className="form-group date-group">
                                                            <label>Inicio</label>
                                                            <input
                                                                type="date"
                                                                name="trainingStart"
                                                                value={item.trainingStart}
                                                                onChange={(e) => handleProfessionalFormationChange(index, e)}
                                                                min="1940-01-01"
                                                                max={currentDate}
                                                                disabled={!isProfessionalFormationEditing}
                                                            />
                                                        </div>
                                                        <div className="form-group date-group">
                                                            <label>Fin</label>
                                                            <input
                                                                type="date"
                                                                name="trainingEnd"
                                                                value={item.trainingEnd}
                                                                onChange={(e) => handleProfessionalFormationChange(index, e)}
                                                                min="1940-01-01"
                                                                max={currentDate}
                                                                disabled={!isProfessionalFormationEditing || item.currentlyInProgress}
                                                            />
                                                        </div>
                                                        <div className="form-group checkbox-group-search">
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="currentlyInProgress"
                                                                    checked={item.currentlyInProgress}
                                                                    onChange={(e) => handleProfessionalFormationChange(index, e)}
                                                                    disabled={!isProfessionalFormationEditing}
                                                                />
                                                                Actualmente en curso
                                                            </label>
                                                            {professionalFormationList.length > 1 && isProfessionalFormationEditing && (
                                                                <button type="button" className="remove-formation" onClick={() => removeProfessionalFormation(index)}>
                                                                    <FaTrash />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <hr />
                                                    </div>
                                                ))}
                                                <div className="button-row">
                                                    <div className="button-container">
                                                        {isProfessionalFormationEditing && (
                                                            <button
                                                                type="button"
                                                                className="add-formation"
                                                                onClick={addProfessionalFormation}
                                                                style={{ backgroundColor: "#989898", border: "none" }}
                                                            >
                                                                + Añadir formación profesional
                                                            </button>
                                                        )}
                                                        <EditButton
                                                            isEditing={isProfessionalFormationEditing}
                                                            onClick={() => {
                                                                if (isProfessionalFormationEditing) {
                                                                    updateProfileData();
                                                                }
                                                                setIsProfessionalFormationEditing(!isProfessionalFormationEditing);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <small className="info-text">Puedes añadir tantas formaciones profesionales como desees.</small>
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
                                                        placeholder="Introduce tu Instagram (url)"
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
                                                        placeholder="Introduce tu Linkedin (url)"
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
                                                        placeholder="Introduce tu Behance (url)"
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
                                                        placeholder="Introduce tu Tumblr (url)"
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
                                                        placeholder="Introduce tu Youtube (url)"
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
                                                        placeholder="Introduce tu Pinterest (url)"
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
                                    <section className="form-section-final pdf-files-section">
                                        <div className="pdf-section-header">
                                            <h3>Mi CV y Portfolio PDF</h3>
                                            {userData.cvUrl || userData.portfolioUrl ? 
                                                <div className="pdf-preview-links">
                                                    {userData.cvUrl && (
                                                        <a 
                                                            href={userData.cvUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="view-pdf-link"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                                <circle cx="12" cy="12" r="3"></circle>
                                                            </svg>
                                                            Descargar CV actual
                                                        </a>
                                                    )}
                                                    {userData.portfolioUrl && (
                                                        <a 
                                                            href={userData.portfolioUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="view-pdf-link"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                                <circle cx="12" cy="12" r="3"></circle>
                                                            </svg>
                                                            Ver Portfolio actual
                                                        </a>
                                                    )}
                                                </div> : null
                                            }
                                        </div>
                                        <div className="pdf-upload-container">
                                            <div className="form-group pdf-upload-group">
                                                <label>CV (PDF)</label>
                                                <div className={`pdf-file-input ${isPdfEditing ? 'active' : ''}`}>
                                                    <input 
                                                        type="file" 
                                                        id="cv-file"
                                                        name="cv" 
                                                        accept="application/pdf" 
                                                        onChange={handleFileChange}
                                                        disabled={!isPdfEditing}
                                                    />
                                                    <label htmlFor="cv-file" className="pdf-file-label">
                                                        <span className="pdf-upload-icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h3l-4 4-4-4h3z"/>
                                                            </svg>
                                                        </span>
                                                        <span className="pdf-upload-text">
                                                            {cvFileName ? 'Cambiar archivo' : 'Seleccionar CV'}
                                                        </span>
                                                    </label>
                                                    {cvFileName && (
                                                        <div className="pdf-file-name">
                                                            <span className="pdf-file-icon">📄</span>
                                                            {cvFileName}
                                                            {isPdfEditing && (
                                                                <button 
                                                                    type="button" 
                                                                    className="pdf-clear-file" 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCvFile(null);
                                                                        setCvFileName('');
                                                                    }}
                                                                >
                                                                    ✕
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <small className="info-text">Formato: PDF • Tamaño máximo: 10MB</small>
                                            </div>

                                            <div className="form-group pdf-upload-group">
                                                <label>Portfolio (PDF)</label>
                                                <div className={`pdf-file-input ${isPdfEditing ? 'active' : ''}`}>
                                                    <input 
                                                        type="file" 
                                                        id="portfolio-file"
                                                        name="portfolio" 
                                                        accept="application/pdf" 
                                                        onChange={handleFileChange}
                                                        disabled={!isPdfEditing}
                                                    />
                                                    <label htmlFor="portfolio-file" className="pdf-file-label">
                                                        <span className="pdf-upload-icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h3l-4 4-4-4h3z"/>
                                                            </svg>
                                                        </span>
                                                        <span className="pdf-upload-text">
                                                            {portfolioFileName ? 'Cambiar archivo' : 'Seleccionar Portfolio'}
                                                        </span>
                                                    </label>
                                                    {portfolioFileName && (
                                                        <div className="pdf-file-name">
                                                            <span className="pdf-file-icon">📄</span>
                                                            {portfolioFileName}
                                                            {isPdfEditing && (
                                                                <button 
                                                                    type="button" 
                                                                    className="pdf-clear-file" 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setPortfolioFile(null);
                                                                        setPortfolioFileName('');
                                                                    }}
                                                                >
                                                                    ✕
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <small className="info-text">Formato: PDF • Tamaño máximo: 10MB</small>
                                            </div>
                                        </div>
                                        <div className="button-container">
                                            {isUploading ? (
                                                <button 
                                                    type="button" 
                                                    className="edit-data-button" 
                                                    disabled
                                                >
                                                    Subiendo...
                                                </button>
                                            ) : (
                                                <EditButton 
                                                    isEditing={isPdfEditing} 
                                                    onClick={() => {
                                                        if (isPdfEditing) {
                                                            uploadPdfFiles();
                                                        }
                                                        setIsPdfEditing(!isPdfEditing);
                                                    }} 
                                                />
                                            )}
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
                                    <section className="form-section">
                                        <h3>Cambiar contraseña</h3>
                                        {isPasswordEditing ? (
                                            <>
                                                {(userData.googleId && !userData.hasPassword) ? (
                                                    <p>
                                                        Tu cuenta ha sido creada a través de Google, prueba a crear una
                                                        contraseña.
                                                    </p>
                                                ) : (
                                                    <div className="form-group">
                                                        <label>Contraseña actual</label>
                                                        <input
                                                            type="password"
                                                            placeholder="Introduce tu contraseña actual"
                                                            value={currentPassword}
                                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                                        />
                                                    </div>
                                                )}
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
                                                {error && <p style={{ color: "red" }}>{error}</p>}
                                                <div className="button-container">
                                                    <button
                                                        type="button"
                                                        className="edit-data-button"
                                                        style={{ background: "green", color: "white" }}
                                                        onClick={handleChangePassword}
                                                    >
                                                        Confirmar el cambio de contraseña
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="form-group">
                                                    <label>Tu contraseña</label>
                                                    <input
                                                        type="password"
                                                        placeholder="*************"
                                                        value={userData.googleId ? "" : "*************"}
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
