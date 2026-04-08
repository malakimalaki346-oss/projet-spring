import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{textAlign: 'center', padding: '50px'}}>
            <h1>404 - Page non trouvee</h1>
            <p>La page que vous cherchez n'existe pas.</p>
            <Link to="/dashboard">Retour au tableau de bord</Link>
        </div>
    );
};

export default NotFound;