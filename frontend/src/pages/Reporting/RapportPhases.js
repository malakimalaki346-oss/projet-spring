import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RapportPhases = () => {
    const [phasesTerminees, setPhasesTerminees] = useState([]);
    const [phasesFacturees, setPhasesFacturees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('terminees');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [termineesRes, factureesRes] = await Promise.all([
                api.get('/phases/terminees-non-facturees'),
                api.get('/phases/facturees-non-payees')
            ]);
            setPhasesTerminees(termineesRes.data || []);
            setPhasesFacturees(factureesRes.data || []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatMontant = (montant) => {
        if (!montant) return '0 DH';
        return montant.toLocaleString('fr-FR') + ' DH';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;

    return (
        <div style={{padding: '20px'}}>
            <h2>Reporting Financier</h2>

            <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ddd'}}>
                <button
                    onClick={() => setActiveTab('terminees')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'terminees' ? '#3498db' : 'transparent',
                        color: activeTab === 'terminees' ? 'white' : '#333',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '5px 5px 0 0'
                    }}
                >
                    Phases terminees non facturees ({phasesTerminees.length})
                </button>
                <button
                    onClick={() => setActiveTab('facturees')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'facturees' ? '#3498db' : 'transparent',
                        color: activeTab === 'facturees' ? 'white' : '#333',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '5px 5px 0 0'
                    }}
                >
                    Phases facturees non payees ({phasesFacturees.length})
                </button>
            </div>

            {activeTab === 'terminees' && (
                <div>
                    <h3>Phases terminees non facturees</h3>
                    {phasesTerminees.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px'}}>Aucune phase dans cette categorie</div>
                    ) : (
                        <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                            <thead>
                                <tr style={{background: '#f8f9fa'}}>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Projet</th>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Phase</th>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Code</th>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Date fin</th>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {phasesTerminees.map(phase => (
                                    <tr key={phase.id}>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{phase.projetNom || '-'}</td>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{phase.libelle || '-'}</td>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{phase.code || '-'}</td>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatDate(phase.dateFin)}</td>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatMontant(phase.montant)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === 'facturees' && (
                <div>
                    <h3>Phases facturees non payees</h3>
                    {phasesFacturees.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px'}}>Aucune phase dans cette categorie</div>
                    ) : (
                        <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                            <thead>
                                <tr style={{background: '#f8f9fa'}}>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Projet</th>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Phase</th>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Code</th>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Date fin</th>
                                    <th style={{padding: '12px', textAlign: 'left'}}>Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {phasesFacturees.map(phase => (
                                    <tr key={phase.id}>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{phase.projetNom || '-'}</td>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{phase.libelle || '-'}</td>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{phase.code || '-'}</td>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatDate(phase.dateFin)}</td>
                                        <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatMontant(phase.montant)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default RapportPhases;