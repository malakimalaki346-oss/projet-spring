import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { hasRole } = useAuth();

    return (
        <div className="sidebar">
            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/dashboard">Tableau de bord</NavLink>
                </li>
                <li>
                    <NavLink to="/projets">Projets</NavLink>
                </li>
                <li>
                    <NavLink to="/organismes">Organismes</NavLink>
                </li>
                {(hasRole('ADMIN') || hasRole('DIRECTEUR')) && (
                    <li>
                        <NavLink to="/employes">Employes</NavLink>
                    </li>
                )}
                {(hasRole('ADMIN') || hasRole('COMPTABLE') || hasRole('DIRECTEUR')) && (
                    <li>
                        <NavLink to="/factures">Factures</NavLink>
                    </li>
                )}
                {(hasRole('ADMIN') || hasRole('COMPTABLE') || hasRole('DIRECTEUR')) && (
                    <li>
                        <NavLink to="/rapport-phases">Rapport phases</NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;