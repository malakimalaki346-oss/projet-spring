import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div style={{textAlign: 'center', padding: '50px'}}>
            <h1>403 - Acces refuse</h1>
            <p>Vous n'avez pas les droits necessaires pour acceder a cette page.</p>
            <Link to="/dashboard">Retour au tableau de bord</Link>
        </div>
    );
};

export default Unauthorized;