import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjets: 0,
        montantTotal: 0,
        phasesTerminees: 0,
        phasesAFacturer: 0
    });
    const [recentProjets, setRecentProjets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            console.log('Chargement dashboard...');

            const projetsResponse = await api.get('/projets');
            const projets = projetsResponse.data || [];
            console.log('Projets:', projets.length);

            let totalPhasesTerminees = 0;
            let totalPhasesAFacturer = 0;

            for (const projet of projets) {
                try {
                    const phasesResponse = await api.get(`/projets/${projet.id}/phases`);
                    const phases = phasesResponse.data || [];

                    const phasesTerminees = phases.filter(phase => phase.estTerminee === true);
                    totalPhasesTerminees += phasesTerminees.length;

                    const phasesAFacturer = phasesTerminees.filter(phase => phase.estFacturee === false);
                    totalPhasesAFacturer += phasesAFacturer.length;
                } catch (err) {
                    console.error(`Erreur pour projet ${projet.id}:`, err);
                }
            }

            console.log('Phases terminees:', totalPhasesTerminees);
            console.log('Phases a facturer:', totalPhasesAFacturer);

            let montantTotal = 0;
            projets.forEach(projet => {
                if (projet.montantGlobal) {
                    montantTotal += projet.montantGlobal;
                }
            });
            console.log('Montant total:', montantTotal);

            setStats({
                totalProjets: projets.length,
                montantTotal: montantTotal,
                phasesTerminees: totalPhasesTerminees,
                phasesAFacturer: totalPhasesAFacturer
            });

            setRecentProjets(projets.slice(0, 5));

        } catch (error) {
            console.error('Erreur:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatMontant = (montant) => {
        if (!montant && montant !== 0) return '0 DH';
        return montant.toLocaleString('fr-FR') + ' DH';
    };

    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;
    }

    if (error) {
        return <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>Erreur: {error}</div>;
    }

    return (
        <div style={{padding: '20px'}}>
            <h2>Tableau de bord</h2>

            {/* CARTES STATISTIQUES */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px'}}>
                <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center'}}>
                    <h3>Projets</h3>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3498db'}}>{stats.totalProjets}</div>
                </div>
                <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center'}}>
                    <h3>Montant total</h3>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3498db'}}>{formatMontant(stats.montantTotal)}</div>
                </div>
                <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center'}}>
                    <h3>Phases terminees</h3>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3498db'}}>{stats.phasesTerminees}</div>
                </div>
                <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center'}}>
                    <h3>A facturer</h3>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3498db'}}>{stats.phasesAFacturer}</div>
                </div>
            </div>

            {/* GRAPHIQUES - AJOUTER ICI */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px'}}>
                <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                    <h3>Repartition par projet</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={recentProjets}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nom" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="montantGlobal" fill="#3498db" name="Montant (DH)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                    <h3>Statut des phases</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Terminees', value: stats.phasesTerminees },
                                    { name: 'Non terminees', value: Math.max(0, 10 - stats.phasesTerminees) }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={entry => entry.name}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                <Cell fill="#2ecc71" />
                                <Cell fill="#e74c3c" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* TABLEAU DERNIERS PROJETS */}
            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h3>Derniers projets</h3>
                {recentProjets.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '50px', color: '#999'}}>Aucun projet</div>
                ) : (
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                            <tr style={{background: '#f8f9fa'}}>
                                <th style={{padding: '12px', textAlign: 'left'}}>Code</th>
                                <th style={{padding: '12px', textAlign: 'left'}}>Nom</th>
                                <th style={{padding: '12px', textAlign: 'left'}}>Client</th>
                                <th style={{padding: '12px', textAlign: 'left'}}>Montant</th>
                                <th style={{padding: '12px', textAlign: 'left'}}>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentProjets.map(projet => (
                                <tr key={projet.id}>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{projet.code || '-'}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{projet.nom || '-'}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{projet.organismeNom || '-'}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatMontant(projet.montantGlobal)}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>
                                        <span style={{padding: '4px 8px', borderRadius: '4px', background: '#fff3cd', color: '#856404'}}>En cours</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;