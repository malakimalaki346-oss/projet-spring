import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PhaseList = ({ projetId, projetNom }) => {
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const { hasRole } = useAuth();

    useEffect(() => {
        if (projetId) {
            loadPhases();
        }
    }, [projetId]);

    const loadPhases = async () => {
        try {
            const response = await api.get(`/projets/${projetId}/phases`);
            setPhases(response.data || []);
        } catch (error) {
            console.error('Erreur chargement phases:', error);
        } finally {
            setLoading(false);
        }
    };

    const updatePhaseEtat = async (phaseId, field, value) => {
        try {
            if (field === 'realisation') {
                await api.patch(`/phases/${phaseId}/realisation?terminee=${value}`);
            } else if (field === 'facturation') {
                await api.patch(`/phases/${phaseId}/facturation?facturee=${value}`);
            } else if (field === 'paiement') {
                await api.patch(`/phases/${phaseId}/paiement?payee=${value}`);
            }
            loadPhases();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette phase ?')) {
            try {
                await api.delete(`/phases/${id}`);
                loadPhases();
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

    const filteredPhases = phases.filter(phase =>
        phase.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phase.libelle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPhases = filteredPhases.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPhases.length / itemsPerPage);

    if (loading) return <div style={{textAlign: 'center', padding: '20px'}}>Chargement des phases...</div>;

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3>Phases du projet {projetNom ? `: ${projetNom}` : ''}</h3>
                {hasRole('CHEF_PROJET') && (
                    <Link to={`/projets/${projetId}/phases/new`} style={{background: '#28a745', color: 'white', padding: '8px 16px', borderRadius: '5px', textDecoration: 'none'}}>
                        + Ajouter phase
                    </Link>
                )}
            </div>

            <div style={{marginBottom: '15px'}}>
                <input
                    type="text"
                    placeholder="Rechercher une phase..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px'}}
                />
            </div>

            {filteredPhases.length === 0 ? (
                <div style={{textAlign: 'center', padding: '30px', background: '#f8f9fa', borderRadius: '10px'}}>
                    Aucune phase pour ce projet
                </div>
            ) : (
                <>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                        <tr style={{background: '#f8f9fa'}}>
                            <th style={{padding: '10px', textAlign: 'left'}}>Code</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Libelle</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Dates</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Montant</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Terminee</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Facturee</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Payee</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentPhases.map(phase => (
                            <tr key={phase.id}>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{phase.code}</td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{phase.libelle}</td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>
                                    {formatDate(phase.dateDebut)} - {formatDate(phase.dateFin)}
                                </td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{formatMontant(phase.montant)}</td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center'}}>
                                    <input
                                        type="checkbox"
                                        checked={phase.estTerminee}
                                        onChange={(e) => updatePhaseEtat(phase.id, 'realisation', e.target.checked)}
                                        disabled={!hasRole('CHEF_PROJET') && !hasRole('DIRECTEUR')}
                                    />
                                </td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center'}}>
                                    <input
                                        type="checkbox"
                                        checked={phase.estFacturee}
                                        onChange={(e) => updatePhaseEtat(phase.id, 'facturation', e.target.checked)}
                                        disabled={!hasRole('COMPTABLE')}
                                    />
                                </td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center'}}>
                                    <input
                                        type="checkbox"
                                        checked={phase.estPayee}
                                        onChange={(e) => updatePhaseEtat(phase.id, 'paiement', e.target.checked)}
                                        disabled={!hasRole('COMPTABLE')}
                                    />
                                </td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>
                                    <Link to={`/phases/${phase.id}`} style={{background: '#3498db', color: 'white', padding: '5px 10px', borderRadius: '3px', textDecoration: 'none', marginRight: '5px', fontSize: '12px'}}>
                                        Details
                                    </Link>
                                    {hasRole('CHEF_PROJET') && (
                                        <Link to={`/phases/edit/${phase.id}`} style={{background: '#f39c12', color: 'white', padding: '5px 10px', borderRadius: '3px', textDecoration: 'none', marginRight: '5px', fontSize: '12px'}}>
                                            Modifier
                                        </Link>
                                    )}
                                    {hasRole('DIRECTEUR') && (
                                        <button onClick={() => handleDelete(phase.id)} style={{background: '#e74c3c', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px'}}>
                                            Supprimer
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div style={{display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px'}}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{padding: '5px 10px', border: '1px solid #ddd', background: 'white', cursor: 'pointer'}}
                            >
                                Precedent
                            </button>
                            <span style={{padding: '5px 10px'}}>Page {currentPage} sur {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{padding: '5px 10px', border: '1px solid #ddd', background: 'white', cursor: 'pointer'}}
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PhaseList;