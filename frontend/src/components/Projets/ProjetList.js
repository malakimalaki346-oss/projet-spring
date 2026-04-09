import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projetService from '../../services/projetService';
import { useAuth } from '../../context/AuthContext';
import './ProjetList.css';

const ProjetList = () => {
    const [projets, setProjets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { hasRole, user } = useAuth();

    console.log('User role:', user?.role);
    console.log('HasRole ADMIN:', hasRole('ADMIN'));
    console.log('HasRole DIRECTEUR:', hasRole('DIRECTEUR'));
    console.log('HasRole SECRETAIRE:', hasRole('SECRETAIRE'));

    useEffect(() => {
        loadProjets();
    }, []);

    const loadProjets = async () => {
        try {
            const data = await projetService.getAllList();
            setProjets(data || []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce projet ?')) {
            try {
                await projetService.delete(id);
                loadProjets();
                alert('Projet supprime avec succes');
            } catch (error) {
                alert(error.response?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const formatMontant = (montant) => {
        if (!montant) return '0 DH';
        return montant.toLocaleString('fr-FR') + ' DH';
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
                {(hasRole('SECRETAIRE') || hasRole('ADMIN')) && (
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
                    <th>Date debut</th>
                    <th>Date fin</th>
                    <th>Montant</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredProjets.map(projet => (
                    <tr key={projet.id}>
                        <td>{projet.code || '-'}</td>
                        <td>{projet.nom || '-'}</td>
                        <td>{projet.organismeNom || '-'}</td>
                        <td>{projet.chefProjetPrenom} {projet.chefProjetNom}</td>
                        <td>{formatDate(projet.dateDebut)}</td>
                        <td>{formatDate(projet.dateFin)}</td>
                        <td>{formatMontant(projet.montantGlobal)}</td>
                        <td className="actions">
                            <Link to={`/projets/${projet.id}`} className="btn-view">Voir</Link>
                            {(hasRole('SECRETAIRE') || hasRole('ADMIN') || hasRole('DIRECTEUR')) && (
                                <Link to={`/projets/edit/${projet.id}`} className="btn-edit">Modifier</Link>
                            )}
                            {hasRole('ADMIN') && (
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