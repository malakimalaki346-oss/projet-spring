import React, { useState, useEffect } from 'react';
import organismeService from '../../services/organismeService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

import './OrganismeList.css';

const OrganismeList = () => {
    const [organismes, setOrganismes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { hasRole } = useAuth();

    useEffect(() => {
        loadOrganismes();
    }, []);

    const loadOrganismes = async () => {
        try {
            const data = await organismeService.getAll();
            setOrganismes(data || []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet organisme ?')) {
            try {
                await organismeService.delete(id);
                loadOrganismes();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const filteredOrganismes = organismes.filter(org =>
        org.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="organisme-list">
            <div className="list-header">
                <h2>Organismes</h2>
                {hasRole('SECRETAIRE') && (
                    <button className="btn-add">+ Nouvel organisme</button>
                )}
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher un organisme..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Nom</th>
                        <th>Contact</th>
                        <th>Telephone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrganismes.map(org => (
                        <tr key={org.id}>
                            <td>{org.code || '-'}</td>
                            <td>{org.nom || '-'}</td>
                            <td>{org.contactNom || '-'}</td>
                            <td>{org.telephone || '-'}</td>
                            <td>{org.contactEmail || '-'}</td>
                            <td className="actions">
                                     <Link to={`/organismes/${org.id}`} className="btn-view">Voir</Link>
                                {hasRole('SECRETAIRE') && (
                                    <button className="btn-edit">Modifier</button>
                                )}
                                {hasRole('ADMIN') && (
                                    <button onClick={() => handleDelete(org.id)} className="btn-delete">Supprimer</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrganismeList;