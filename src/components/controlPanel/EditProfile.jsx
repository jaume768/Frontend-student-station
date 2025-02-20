import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        city: '',
        country: '',
        profile: {
            summary: '',
        },
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.get(`${backendUrl}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUserData(response.data);
        } catch (error) {
            console.error('Error al obtener el perfil:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('profile.')) {
            const profileField = name.split('.')[1];
            setUserData((prev) => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: value,
                },
            }));
        } else {
            setUserData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.put(`${backendUrl}/api/users/profile`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Perfil actualizado:', response.data);
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre completo</label>
                    <input
                        type="text"
                        name="fullName"
                        value={userData.fullName || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Ciudad</label>
                    <input
                        type="text"
                        name="city"
                        value={userData.city || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>País</label>
                    <input
                        type="text"
                        name="country"
                        value={userData.country || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Resumen profesional</label>
                    <textarea
                        name="profile.summary"
                        value={userData.profile?.summary || ''}
                        onChange={handleChange}
                        maxLength={350}
                    />
                </div>

                {/* Resto de campos según tu modelo (institution, brandName, etc.) */}
                {/* ... */}

                <button type="submit">Guardar cambios</button>
            </form>
        </div>
    );
};

export default EditProfile;
