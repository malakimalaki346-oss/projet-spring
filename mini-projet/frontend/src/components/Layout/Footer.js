import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#2c3e50',
            color: 'white',
            textAlign: 'center',
            padding: '15px',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            fontSize: '12px'
        }}>
            <p>&copy; 2026 - Systeme de Suivi de Projets - Tous droits reserves</p>
        </footer>
    );
};

export default Footer;