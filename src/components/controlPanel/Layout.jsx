import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavbar from './MobileNavbar';
import MobileSideMenu from './MobileSideMenu';

const Layout = ({ children }) => {
    const [sideMenuOpen, setSideMenuOpen] = useState(false);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            try {
                const response = await fetch(`${backendUrl}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.profile && data.profile.profilePicture) {
                        localStorage.setItem("profilePicture", data.profile.profilePicture);
                    } else {
                        localStorage.removeItem("profilePicture");
                    }
                }
            } catch (error) {
                console.error("Error al obtener la foto de perfil:", error);
            }
        };

        fetchProfilePicture();
    }, []);

    const toggleSideMenu = () => setSideMenuOpen(prev => !prev);
    const closeSideMenu = () => setSideMenuOpen(false);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-main">
                <Header onHamburgerClick={toggleSideMenu} />
                <main className="dashboard-content">{children}</main>
                <MobileNavbar />
            </div>
            {sideMenuOpen && <MobileSideMenu onClose={closeSideMenu} />}
        </div>
    );
};

export default Layout;