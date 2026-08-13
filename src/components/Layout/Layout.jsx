import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';

const Layout = ({ children }) => {
    const { pathname } = useLocation();

    React.useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            const heading = document.querySelector('main h1');
            if (heading instanceof HTMLElement) {
                heading.tabIndex = -1;
                heading.focus({ preventScroll: true });
            }
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [pathname]);

    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
            <span className="srOnly" role="status" aria-live="polite">Page changed: {pathname}</span>
            <Footer />
        </>
    );
};

export default Layout;
