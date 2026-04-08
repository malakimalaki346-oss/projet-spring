import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { hasRole, user } = useAuth();

    const role = user?.role?.replace('ROLE_', '');

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
                {/* Employes: visible seulement pour ADMIN et DIRECTEUR */}
                {(role === 'ADMIN' || role === 'DIRECTEUR') && (
                    <li>
                        <NavLink to="/employes">Employes</NavLink>
                    </li>
                )}
                {/* Factures: visible pour COMPTABLE et DIRECTEUR */}
                {(role === 'COMPTABLE' || role === 'DIRECTEUR') && (
                    <li>
                        <NavLink to="/factures">Factures</NavLink>
                    </li>
                )}
                {/* Rapport phases: visible pour COMPTABLE et DIRECTEUR */}
                {(role === 'COMPTABLE' || role === 'DIRECTEUR') && (
                    <li>
                        <NavLink to="/rapport-phases">Rapport phases</NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;