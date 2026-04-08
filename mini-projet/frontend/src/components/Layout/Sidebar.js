import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
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
                <li>
                    <NavLink to="/employes">Employes</NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;