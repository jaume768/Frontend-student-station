import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-main">
                <Header />
                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
};

export default Layout;