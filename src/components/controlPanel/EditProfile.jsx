import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa';
import './css/EditProfile.css';
import MisOfertasSection from './MisOfertasSection';

// Importar los componentes modulares
import ProfileHeader from './editProfile/ProfileHeader';
import NavigationMenu from './editProfile/NavigationMenu';
import BasicInfoSection from './editProfile/BasicInfoSection';
import ProfessionalTitleSection from './editProfile/ProfessionalTitleSection';
import ProfessionalSummarySection from './editProfile/ProfessionalSummarySection';
import EducationSection from './editProfile/EducationSection';
import ProfessionalFormationSection from './editProfile/ProfessionalFormationSection';
import SkillsSection from './editProfile/SkillsSection';
import SoftwareSection from './editProfile/SoftwareSection';
import JobSearchSection from './editProfile/JobSearchSection';
import ContactSection from './editProfile/ContactSection';
import PDFUploadSection from './editProfile/PDFUploadSection';
import ConfigurationSection from './editProfile/ConfigurationSection';

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
                    <ProfileHeader
                        userData={userData}
                        selectedProfileImage={selectedProfileImage}
                        isEditingProfilePicture={isEditingProfilePicture}
                        isUploadingProfilePicture={isUploadingProfilePicture}
                        handleProfilePictureClick={handleProfilePictureClick}
                        handleSaveProfileImage={handleSaveProfileImage}
                        handleCancelProfileImageEdit={handleCancelProfileImageEdit}
                        profileImageInputRef={profileImageInputRef}
                    />
                    <div className="profile-body">
                        <NavigationMenu
                            activeOption={activeOption}
                            setActiveOption={setActiveOption}
                        />
                        <div className="right-form">
                            {activeOption === "editProfile" && (
                                <>
                                    <BasicInfoSection
                                        isBasicCollapsed={isBasicCollapsed}
                                        setIsBasicCollapsed={setIsBasicCollapsed}
                                        isBasicEditing={isBasicEditing}
                                        setIsBasicEditing={setIsBasicEditing}
                                        basicInfo={basicInfo}
                                        handleBasicInfoChange={handleBasicInfoChange}
                                        updateProfileData={updateProfileData}
                                        countryOptions={countryOptions}
                                    />
                                    <ProfessionalTitleSection
                                        isProfessionalTitleCollapsed={isProfessionalTitleCollapsed}
                                        setIsProfessionalTitleCollapsed={setIsProfessionalTitleCollapsed}
                                        isProfessionalTitleEditing={isProfessionalTitleEditing}
                                        setIsProfessionalTitleEditing={setIsProfessionalTitleEditing}
                                        professionalTitle={professionalTitle}
                                        setProfessionalTitle={setProfessionalTitle}
                                        updateProfileData={updateProfileData}
                                    />
                                    <ProfessionalSummarySection
                                        isSummaryCollapsed={isSummaryCollapsed}
                                        setIsSummaryCollapsed={setIsSummaryCollapsed}
                                        isSummaryEditing={isSummaryEditing}
                                        setIsSummaryEditing={setIsSummaryEditing}
                                        professionalSummary={professionalSummary}
                                        handleProfessionalSummaryChange={handleProfessionalSummaryChange}
                                        updateProfileData={updateProfileData}
                                    />
                                    <EducationSection
                                        isEducationCollapsed={isEducationCollapsed}
                                        setIsEducationCollapsed={setIsEducationCollapsed}
                                        isEducationEditing={isEducationEditing}
                                        setIsEducationEditing={setIsEducationEditing}
                                        educationList={educationList}
                                        handleEducationListChange={handleEducationListChange}
                                        addEducation={addEducation}
                                        removeEducation={removeEducation}
                                        selfTaught={selfTaught}
                                        handleSelfTaughtChange={handleSelfTaughtChange}
                                        updateProfileData={updateProfileData}
                                        institutionOptions={institutionOptions}
                                        currentDate={currentDate}
                                    />
                                    <ProfessionalFormationSection
                                        isProfessionalFormationCollapsed={isProfessionalFormationCollapsed}
                                        setIsProfessionalFormationCollapsed={setIsProfessionalFormationCollapsed}
                                        isProfessionalFormationEditing={isProfessionalFormationEditing}
                                        setIsProfessionalFormationEditing={setIsProfessionalFormationEditing}
                                        professionalFormationList={professionalFormationList}
                                        handleProfessionalFormationChange={handleProfessionalFormationChange}
                                        addProfessionalFormation={addProfessionalFormation}
                                        removeProfessionalFormation={removeProfessionalFormation}
                                        updateProfileData={updateProfileData}
                                        currentDate={currentDate}
                                    />
                                    <SkillsSection
                                        isHabilidadesCollapsed={isHabilidadesCollapsed}
                                        setIsHabilidadesCollapsed={setIsHabilidadesCollapsed}
                                        isHabilidadesEditing={isHabilidadesEditing}
                                        setIsHabilidadesEditing={setIsHabilidadesEditing}
                                        skills={skills}
                                        newSkill={newSkill}
                                        setNewSkill={setNewSkill}
                                        handleSkillKeyDown={handleSkillKeyDown}
                                        removeSkill={removeSkill}
                                        popularSkills={popularSkills}
                                        addPopularSkill={addPopularSkill}
                                        updateProfileData={updateProfileData}
                                    />
                                    <SoftwareSection
                                        isSoftwareCollapsed={isSoftwareCollapsed}
                                        setIsSoftwareCollapsed={setIsSoftwareCollapsed}
                                        isSoftwareEditing={isSoftwareEditing}
                                        setIsSoftwareEditing={setIsSoftwareEditing}
                                        software={software}
                                        newSoftware={newSoftware}
                                        setNewSoftware={setNewSoftware}
                                        handleSoftwareKeyDown={handleSoftwareKeyDown}
                                        removeSoftware={removeSoftware}
                                        popularSoftware={popularSoftware}
                                        addPopularSoftware={addPopularSoftware}
                                        updateProfileData={updateProfileData}
                                    />
                                    <JobSearchSection
                                        isEnBuscaCollapsed={isEnBuscaCollapsed}
                                        setIsEnBuscaCollapsed={setIsEnBuscaCollapsed}
                                        isEnBuscaEditing={isEnBuscaEditing}
                                        setIsEnBuscaEditing={setIsEnBuscaEditing}
                                        contract={contract}
                                        handleContractChange={handleContractChange}
                                        locationType={locationType}
                                        handleLocationChange={handleLocationChange}
                                        updateProfileData={updateProfileData}
                                    />
                                    <ContactSection
                                        isContactCollapsed={isContactCollapsed}
                                        setIsContactCollapsed={setIsContactCollapsed}
                                        isContactEditing={isContactEditing}
                                        setIsContactEditing={setIsContactEditing}
                                        social={social}
                                        handleSocialChange={handleSocialChange}
                                        updateProfileData={updateProfileData}
                                    />
                                    <PDFUploadSection
                                        isPdfEditing={isPdfEditing}
                                        setIsPdfEditing={setIsPdfEditing}
                                        cvFileName={cvFileName}
                                        portfolioFileName={portfolioFileName}
                                        handleFileChange={handleFileChange}
                                        uploadPdfFiles={uploadPdfFiles}
                                        isUploading={isUploading}
                                        userData={userData}
                                        setCvFile={setCvFile}
                                        setCvFileName={setCvFileName}
                                        setPortfolioFile={setPortfolioFile}
                                        setPortfolioFileName={setPortfolioFileName}
                                    />
                                </>
                            )}
                            {activeOption === "misOfertas" && (
                                <MisOfertasSection />
                            )}
                            {activeOption === "configuracion" && (
                                <ConfigurationSection
                                    userData={userData}
                                    isEmailEditing={isEmailEditing}
                                    setIsEmailEditing={setIsEmailEditing}
                                    emailInput={emailInput}
                                    setEmailInput={setEmailInput}
                                    newEmail={newEmail}
                                    setNewEmail={setNewEmail}
                                    confirmEmail={confirmEmail}
                                    setConfirmEmail={setConfirmEmail}
                                    isPasswordEditing={isPasswordEditing}
                                    setIsPasswordEditing={setIsPasswordEditing}
                                    currentPassword={currentPassword}
                                    setCurrentPassword={setCurrentPassword}
                                    newPassword={newPassword}
                                    setNewPassword={setNewPassword}
                                    confirmPassword={confirmPassword}
                                    setConfirmPassword={setConfirmPassword}
                                    error={error}
                                    handleChangePassword={handleChangePassword}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
