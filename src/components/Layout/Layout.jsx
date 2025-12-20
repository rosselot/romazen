import React from 'react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
