import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projetService from '../../services/projetService';
import { useAuth } from '../../context/AuthContext';
import './ProjetList.css';

const ProjetList = () => {
    const [projets, setProjets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { hasRole } = useAuth();

    useEffect(() => {
        loadProjets();
    }, []);

    const loadProjets = async () => {
        try {
            const data = await projetService.getAllList();
            setProjets(data);
        } catch (error) {
            console.error('Erreur chargement projets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce projet ?')) {
            try {
                await projetService.delete(id);
                loadProjets();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const filteredProjets = projets.filter(projet =>
        projet.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.organismeNom?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="projet-list">
            <div className="list-header">
                <h2>Projets</h2>
                {hasRole('SECRETAIRE') && (
                    <Link to="/projets/new" className="btn-add">+ Nouveau projet</Link>
                )}
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Nom</th>
                        <th>Client</th>
                        <th>Chef de projet</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Montant</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProjets.map(projet => (
                        <tr key={projet.id}>
                            <td>{projet.code}</td>
                            <td>{projet.nom}</td>
                            <td>{projet.organismeNom}</td>
                            <td>{projet.chefProjetPrenom} {projet.chefProjetNom}</td>
                            <td>{new Date(projet.dateDebut).toLocaleDateString()}</td>
                            <td>{new Date(projet.dateFin).toLocaleDateString()}</td>
                            <td>{projet.montantGlobal?.toLocaleString()} DH</td>
                            <td className="actions">
                                <Link to={`/projets/${projet.id}`} className="btn-view">Voir</Link>
                                {hasRole('SECRETAIRE') && (
                                    <Link to={`/projets/edit/${projet.id}`} className="btn-edit">Modifier</Link>
                                )}
                                {hasRole('DIRECTEUR') && (
                                    <button onClick={() => handleDelete(projet.id)} className="btn-delete">Supprimer</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjetList;