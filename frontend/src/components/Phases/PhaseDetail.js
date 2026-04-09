import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PhaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [phase, setPhase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [affectations, setAffectations] = useState([]);
    const [livrables, setLivrables] = useState([]);
    const { hasRole } = useAuth();

    useEffect(() => {
        loadPhaseData();
    }, [id]);

    const loadPhaseData = async () => {
        try {
            console.log('Chargement phase ID:', id);

            const phaseResponse = await api.get(`/phases/${id}`);
            console.log('Phase:', phaseResponse.data);
            setPhase(phaseResponse.data);

            const affectationsResponse = await api.get(`/phases/${id}/employes`);
            console.log('Affectations:', affectationsResponse.data);
            setAffectations(affectationsResponse.data || []);

            const livrablesResponse = await api.get(`/phases/${id}/livrables`);
            console.log('Livrables:', livrablesResponse.data);
            setLivrables(livrablesResponse.data || []);

        } catch (error) {
            console.error('Erreur:', error);
            setError(error.response?.data?.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Non definie';
        try {
            return new Date(dateString).toLocaleDateString('fr-FR');
        } catch {
            return 'Date invalide';
        }
    };

    const formatMontant = (montant) => {
        if (!montant && montant !== 0) return '0 DH';
        return montant.toLocaleString('fr-FR') + ' DH';
    };

    const updateEtat = async (field, value) => {
        try {
            if (field === 'realisation') {
                await api.patch(`/phases/${id}/realisation?terminee=${value}`);
            } else if (field === 'facturation') {
                await api.patch(`/phases/${id}/facturation?facturee=${value}`);
            } else if (field === 'paiement') {
                await api.patch(`/phases/${id}/paiement?payee=${value}`);
            }
            loadPhaseData();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;
    if (error) return <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>Erreur: {error}</div>;
    if (!phase) return <div style={{textAlign: 'center', padding: '50px'}}>Phase non trouvee</div>;

    return (
        <div style={{padding: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                <h2>Phase: {phase.libelle || phase.code}</h2>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button
                        onClick={() => navigate(`/projets/${phase.projetId}`)}
                        style={{background: '#6c757d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                    >
                        Retour au projet
                    </button>
                    {(hasRole('CHEF_PROJET') || hasRole('DIRECTEUR') || hasRole('ADMIN')) && (
                        <button
                            onClick={() => navigate(`/phases/edit/${id}`)}
                            style={{background: '#f39c12', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                        >
                            Modifier
                        </button>
                    )}
                </div>
            </div>

            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px'}}>
                <h3>Informations generales</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '15px'}}>
                    <div><strong>Code:</strong> {phase.code || '-'}</div>
                    <div><strong>Projet:</strong> {phase.projetNom || '-'}</div>
                    <div><strong>Libelle:</strong> {phase.libelle || '-'}</div>
                    <div><strong>Montant:</strong> {formatMontant(phase.montant)}</div>
                    <div><strong>Pourcentage:</strong> {phase.pourcentage || 0}%</div>
                    <div><strong>Date debut:</strong> {formatDate(phase.dateDebut)}</div>
                    <div><strong>Date fin:</strong> {formatDate(phase.dateFin)}</div>
                </div>
                {phase.description && (
                    <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee'}}>
                        <strong>Description:</strong> {phase.description}
                    </div>
                )}
            </div>

            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px'}}>
                <h3>Etat de la phase</h3>
                <div style={{display: 'flex', gap: '30px', marginTop: '15px'}}>
                    <div>
                        <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <input
                                type="checkbox"
                                checked={phase.estTerminee || false}
                                onChange={(e) => updateEtat('realisation', e.target.checked)}
                                disabled={!hasRole('CHEF_PROJET') && !hasRole('DIRECTEUR') && !hasRole('ADMIN')}
                            />
                            <strong>Terminee</strong>
                        </label>
                    </div>
                    <div>
                        <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <input
                                type="checkbox"
                                checked={phase.estFacturee || false}
                                onChange={(e) => updateEtat('facturation', e.target.checked)}
                                disabled={!hasRole('COMPTABLE') && !hasRole('ADMIN')}
                            />
                            <strong>Facturee</strong>
                        </label>
                    </div>
                    <div>
                        <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <input
                                type="checkbox"
                                checked={phase.estPayee || false}
                                onChange={(e) => updateEtat('paiement', e.target.checked)}
                                disabled={!hasRole('COMPTABLE') && !hasRole('ADMIN')}
                            />
                            <strong>Payee</strong>
                        </label>
                    </div>
                </div>
            </div>

            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px'}}>
                <h3>Employes affectes ({affectations.length})</h3>
                {affectations.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '30px', color: '#999'}}>Aucun employe affecte</div>
                ) : (
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                        <tr style={{background: '#f8f9fa'}}>
                            <th style={{padding: '12px', textAlign: 'left'}}>Employe</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Role</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Date debut</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Date fin</th>
                        </tr>
                        </thead>
                        <tbody>
                        {affectations.map(aff => (
                            <tr key={aff.employeId}>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>
                                    {aff.employePrenom} {aff.employeNom} ({aff.employeMatricule})
                                </td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{aff.role || '-'}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatDate(aff.dateDebut)}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatDate(aff.dateFin)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h3>Livrables ({livrables.length})</h3>
                {livrables.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '30px', color: '#999'}}>Aucun livrable</div>
                ) : (
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                        <tr style={{background: '#f8f9fa'}}>
                            <th style={{padding: '12px', textAlign: 'left'}}>Code</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Libelle</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {livrables.map(liv => (
                            <tr key={liv.id}>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{liv.code || '-'}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{liv.libelle || '-'}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{liv.description || '-'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PhaseDetail;