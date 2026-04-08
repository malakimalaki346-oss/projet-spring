import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EmployeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employe, setEmploye] = useState(null);
    const [projets, setProjets] = useState([]);
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { hasRole } = useAuth();

    useEffect(() => {
        loadEmployeData();
    }, [id]);

    const loadEmployeData = async () => {
        try {
            console.log('Chargement employe ID:', id);

            const employeResponse = await api.get(`/employes/${id}`);
            console.log('Employe:', employeResponse.data);
            setEmploye(employeResponse.data);

            const projetsResponse = await api.get(`/projets/chef/${id}`);
            console.log('Projets diriges:', projetsResponse.data);
            setProjets(projetsResponse.data || []);

            const phasesResponse = await api.get(`/employes/${id}/phases`);
            console.log('Phases affectees:', phasesResponse.data);
            setPhases(phasesResponse.data || []);

        } catch (error) {
            console.error('Erreur:', error);
            setError(error.response?.data?.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Supprimer cet employe ?')) {
            try {
                await api.delete(`/employes/${id}`);
                navigate('/employes');
            } catch (error) {
                alert(error.response?.data?.message || 'Erreur lors de la suppression');
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

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;
    if (error) return <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>Erreur: {error}</div>;
    if (!employe) return <div style={{textAlign: 'center', padding: '50px'}}>Employe non trouve</div>;

    return (
        <div style={{padding: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                <h2>{employe.prenom} {employe.nom}</h2>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button
                        onClick={() => navigate('/employes')}
                        style={{background: '#6c757d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                    >
                        Retour
                    </button>
                    {hasRole('ADMIN') && (
                        <>
                            <button
                                onClick={() => navigate(`/employes/edit/${id}`)}
                                style={{background: '#f39c12', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                            >
                                Modifier
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{background: '#e74c3c', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                            >
                                Supprimer
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px'}}>
                <h3>Informations personnelles</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '15px'}}>
                    <div><strong>Matricule:</strong> {employe.matricule || '-'}</div>
                    <div><strong>Nom:</strong> {employe.nom || '-'}</div>
                    <div><strong>Prenom:</strong> {employe.prenom || '-'}</div>
                    <div><strong>Email:</strong> {employe.email || '-'}</div>
                    <div><strong>Telephone:</strong> {employe.telephone || '-'}</div>
                    <div><strong>Login:</strong> {employe.login || '-'}</div>
                    <div><strong>Profil:</strong> {employe.profilLibelle || employe.profilCode || '-'}</div>
                </div>
            </div>

            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px'}}>
                <h3>Projets diriges ({projets.length})</h3>
                {projets.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '30px', color: '#999'}}>Aucun projet dirige</div>
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
                            {projets.map(projet => (
                                <tr key={projet.id}>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{projet.code || '-'}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{projet.nom || '-'}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{projet.organismeNom || '-'}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatMontant(projet.montantGlobal)}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>
                                        <button
                                            onClick={() => navigate(`/projets/${projet.id}`)}
                                            style={{background: '#3498db', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer'}}
                                        >
                                            Voir projet
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h3>Phases affectees ({phases.length})</h3>
                {phases.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '30px', color: '#999'}}>Aucune phase affectee</div>
                ) : (
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                            <tr style={{background: '#f8f9fa'}}>
                                <th style={{padding: '12px', textAlign: 'left'}}>Phase</th>
                                <th style={{padding: '12px', textAlign: 'left'}}>Projet</th>
                                <th style={{padding: '12px', textAlign: 'left'}}>Role</th>
                                <th style={{padding: '12px', textAlign: 'left'}}>Dates</th>
                                <th style={{padding: '12px', textAlign: 'left'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {phases.map(phase => (
                                <tr key={phase.phaseId}>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{phase.phaseLibelle || '-'}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{phase.projetNom || '-'}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{phase.role || '-'}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{formatDate(phase.dateDebut)} - {formatDate(phase.dateFin)}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>
                                        <button
                                            onClick={() => navigate(`/phases/${phase.phaseId}`)}
                                            style={{background: '#3498db', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer'}}
                                        >
                                            Voir phase
                                        </button>
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

export default EmployeDetail;