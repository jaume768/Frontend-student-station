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
import ProfessionalMilestonesSection from './editProfile/ProfessionalMilestonesSection';
import CompanyContactSection from './editProfile/CompanyContactSection';

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
        role: '', // Added role field
        creativeType: 'Estudiante',
        biography: '',
        professionalType: null,
        companyName: ''
    });

    const [basicInfo, setBasicInfo] = useState({
        firstName: '',
        lastName: '',
        country: '',
        city: '',
        companyName: ''
    });

    // Determinar si el usuario es una empresa
    const [isCompany, setIsCompany] = useState(false);

    // Estado para el resumen profesional
    const [professionalSummary, setProfessionalSummary] = useState('');

    // Estados para las nuevas secciones de empresa
    const [professionalMilestones, setProfessionalMilestones] = useState([]);
    const [companyTags, setCompanyTags] = useState([]);
    const [offersPractices, setOffersPractices] = useState(false);
    const [isProfessionalMilestonesCollapsed, setIsProfessionalMilestonesCollapsed] = useState(false);
    const [isProfessionalMilestonesEditing, setIsProfessionalMilestonesEditing] = useState(false);
    const [isCompanyContactCollapsed, setIsCompanyContactCollapsed] = useState(false);
    const [isCompanyContactEditing, setIsCompanyContactEditing] = useState(false);

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
    const [newSkill, setNewSkill] = useState("");
    
    // Lista original de habilidades populares (constante para mantener el orden original)
    const originalPopularSkills = [
        "Patronaje industrial", "Confección básica", "Confección intermedia", "Confección avanzada",
        "Creación de prototipos", "Conocimiento textil y materiales", "Conocimiento y aplicación de tendencias",
        "Desarrollo fichas técnicas", "Diseño de estampados", "Marketing", "Branding", "Ilustración de moda",
        "Gestión de proveedores y materiales", "Edición y retoque de imágenes", "Fotografía de moda y dirección de arte",
        "Organización de desfiles", "Gestión del tiempo", "Desarrollo de identidad de marca", "Comunicación visual",
        "Redacción y periodismo", "Aplicación textil", "Redacción descripción producto e-commerce"
    ];
    
    // Estado para las habilidades populares filtradas
    const [popularSkills, setPopularSkills] = useState([...originalPopularSkills]);
    
    const [software, setSoftware] = useState([]);
    const [newSoftware, setNewSoftware] = useState("");
    
    // Lista original de software popular (constante para mantener el orden original)
    const originalPopularSoftware = [
        "Adobe Photoshop", "Adobe Illustrator", "Adobe Indesign", "Canva", "Clo 3D", "Marvelous Designer",
        "Procreate", "Gerber AccuMark", "Lectra", "Optitex", "Blender", "Asana", "Trello", "SewArt",
        "Tailornova", "Shopify", "ZBrush"
    ];
    
    // Estado para el software popular filtrado
    const [popularSoftware, setPopularSoftware] = useState([...originalPopularSoftware]);
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
    const [error, setError] = useState("");

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
    const [isPdfEditing, setIsPdfEditing] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const [portfolioFile, setPortfolioFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingCV, setUploadingCV] = useState(false);
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
    const [cvFileName, setCvFileName] = useState('');
    const [portfolioFileName, setPortfolioFileName] = useState('');

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
                    role: user.role,
                    creativeType: getCreativeTypeText(user.creativeType),
                    biography: user.biography || '',
                    professionalType: user.professionalType,
                    companyName: user.companyName || ''
                });
                setProfessionalTitle(user.professionalTitle || '');
                if (user.fullName) {
                    const names = user.fullName.split(' ');
                    setBasicInfo({
                        firstName: names[0] || '',
                        lastName: names.slice(1).join(' ') || '',
                        country: user.country || '',
                        city: user.city || '',
                        companyName: user.companyName || ''
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
                if (user.professionalFormation && Array.isArray(user.professionalFormation) && user.professionalFormation.length > 0) {
                    setProfessionalFormationList(
                        user.professionalFormation.map(item => ({
                            ...item,
                            trainingStart: item.trainingStart ? item.trainingStart.split("T")[0] : "",
                            trainingEnd: item.trainingEnd ? item.trainingEnd.split("T")[0] : ""
                        }))
                    );
                }
                const userSkills = user.skills || [];
                const userSoftware = user.software || [];
                setSkills(userSkills);
                setSoftware(userSoftware);
                
                // Filtrar las habilidades populares para no mostrar las que ya tiene el usuario
                setPopularSkills(originalPopularSkills.filter(skill => !userSkills.includes(skill)));
                
                // Filtrar el software popular para no mostrar los que ya tiene el usuario
                setPopularSoftware(originalPopularSoftware.filter(sw => !userSoftware.includes(sw)));
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
                if (user.cvUrl) {
                    setCvFileName(user.cvUrl.split('/').pop());
                }
                if (user.portfolioUrl) {
                    setPortfolioFileName(user.portfolioUrl.split('/').pop());
                }
                const userIsCompany = user.professionalType === 1 || user.professionalType === 2 || user.professionalType === 4;
                setIsCompany(userIsCompany);
                if (userIsCompany) {
                    if (user.professionalMilestones && Array.isArray(user.professionalMilestones)) {
                        setProfessionalMilestones(user.professionalMilestones);
                    } else {
                        setProfessionalMilestones([{
                            date: '',
                            name: '',
                            entity: '',
                            description: ''
                        }]);
                    }
                    if (user.companyTags && Array.isArray(user.companyTags)) {
                        setCompanyTags(user.companyTags);
                    } else {
                        setCompanyTags([]);
                    }
                    setOffersPractices(user.offersPractices || false);
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

    const handleUpdateEmail = async () => {
        if (newEmail !== confirmEmail) {
            setError("Los emails no coinciden");
            return;
        }
        if (!newEmail || !confirmEmail) {
            setError("Por favor, completa todos los campos");
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.put(
                `${backendUrl}/api/users/email`,
                { email: newEmail },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (response.data.success) {
                setUserData({
                    ...userData,
                    email: newEmail
                });
                setNewEmail("");
                setConfirmEmail("");
                setIsEmailEditing(false);
                setError("");
                alert("Email actualizado con éxito");
            }
        } catch (error) {
            console.error("Error al actualizar el email:", error);
            setError(error.response?.data?.message || "Error al actualizar el email");
        }
    };

    const handleProfessionalSummaryChange = (e) => {
        setProfessionalSummary(e.target.value);
    };

    const handleEducationListChange = (index, e) => {
        if (!Array.isArray(educationList)) return;
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
            const currentSkills = Array.isArray(skills) ? skills : [];
            if (newSkill.trim() && currentSkills.length < 12 && !currentSkills.includes(newSkill.trim())) {
                setSkills([...currentSkills, newSkill.trim()]);
                setNewSkill("");
            }
        }
    };

    const removeSkill = (index) => {
        if (!Array.isArray(skills)) return;
        const skillToRemove = skills[index];
        setSkills(skills.filter((_, i) => i !== index));
        
        // Si la habilidad eliminada estaba en la lista original de habilidades populares
        if (originalPopularSkills.includes(skillToRemove)) {
            // Encontrar la posición original de la habilidad en la lista original
            const originalIndex = originalPopularSkills.indexOf(skillToRemove);
            
            // Crear una nueva lista con la habilidad insertada en su posición original
            const newPopularSkills = [...popularSkills];
            
            // Encontrar la posición correcta para insertar la habilidad
            let insertIndex = 0;
            for (let i = 0; i < originalIndex; i++) {
                if (newPopularSkills.includes(originalPopularSkills[i])) {
                    insertIndex = newPopularSkills.indexOf(originalPopularSkills[i]) + 1;
                }
            }
            
            // Insertar la habilidad en la posición correcta
            newPopularSkills.splice(insertIndex, 0, skillToRemove);
            setPopularSkills(newPopularSkills);
        }
    };

    const addPopularSkill = (skill) => {
        const currentSkills = Array.isArray(skills) ? skills : [];
        if (isHabilidadesEditing && currentSkills.length < 12 && !currentSkills.includes(skill)) {
            setSkills([...currentSkills, skill]);
            setPopularSkills(popularSkills.filter(s => s !== skill));
        }
    };

    const handleSoftwareKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const currentSoftware = Array.isArray(software) ? software : [];
            if (newSoftware.trim() && currentSoftware.length < 12 && !currentSoftware.includes(newSoftware.trim())) {
                setSoftware([...currentSoftware, newSoftware.trim()]);
                setNewSoftware("");
            }
        }
    };

    const removeSoftware = (index) => {
        if (!Array.isArray(software)) return;
        const softwareToRemove = software[index];
        setSoftware(software.filter((_, i) => i !== index));
        
        // Si el software eliminado estaba en la lista original de software popular
        if (originalPopularSoftware.includes(softwareToRemove)) {
            // Encontrar la posición original del software en la lista original
            const originalIndex = originalPopularSoftware.indexOf(softwareToRemove);
            
            // Crear una nueva lista con el software insertado en su posición original
            const newPopularSoftware = [...popularSoftware];
            
            // Encontrar la posición correcta para insertar el software
            let insertIndex = 0;
            for (let i = 0; i < originalIndex; i++) {
                if (newPopularSoftware.includes(originalPopularSoftware[i])) {
                    insertIndex = newPopularSoftware.indexOf(originalPopularSoftware[i]) + 1;
                }
            }
            
            // Insertar el software en la posición correcta
            newPopularSoftware.splice(insertIndex, 0, softwareToRemove);
            setPopularSoftware(newPopularSoftware);
        }
    };

    const addPopularSoftware = (sw) => {
        const currentSoftware = Array.isArray(software) ? software : [];
        if (isSoftwareEditing && currentSoftware.length < 12 && !currentSoftware.includes(sw)) {
            setSoftware([...currentSoftware, sw]);
            setPopularSoftware(popularSoftware.filter(s => s !== sw));
        }
    };

    const handleContractChange = (e) => {
        const { name, checked } = e.target;
        setContract(prev => ({ ...(prev || {}), [name]: checked }));
    };

    const handleLocationChange = (e) => {
        const { name, checked } = e.target;
        setLocationType(prev => ({ ...(prev || {}), [name]: checked }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setSocial(prev => ({ ...(prev || {}), [name]: value }));
    };

    const handleProfessionalFormationChange = (index, e) => {
        if (!Array.isArray(professionalFormationList)) return;
        const { name, value, type, checked } = e.target;
        const updatedList = professionalFormationList.map((item, i) =>
            i === index ? { ...item, [name]: type === 'checkbox' ? checked : value } : item
        );
        setProfessionalFormationList(updatedList);
    };

    const addProfessionalFormation = () => {
        const currentList = Array.isArray(professionalFormationList) ? professionalFormationList : [];
        setProfessionalFormationList([...currentList, {
            trainingName: '',
            institution: '',
            trainingStart: '',
            trainingEnd: '',
            currentlyInProgress: false
        }]);
    };

    const removeProfessionalFormation = (index) => {
        if (!Array.isArray(professionalFormationList)) return;
        if (professionalFormationList.length > 1) {
            setProfessionalFormationList(professionalFormationList.filter((_, i) => i !== index));
        }
    };

    const addEducation = () => {
        const currentList = Array.isArray(educationList) ? educationList : [];
        // Limitar a un máximo de 3 secciones de formación educativa
        if (currentList.length >= 3) return;
        
        const emptyEducation = {
            institution: '',
            otherInstitution: '',
            formationName: '',
            formationStart: '',
            formationEnd: '',
            currentlyEnrolled: false
        };
        setEducationList([...currentList, emptyEducation]);
    };

    const removeEducation = (index) => {
        if (!Array.isArray(educationList)) return;
        if (educationList.length > 1) {
            setEducationList(educationList.filter((_, i) => i !== index));
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
                education: Array.isArray(educationList) ? educationList : [],
                professionalFormation: Array.isArray(professionalFormationList) ? professionalFormationList : [],
                skills: Array.isArray(skills) ? skills : [],
                software: Array.isArray(software) ? software : [],
                contract: contract || {},
                locationType: locationType || {},
                social: social || {},
                professionalTitle: professionalTitle,
                companyName: basicInfo.companyName,
                companyTags: Array.isArray(companyTags) ? companyTags : [],
                offersPractices
            };
            if (isCompany) {
                updates.professionalMilestones = Array.isArray(professionalMilestones) ? professionalMilestones : [];
            }
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
            if (updatedUser.companyName) {
                setBasicInfo(prev => ({ ...prev, companyName: updatedUser.companyName }));
            }
            if (updatedUser.companyTags) {
                setCompanyTags(updatedUser.companyTags);
            }
            if (updatedUser.offersPractices !== undefined) {
                setOffersPractices(updatedUser.offersPractices);
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

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length === 0) return;
        const file = files[0];
        if (file.type !== 'application/pdf') {
            alert('Solo se permiten archivos PDF');
            return;
        }
        if (name === 'cv') {
            setCvFile(file);
            setCvFileName(file.name);
        } else if (name === 'portfolio') {
            setPortfolioFile(file);
            setPortfolioFileName(file.name);
        }
    };

    const uploadPdfFiles = async () => {
        if (!cvFile && !portfolioFile) {
            setIsPdfEditing(false);
            return;
        }
        setIsUploading(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (cvFile) {
                setUploadingCV(true);
                const cvFormData = new FormData();
                cvFormData.append('file', cvFile);
                const cvResponse = await axios.put(`${backendUrl}/api/users/cv`, cvFormData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (cvResponse.data.cvUrl) {
                    setCvFileName(cvResponse.data.cvUrl.split('/').pop());
                }
                setUploadingCV(false);
            }
            if (portfolioFile) {
                setUploadingPortfolio(true);
                const portfolioFormData = new FormData();
                portfolioFormData.append('file', portfolioFile);
                const portfolioResponse = await axios.put(`${backendUrl}/api/users/portfolio`, portfolioFormData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (portfolioResponse.data.portfolioUrl) {
                    setPortfolioFileName(portfolioResponse.data.portfolioUrl.split('/').pop());
                }
                setUploadingPortfolio(false);
            }
            setCvFile(null);
            setPortfolioFile(null);
            setIsPdfEditing(false);
        } catch (error) {
            console.error('Error al subir archivos PDF:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleProfilePictureClick = () => {
        if (profileImageInputRef.current) {
            profileImageInputRef.current.click();
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedProfileImage(URL.createObjectURL(file));
            setProfileImageFile(file);
            setIsEditingProfilePicture(true);
        }
    };

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
                setUserData(prev => ({
                    ...prev,
                    profilePicture: data.profilePicture || prev.profilePicture
                }));
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

    const handleCancelProfileImageEdit = () => {
        setSelectedProfileImage(null);
        setProfileImageFile(null);
        setIsEditingProfilePicture(false);
    };

    const handleAddMilestone = () => {
        const currentMilestones = Array.isArray(professionalMilestones) ? professionalMilestones : [];
        setProfessionalMilestones([
            ...currentMilestones,
            {
                date: '',
                name: '',
                entity: '',
                description: ''
            }
        ]);
    };

    const handleMilestoneChange = (index, e) => {
        if (!Array.isArray(professionalMilestones)) return;
        const { name, value } = e.target;
        const updatedMilestones = [...professionalMilestones];
        updatedMilestones[index] = {
            ...updatedMilestones[index],
            [name]: value
        };
        setProfessionalMilestones(updatedMilestones);
    };

    const handleRemoveMilestone = (index) => {
        if (!Array.isArray(professionalMilestones)) return;
        setProfessionalMilestones(professionalMilestones.filter((_, i) => i !== index));
    };

    const handleAddTag = (tag) => {
        const currentTags = Array.isArray(companyTags) ? companyTags : [];
        if (currentTags.length < 3 && !currentTags.includes(tag)) {
            setCompanyTags([...currentTags, tag]);
        }
    };

    const handleRemoveTag = (index) => {
        if (!Array.isArray(companyTags)) return;
        setCompanyTags(companyTags.filter((_, i) => i !== index));
    };

    return (
        <div className="edit-profile-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="profile-section">
                    <div className="profile-body">
                        <NavigationMenu
                            activeOption={activeOption}
                            setActiveOption={setActiveOption}
                            userData={userData}
                            selectedProfileImage={selectedProfileImage}
                            isEditingProfilePicture={isEditingProfilePicture}
                            isUploadingProfilePicture={isUploadingProfilePicture}
                            handleProfilePictureClick={handleProfilePictureClick}
                            handleProfileImageChange={handleProfileImageChange}
                            handleSaveProfileImage={handleSaveProfileImage}
                            handleCancelProfileImageEdit={handleCancelProfileImageEdit}
                            profileImageInputRef={profileImageInputRef}
                            professionalType={userData.professionalType}
                        />
                        <div className="profile-sections">
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
                                        isCompany={isCompany}
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
                                    {isCompany ? (
                                        <>
                                            <ProfessionalMilestonesSection
                                                isProfessionalMilestonesCollapsed={isProfessionalMilestonesCollapsed}
                                                setIsProfessionalMilestonesCollapsed={setIsProfessionalMilestonesCollapsed}
                                                isProfessionalMilestonesEditing={isProfessionalMilestonesEditing}
                                                setIsProfessionalMilestonesEditing={setIsProfessionalMilestonesEditing}
                                                professionalMilestones={professionalMilestones}
                                                handleAddMilestone={handleAddMilestone}
                                                handleMilestoneChange={handleMilestoneChange}
                                                handleRemoveMilestone={handleRemoveMilestone}
                                                updateProfileData={updateProfileData}
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
                                            <CompanyContactSection
                                                isCompanyContactCollapsed={isCompanyContactCollapsed}
                                                setIsCompanyContactCollapsed={setIsCompanyContactCollapsed}
                                                isCompanyContactEditing={isCompanyContactEditing}
                                                setIsCompanyContactEditing={setIsCompanyContactEditing}
                                                companyTags={companyTags}
                                                handleAddTag={handleAddTag}
                                                handleRemoveTag={handleRemoveTag}
                                                offersPractices={offersPractices}
                                                setOffersPractices={setOffersPractices}
                                                updateProfileData={updateProfileData}
                                                social={social}
                                                handleSocialChange={handleSocialChange}
                                            />
                                        </>
                                    ) : (
                                        <>
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
                                                onProfessionalFormationChange={handleProfessionalFormationChange}
                                                onAddProfessionalFormation={addProfessionalFormation}
                                                onRemoveProfessionalFormation={removeProfessionalFormation}
                                                updateProfileData={updateProfileData}
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
                                                uploadingCV={uploadingCV}
                                                uploadingPortfolio={uploadingPortfolio}
                                                userData={userData}
                                                setCvFile={setCvFile}
                                                setCvFileName={setCvFileName}
                                                setPortfolioFile={setPortfolioFile}
                                                setPortfolioFileName={setPortfolioFileName}
                                            />
                                        </>
                                    )}
                                </>
                            )}

                            {activeOption === "configuracion" && (
                                <ConfigurationSection
                                    userData={userData}
                                    isEmailEditing={isEmailEditing}
                                    setIsEmailEditing={setIsEmailEditing}
                                    emailInput={userData.email || ''}
                                    setEmailInput={setEmailInput}
                                    newEmail={newEmail}
                                    setNewEmail={setNewEmail}
                                    confirmEmail={confirmEmail}
                                    setConfirmEmail={setConfirmEmail}
                                    handleUpdateEmail={handleUpdateEmail}
                                    isPasswordEditing={isPasswordEditing}
                                    setIsPasswordEditing={setIsPasswordEditing}
                                    currentPassword={currentPassword}
                                    setCurrentPassword={setCurrentPassword}
                                    newPassword={newPassword}
                                    setNewPassword={setNewPassword}
                                    confirmPassword={confirmPassword}
                                    setConfirmPassword={setConfirmPassword}
                                    handleChangePassword={handleChangePassword}
                                    error={error}
                                />
                            )}

                            {activeOption === "misOfertas" && (
                                <MisOfertasSection 
                                    userRole={userData.role} 
                                    professionalType={userData.professionalType}
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
