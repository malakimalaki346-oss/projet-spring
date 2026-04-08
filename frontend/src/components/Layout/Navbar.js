import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>Suivi de Projets</h1>
            </div>
            <div className="navbar-user">
                <span>{user?.prenom} {user?.nom}</span>
                <span className="user-role">{user?.role?.replace('ROLE_', '')}</span>
                <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
            </div>
        </nav>
    );
};

export default Navbar;