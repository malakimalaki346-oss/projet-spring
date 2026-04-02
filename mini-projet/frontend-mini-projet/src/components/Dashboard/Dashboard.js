import React, { useState, useEffect } from 'react';
import projetService from '../../services/projetService';
import phaseService from '../../services/phaseService';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjets: 0,
        totalPhases: 0,
        phasesTerminees: 0,
        phasesFacturees: 0,
        phasesPayees: 0,
        montantTotal: 0,
        montantFacture: 0,
        montantPaye: 0
    });
    const [recentProjets, setRecentProjets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { hasRole } = useAuth();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const projets = await projetService.getAllList();
            const phasesTerminees = await phaseService.getTermineesNonFacturees();
            const phasesFacturees = await phaseService.getFactureesNonPayees();

            let totalProjets = projets.length;
            let totalPhases = 0;
            let phasesTermineesCount = 0;
            let phasesFactureesCount = 0;
            let phasesPayeesCount = 0;
            let montantTotal = 0;
            let montantFacture = 0;
            let montantPaye = 0;

            projets.forEach(projet => {
                montantTotal += projet.montantGlobal || 0;
            });

            const recent = projets.slice(0, 5);
            setRecentProjets(recent);

            setStats({
                totalProjets,
                totalPhases,
                phasesTerminees: phasesTerminees.length,
                phasesFacturees: phasesFacturees.length,
                phasesPayees: 0,
                montantTotal,
                montantFacture: 0,
                montantPaye: 0
            });
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="dashboard">
            <h2>Tableau de bord</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Projets</h3>
                    <div className="stat-value">{stats.totalProjets}</div>
                </div>
                <div className="stat-card">
                    <h3>Montant total</h3>
                    <div className="stat-value">{stats.montantTotal.toLocaleString()} DH</div>
                </div>
                <div className="stat-card">
                    <h3>Phases terminées</h3>
                    <div className="stat-value">{stats.phasesTerminees}</div>
                </div>
                <div className="stat-card">
                    <h3>À facturer</h3>
                    <div className="stat-value">{stats.phasesTerminees}</div>
                </div>
            </div>

            <div className="recent-projets">
                <h3>Derniers projets</h3>
                <table className="data-table">
                    <thead>
                        <tr><th>Code</th><th>Nom</th><th>Client</th><th>Montant</th><th>Statut</th></tr>
                    </thead>
                    <tbody>
                        {recentProjets.map(projet => (
                            <tr key={projet.id}>
                                <td>{projet.code}</td>
                                <td>{projet.nom}</td>
                                <td>{projet.organismeNom}</td>
                                <td>{projet.montantGlobal?.toLocaleString()} DH</td>
                                <td>
                                    <span className={`status ${projet.pourcentageRealisation === 100 ? 'completed' : 'in-progress'}`}>
                                        {projet.pourcentageRealisation === 100 ? 'Terminé' : 'En cours'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;