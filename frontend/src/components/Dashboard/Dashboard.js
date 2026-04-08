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
    const [chartData, setChartData] = useState([]);
    const [phaseChartData, setPhaseChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const projetsResponse = await api.get('/projets');
            const projets = projetsResponse.data || [];

            let totalPhasesTerminees = 0;
            let totalPhases = 0;

            for (const projet of projets) {
                try {
                    const phasesResponse = await api.get(`/projets/${projet.id}/phases`);
                    const phases = phasesResponse.data || [];
                    totalPhases += phases.length;
                    const phasesTerminees = phases.filter(phase => phase.estTerminee === true);
                    totalPhasesTerminees += phasesTerminees.length;
                } catch (err) {
                    console.error(`Erreur pour projet ${projet.id}:`, err);
                }
            }

            let montantTotal = 0;
            projets.forEach(projet => {
                if (projet.montantGlobal) {
                    montantTotal += projet.montantGlobal;
                }
            });

            setStats({
                totalProjets: projets.length,
                montantTotal: montantTotal,
                phasesTerminees: totalPhasesTerminees,
                phasesAFacturer: totalPhasesTerminees
            });

            setRecentProjets(projets.slice(0, 5));

            const barData = projets.map(projet => ({
                nom: projet.nom?.length > 15 ? projet.nom.substring(0, 15) + '...' : projet.nom,
                montant: projet.montantGlobal || 0
            }));
            setChartData(barData);

            const pieData = [
                { name: 'Phases terminees', value: totalPhasesTerminees },
                { name: 'Phases non terminees', value: Math.max(0, totalPhases - totalPhasesTerminees) }
            ];
            setPhaseChartData(pieData);

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

    const COLORS = ['#3498db', '#e74c3c'];

    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;
    }

    if (error) {
        return <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>Erreur: {error}</div>;
    }

    return (
        <div style={{padding: '20px'}}>
            <h2>Tableau de bord</h2>

            {/* Cartes statistiques */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '40px'
            }}>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <h3 style={{margin: 0, color: '#666', fontSize: '14px'}}>Projets</h3>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3498db', marginTop: '10px'}}>
                        {stats.totalProjets}
                    </div>
                </div>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <h3 style={{margin: 0, color: '#666', fontSize: '14px'}}>Montant total</h3>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3498db', marginTop: '10px'}}>
                        {formatMontant(stats.montantTotal)}
                    </div>
                </div>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <h3 style={{margin: 0, color: '#666', fontSize: '14px'}}>Phases terminees</h3>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3498db', marginTop: '10px'}}>
                        {stats.phasesTerminees}
                    </div>
                </div>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <h3 style={{margin: 0, color: '#666', fontSize: '14px'}}>A facturer</h3>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3498db', marginTop: '10px'}}>
                        {stats.phasesAFacturer}
                    </div>
                </div>
            </div>

            {/* Graphiques - Pleine largeur */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                marginBottom: '40px'
            }}>
                {/* Graphique a barres */}
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{marginBottom: '25px', fontSize: '18px'}}>Repartition par projet</h3>
                    {chartData.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '50px', color: '#999'}}>Aucune donnee</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="nom"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    interval={0}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    tickFormatter={(value) => (value / 1000000).toFixed(1) + 'M'}
                                />
                                <Tooltip formatter={(value) => formatMontant(value)} />
                                <Legend />
                                <Bar dataKey="montant" fill="#3498db" name="Montant (DH)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Graphique circulaire */}
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{marginBottom: '25px', fontSize: '18px'}}>Statut des phases</h3>
                    {phaseChartData.length === 0 || (phaseChartData[0].value === 0 && phaseChartData[1].value === 0) ? (
                        <div style={{textAlign: 'center', padding: '50px', color: '#999'}}>Aucune donnee</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={phaseChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={140}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    paddingAngle={5}
                                >
                                    {phaseChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} phases`} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span style={{fontSize: '14px'}}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Derniers projets */}
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h3>Derniers projets</h3>
                {recentProjets.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '50px', color: '#999'}}>Aucun projet</div>
                ) : (
                    <div style={{overflowX: 'auto'}}>
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
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                background: '#fff3cd',
                                                color: '#856404'
                                            }}>En cours</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;