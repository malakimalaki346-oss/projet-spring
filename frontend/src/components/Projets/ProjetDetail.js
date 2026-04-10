import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import projetService from '../../services/projetService';
import { useAuth } from '../../context/AuthContext';
import DocumentList from '../Documents/DocumentList';
import PhaseList from '../Phases/PhaseList';
import './ProjetDetail.css';

const ProjetDetail = () => {
    const { id } = useParams();
    const [projet, setProjet] = useState(null);
    const [loading, setLoading] = useState(true);
    const { hasRole } = useAuth();

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const projetData = await projetService.getResume(id);
            setProjet(projetData);
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
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

            <PhaseList projetId={id} projetNom={projet?.nom} />

            <DocumentList projetId={id} projetNom={projet?.nom} />

        </div>
    );
};

export default ProjetDetail;