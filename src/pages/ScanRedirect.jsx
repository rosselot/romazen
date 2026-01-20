import { useEffect } from 'react';

const ScanRedirect = () => {
    useEffect(() => {
        window.location.href = 'https://www.instagram.com/romazencandles/';
    }, []);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f5f2',
            color: '#2c2c2c',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <p>Redirecting to Instagram...</p>
        </div>
    );
};

export default ScanRedirect;
