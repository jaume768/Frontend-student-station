import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavbar from './MobileNavbar';
import MobileSideMenu from './MobileSideMenu';
import CookieConsent from './CookieConsent';

const Layout = ({ children, contentClassName }) => {
    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const [profilePicture, setProfilePicture] = useState('/multimedia/usuarioDefault.jpg');

    useEffect(() => {
        const fetchProfilePicture = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            try {
                const response = await fetch(`${backendUrl}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    cache: 'no-store'
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data?.profile?.profilePicture) {
                        setProfilePicture(data.profile.profilePicture);
                    } else {
                        setProfilePicture('/multimedia/usuarioDefault.jpg');
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
                <Header profilePicture={profilePicture} onHamburgerClick={toggleSideMenu} />
                <main className={`dashboard-content ${contentClassName}`}>{children}</main>
                <MobileNavbar profilePicture={profilePicture} />
            </div>
            {sideMenuOpen && <MobileSideMenu onClose={closeSideMenu} />}
            <CookieConsent />
        </div>
    );
};

export default Layout;