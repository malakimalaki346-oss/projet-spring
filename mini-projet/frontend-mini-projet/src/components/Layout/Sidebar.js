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
                    <NavLink to="/dashboard" end>Tableau de bord</NavLink>
                </li>
                <li>
                    <NavLink to="/projets">Projets</NavLink>
                </li>
                <li>
                    <NavLink to="/organismes">Organismes</NavLink>
                </li>
                {hasRole('ADMIN') && (
                    <li>
                        <NavLink to="/employes">Employés</NavLink>
                    </li>
                )}
                {hasRole('COMPTABLE') && (
                    <li>
                        <NavLink to="/factures">Factures</NavLink>
                    </li>
                )}
                {hasRole('COMPTABLE') && (
                    <li>
                        <NavLink to="/rapports">Rapports</NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;