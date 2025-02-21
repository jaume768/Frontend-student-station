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

const EditButton = ({ onClick }) => {
    const [hover, setHover] = useState(false);
    return (
        <button
            type="button"
            className="edit-data-button"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
        >
            {hover ? "Guardar datos" : "Editar datos"}
        </button>
    );
};

const EditProfile = () => {
    // Estado inicial simulado; luego se actualiza con datos reales del backend
    const [userData, setUserData] = useState({
        profilePicture: '/multimedia/usuarioDefault.jpg',
        fullName: 'Nombre Apellido',
        username: 'username123',
        city: 'Ciudad',
        country: 'País',
        email: 'correo@ejemplo.com',
        creativeType: 'Estudiante',
        profile: {
            summary: '',
        },
    });

    // Estados para otras secciones del formulario
    const [basicInfo, setBasicInfo] = useState({
        firstName: '',
        lastName: '',
        country: '',
        city: '',
    });
    const [professionalSummary, setProfessionalSummary] = useState('');
    const [education, setEducation] = useState({
        institution: '',
        otherInstitution: '',
        formationName: '',
        formationStart: '',
        formationEnd: '',
        currentlyEnrolled: false,
    });
    const [selfTaught, setSelfTaught] = useState(false);

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
                    profile: {
                        summary: user.profile.summary || '',
                    },
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

    const handleUserDataChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [section, key] = name.split('.');
            setUserData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: value,
                },
            }));
        } else {
            setUserData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfessionalSummaryChange = (e) => {
        setProfessionalSummary(e.target.value);
    };

    const handleEducationChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEducation((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSelfTaughtChange = (e) => {
        setSelfTaught(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ userData, basicInfo, professionalSummary, education, selfTaught });
        // Aquí podrías realizar un PUT a /api/users/profile con los datos actualizados
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
                            <img
                                src={userData.profilePicture}
                                alt="Perfil"
                                className="profile-picture"
                            />
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

                    {/* Cuerpo del perfil: opciones y formulario */}
                    <div className="profile-body">
                        <div className="left-options">
                            <div className="option option-edit">
                                <FaPencilAlt className="option-icon" />
                                <span>Editar mi perfil</span>
                            </div>
                            <div className="option option-offers">
                                <FaBriefcase className="option-icon" />
                                <span>Mis ofertas</span>
                            </div>
                            <div className="option option-settings">
                                <FaCog className="option-icon" />
                                <span>Configuración</span>
                            </div>
                        </div>
                        <div className="right-form">
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
                                    />
                                </div>
                                <div className="form-group">
                                    <label>País de residencia</label>
                                    <select
                                        name="country"
                                        value={basicInfo.country}
                                        onChange={handleBasicInfoChange}
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
                                    />
                                </div>
                                <div className="button-container">
                                    <EditButton onClick={() => { /* Lógica para guardar básicos */ }} />
                                </div>
                            </section>

                            {/* 3.2 Resumen profesional */}
                            <section className="form-section">
                                <h3>Resumen profesional</h3>
                                <h4>Describe tu recorrido profesional</h4>
                                <div className="form-group">
                                    <textarea
                                        name="professionalSummary"
                                        placeholder="Soy estudiante de diseño de moda apasionado por la fusión entre arte y sostenibilidad. Me inspiro en la naturaleza y las formas orgánicas para crear piezas únicas, explorando materiales reciclados y técnicas innovadoras. Mi objetivo es reducir el impacto ambiental en la moda, combinando creatividad y conciencia ecológica para un futuro más sostenible."
                                        value={professionalSummary}
                                        onChange={handleProfessionalSummaryChange}
                                        maxLength={350}
                                    />
                                    <small
                                        className="char-count"
                                        style={{ color: professionalSummary.length === 350 ? 'red' : '#4c85ff' }}
                                    >
                                        {professionalSummary.length === 350 ? "Tu texto supera los 350 caracteres" : "Debe tener un máximo de 350 caracteres"}
                                    </small>
                                </div>
                                <div className="button-container">
                                    <EditButton onClick={() => { /* Lógica para guardar resumen */ }} />
                                </div>
                            </section>

                            {/* 3.3 Información educativa y Formación autodidacta unificadas */}
                            <section className="form-section">
                                <h3>Información educativa y formación</h3>
                                <div className="form-group">
                                    <label>Institución educativa</label>
                                    <select
                                        name="institution"
                                        value={education.institution}
                                        onChange={handleEducationChange}
                                        disabled={selfTaught}
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
                                        disabled={selfTaught}
                                    />
                                    <small className="info-text">
                                        Por el momento contamos con un número limitado de escuelas y universidades.
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label>Nombre de la formación que has cursado</label>
                                    <input
                                        type="text"
                                        name="formationName"
                                        placeholder="Introduce el nombre de la formación"
                                        value={education.formationName}
                                        onChange={handleEducationChange}
                                        disabled={selfTaught}
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
                                        disabled={selfTaught}
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
                                        disabled={selfTaught || education.currentlyEnrolled}
                                    />
                                </div>
                                <div className="form-group checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="currentlyEnrolled"
                                            checked={education.currentlyEnrolled}
                                            onChange={handleEducationChange}
                                        />
                                        Actualmente me encuentro en esta formación
                                    </label>
                                </div>
                                <div className="button-row">
                                    <div className="button-container">
                                        <button type="button" className="add-formation">
                                            + Añadir formación
                                        </button>
                                        <EditButton onClick={() => { /* Lógica para guardar educación */ }} />
                                    </div>
                                </div>
                                <div className="form-group checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="selfTaught"
                                            checked={selfTaught}
                                            onChange={handleSelfTaughtChange}
                                        />
                                        He adquirido todos mis conocimientos de forma autodidacta
                                    </label>
                                </div>
                                <small className="info-text">
                                    Por el momento puedes añadir hasta un máximo de tres.
                                </small>
                            </section>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
