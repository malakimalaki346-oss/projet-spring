import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import projetService from '../../services/projetService';
import phaseService from '../../services/phaseService';
import { useAuth } from '../../context/AuthContext';
import DocumentList from '../Documents/DocumentList';
import './ProjetDetail.css';

const ProjetDetail = () => {
    const { id } = useParams();
    const [projet, setProjet] = useState(null);
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const { hasRole } = useAuth();

    const loadData = useCallback(async () => {
        try {
            const [projetData, phasesData] = await Promise.all([
                projetService.getResume(id),
                phaseService.getByProjet(id)
            ]);
            setProjet(projetData);
            setPhases(phasesData);
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const updatePhaseEtat = async (phaseId, field, value) => {
        try {
            if (field === 'realisation') {
                await phaseService.updateRealisation(phaseId, value);
            } else if (field === 'facturation') {
                await phaseService.updateFacturation(phaseId, value);
            } else if (field === 'paiement') {
                await phaseService.updatePaiement(phaseId, value);
            }
            loadData();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (!projet) return <div className="loading">Projet non trouve</div>;

    return (
        <div className="projet-detail">
            <div className="detail-header">
                <h2>{projet.nom}</h2>
                <div className="header-actions">
                    {hasRole('SECRETAIRE') && (
                        <Link to={`/projets/edit/${id}`} className="btn-edit">Modifier</Link>
                    )}
                    {hasRole('CHEF_PROJET') && (
                        <Link to={`/projets/${id}/phases/new`} className="btn-add">+ Ajouter phase</Link>
                    )}
                </div>
            </div>

            <div className="info-section">
                <h3>Informations generales</h3>
                <div className="info-grid">
                    <div><strong>Code:</strong> {projet.code}</div>
                    <div><strong>Client:</strong> {projet.organismeNom}</div>
                    <div><strong>Chef de projet:</strong> {projet.chefProjetNomComplet}</div>
                    <div><strong>Date debut:</strong> {new Date(projet.dateDebut).toLocaleDateString()}</div>
                    <div><strong>Date fin:</strong> {new Date(projet.dateFin).toLocaleDateString()}</div>
                    <div><strong>Montant:</strong> {projet.montantGlobal?.toLocaleString()} DH</div>
                </div>
                {projet.description && (
                    <div className="description">
                        <strong>Description:</strong> {projet.description}
                    </div>
                )}
            </div>

            <div className="phases-section">
                <h3>Phases du projet</h3>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Libelle</th>
                        <th>Dates</th>
                        <th>Montant</th>
                        <th>Terminee</th>
                        <th>Facturee</th>
                        <th>Payee</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {phases.map(phase => (
                        <tr key={phase.id}>
                            <td>{phase.code}</td>
                            <td>{phase.libelle}</td>
                            <td>{new Date(phase.dateDebut).toLocaleDateString()} - {new Date(phase.dateFin).toLocaleDateString()}</td>
                            <td>{phase.montant?.toLocaleString()} DH</td>
                            <td>
                                <input type="checkbox" checked={phase.estTerminee}
                                       onChange={(e) => updatePhaseEtat(phase.id, 'realisation', e.target.checked)}
                                       disabled={!hasRole('CHEF_PROJET') && !hasRole('DIRECTEUR')} />
                            </td>
                            <td>
                                <input type="checkbox" checked={phase.estFacturee}
                                       onChange={(e) => updatePhaseEtat(phase.id, 'facturation', e.target.checked)}
                                       disabled={!hasRole('COMPTABLE')} />
                            </td>
                            <td>
                                <input type="checkbox" checked={phase.estPayee}
                                       onChange={(e) => updatePhaseEtat(phase.id, 'paiement', e.target.checked)}
                                       disabled={!hasRole('COMPTABLE')} />
                            </td>
                            <td>
                                <Link to={`/phases/${phase.id}`} className="btn-view">Details</Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <DocumentList projetId={id} projetNom={projet?.nom} />

        </div>
    );
};

export default ProjetDetail;