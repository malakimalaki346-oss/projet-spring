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
    const [showAffectationForm, setShowAffectationForm] = useState(false);
    const [showLivrableForm, setShowLivrableForm] = useState(false);
    const [employes, setEmployes] = useState([]);
    const [newAffectation, setNewAffectation] = useState({
        employeId: '',
        dateDebut: '',
        dateFin: '',
        role: ''
    });
    const [newLivrable, setNewLivrable] = useState({
        code: '',
        libelle: '',
        description: '',
        cheminFichier: ''
    });
    const { hasRole } = useAuth();

    useEffect(() => {
        loadPhaseData();
        loadEmployes();
    }, [id]);

    const loadPhaseData = async () => {
        try {
            const phaseResponse = await api.get(`/phases/${id}`);
            setPhase(phaseResponse.data);

            const affectationsResponse = await api.get(`/phases/${id}/employes`);
            setAffectations(affectationsResponse.data || []);

            const livrablesResponse = await api.get(`/phases/${id}/livrables`);
            setLivrables(livrablesResponse.data || []);
        } catch (error) {
            console.error('Erreur:', error);
            setError(error.response?.data?.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const loadEmployes = async () => {
        try {
            const response = await api.get('/employes');
            setEmployes(response.data || []);
        } catch (error) {
            console.error('Erreur chargement employes:', error);
        }
    };

    const handleAffectationChange = (e) => {
        setNewAffectation({
            ...newAffectation,
            [e.target.name]: e.target.value
        });
    };

    const handleLivrableChange = (e) => {
        setNewLivrable({
            ...newLivrable,
            [e.target.name]: e.target.value
        });
    };

    const addAffectation = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/phases/${id}/employes/${newAffectation.employeId}`, {
                dateDebut: newAffectation.dateDebut,
                dateFin: newAffectation.dateFin,
                role: newAffectation.role
            });
            setShowAffectationForm(false);
            setNewAffectation({ employeId: '', dateDebut: '', dateFin: '', role: '' });
            loadPhaseData();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    const addLivrable = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/phases/${id}/livrables`, newLivrable);
            setShowLivrableForm(false);
            setNewLivrable({ code: '', libelle: '', description: '', cheminFichier: '' });
            loadPhaseData();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    const deleteAffectation = async (employeId) => {
        if (window.confirm('Supprimer cette affectation ?')) {
            try {
                await api.delete(`/phases/${id}/employes/${employeId}`);
                loadPhaseData();
            } catch (error) {
                alert(error.response?.data?.message || 'Erreur');
            }
        }
    };

    const deleteLivrable = async (livrableId) => {
        if (window.confirm('Supprimer ce livrable ?')) {
            try {
                await api.delete(`/livrables/${livrableId}`);
                loadPhaseData();
            } catch (error) {
                alert(error.response?.data?.message || 'Erreur');
            }
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

    const canManage = hasRole('CHEF_PROJET') || hasRole('DIRECTEUR') || hasRole('ADMIN');

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
                    {canManage && (
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
                            <input type="checkbox" checked={phase.estTerminee || false} onChange={(e) => updateEtat('realisation', e.target.checked)} disabled={!hasRole('CHEF_PROJET') && !hasRole('DIRECTEUR') && !hasRole('ADMIN')} />
                            <strong>Terminee</strong>
                        </label>
                    </div>
                    <div>
                        <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <input type="checkbox" checked={phase.estFacturee || false} onChange={(e) => updateEtat('facturation', e.target.checked)} disabled={!hasRole('COMPTABLE') && !hasRole('ADMIN')} />
                            <strong>Facturee</strong>
                        </label>
                    </div>
                    <div>
                        <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <input type="checkbox" checked={phase.estPayee || false} onChange={(e) => updateEtat('paiement', e.target.checked)} disabled={!hasRole('COMPTABLE') && !hasRole('ADMIN')} />
                            <strong>Payee</strong>
                        </label>
                    </div>
                </div>
            </div>


            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h3>Employes affectes ({affectations.length})</h3>
                    {canManage && (
                        <button onClick={() => setShowAffectationForm(!showAffectationForm)} style={{background: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                            + Ajouter affectation
                        </button>
                    )}
                </div>

                {showAffectationForm && (
                    <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
                        <h4>Nouvelle affectation</h4>
                        <form onSubmit={addAffectation}>
                            <div style={{marginBottom: '10px'}}>
                                <label>Employe</label>
                                <select name="employeId" value={newAffectation.employeId} onChange={handleAffectationChange} required style={{width: '100%', padding: '8px', marginTop: '5px'}}>
                                    <option value="">Selectionner</option>
                                    {employes.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.prenom} {emp.nom} ({emp.matricule})</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                                <div>
                                    <label>Date debut</label>
                                    <input type="date" name="dateDebut" value={newAffectation.dateDebut} onChange={handleAffectationChange} required style={{width: '100%', padding: '8px'}} />
                                </div>
                                <div>
                                    <label>Date fin</label>
                                    <input type="date" name="dateFin" value={newAffectation.dateFin} onChange={handleAffectationChange} required style={{width: '100%', padding: '8px'}} />
                                </div>
                            </div>
                            <div style={{marginBottom: '10px'}}>
                                <label>Role</label>
                                <input type="text" name="role" value={newAffectation.role} onChange={handleAffectationChange} style={{width: '100%', padding: '8px'}} />
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="submit" style={{background: '#3498db', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Ajouter</button>
                                <button type="button" onClick={() => setShowAffectationForm(false)} style={{background: '#6c757d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Annuler</button>
                            </div>
                        </form>
                    </div>
                )}

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
                            {canManage && <th style={{padding: '12px', textAlign: 'left'}}>Actions</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {affectations.map(aff => (
                            <tr key={aff.employeId}>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{aff.employePrenom} {aff.employeNom} ({aff.employeMatricule})</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{aff.role || '-'}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatDate(aff.dateDebut)}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatDate(aff.dateFin)}</td>
                                {canManage && (
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>
                                        <button onClick={() => deleteAffectation(aff.employeId)} style={{background: '#e74c3c', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer'}}>Supprimer</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>


            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h3>Livrables ({livrables.length})</h3>
                    {canManage && (
                        <button onClick={() => setShowLivrableForm(!showLivrableForm)} style={{background: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                            + Ajouter livrable
                        </button>
                    )}
                </div>

                {showLivrableForm && (
                    <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
                        <h4>Nouveau livrable</h4>
                        <form onSubmit={addLivrable}>
                            <div style={{marginBottom: '10px'}}>
                                <label>Code</label>
                                <input type="text" name="code" value={newLivrable.code} onChange={handleLivrableChange} required style={{width: '100%', padding: '8px'}} />
                            </div>
                            <div style={{marginBottom: '10px'}}>
                                <label>Libelle</label>
                                <input type="text" name="libelle" value={newLivrable.libelle} onChange={handleLivrableChange} required style={{width: '100%', padding: '8px'}} />
                            </div>
                            <div style={{marginBottom: '10px'}}>
                                <label>Description</label>
                                <textarea name="description" value={newLivrable.description} onChange={handleLivrableChange} rows="2" style={{width: '100%', padding: '8px'}} />
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="submit" style={{background: '#3498db', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Ajouter</button>
                                <button type="button" onClick={() => setShowLivrableForm(false)} style={{background: '#6c757d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Annuler</button>
                            </div>
                        </form>
                    </div>
                )}

                {livrables.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '30px', color: '#999'}}>Aucun livrable</div>
                ) : (
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                        <tr style={{background: '#f8f9fa'}}>
                            <th style={{padding: '12px', textAlign: 'left'}}>Code</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Libelle</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Description</th>
                            {canManage && <th style={{padding: '12px', textAlign: 'left'}}>Actions</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {livrables.map(liv => (
                            <tr key={liv.id}>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{liv.code || '-'}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{liv.libelle || '-'}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{liv.description || '-'}</td>
                                {canManage && (
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>
                                        <button onClick={() => deleteLivrable(liv.id)} style={{background: '#e74c3c', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer'}}>Supprimer</button>
                                    </td>
                                )}
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