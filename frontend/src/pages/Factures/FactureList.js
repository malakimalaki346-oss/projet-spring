import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FactureList = () => {
    const [factures, setFactures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { hasRole } = useAuth();

    useEffect(() => {
        loadFactures();
    }, []);

    const loadFactures = async () => {
        try {
            const response = await api.get('/factures');
            setFactures(response.data || []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaiement = async (id) => {
        if (window.confirm('Enregistrer le paiement de cette facture ?')) {
            try {
                await api.post(`/factures/${id}/paiement`);
                loadFactures();
                alert('Paiement enregistre avec succes');
            } catch (error) {
                alert(error.response?.data?.message || 'Erreur');
            }
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

    const filteredFactures = factures.filter(f =>
        f.numeroFacture?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.projetNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.clientNom?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;

    return (
        <div style={{padding: '20px'}}>
            <h2>Factures</h2>

            <div style={{marginBottom: '20px'}}>
                <input
                    type="text"
                    placeholder="Rechercher par numero, projet ou client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px'}}
                />
            </div>

            {filteredFactures.length === 0 ? (
                <div style={{textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px'}}>Aucune facture trouvee</div>
            ) : (
                <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                    <thead>
                        <tr style={{background: '#f8f9fa'}}>
                            <th style={{padding: '12px', textAlign: 'left'}}>N° Facture</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Projet</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Client</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Date facture</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Montant</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Statut</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFactures.map(facture => (
                            <tr key={facture.id}>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{facture.numeroFacture || '-'}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{facture.projetNom || '-'}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{facture.clientNom || '-'}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatDate(facture.dateFacture)}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatMontant(facture.montant)}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: facture.estPayee ? '#d4edda' : (facture.estFacturee ? '#fff3cd' : '#f8d7da'),
                                        color: facture.estPayee ? '#155724' : (facture.estFacturee ? '#856404' : '#721c24')
                                    }}>
                                        {facture.estPayee ? 'Payee' : (facture.estFacturee ? 'Facturee' : 'En attente')}
                                    </span>
                                </td>
                                <td>
                                    {hasRole('COMPTABLE') && !facture.estPayee && (
                                        <button onClick={() => handlePaiement(facture.id)} style={{background: '#28a745', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer'}}>
                                            Payer
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FactureList;