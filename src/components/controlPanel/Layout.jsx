import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavbar from './MobileNavbar';
import MobileSideMenu from './MobileSideMenu';

const Layout = ({ children }) => {
    const [sideMenuOpen, setSideMenuOpen] = useState(false);

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