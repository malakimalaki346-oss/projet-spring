import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './EmployeList.css';
const EmployeList = () => {
    const [employes, setEmployes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { hasRole } = useAuth();

    useEffect(() => {
        loadEmployes();
    }, []);

    const loadEmployes = async () => {
        try {
            const response = await api.get('/employes');
            setEmployes(response.data || []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet employe ?')) {
            try {
                await api.delete(`/employes/${id}`);
                loadEmployes();
            } catch (error) {
                alert(error.response?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    const filteredEmployes = employes.filter(emp =>
        emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;

    return (
        <div style={{padding: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2>Employes</h2>
                {hasRole('ADMIN') && (
                    <Link
                        to="/employes/new"
                        style={{background: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', textDecoration: 'none'}}
                    >
                        + Nouvel employe
                    </Link>
                )}
            </div>

            <div style={{marginBottom: '20px'}}>
                <input
                    type="text"
                    placeholder="Rechercher un employe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px'}}
                />
            </div>

            <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <thead>
                    <tr style={{background: '#f8f9fa'}}>
                        <th style={{padding: '12px', textAlign: 'left'}}>Matricule</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Nom</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Prenom</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Email</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Telephone</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Profil</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployes.map(emp => (
                        <tr key={emp.id}>
                            <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{emp.matricule || '-'}</td>
                            <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{emp.nom || '-'}</td>
                            <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{emp.prenom || '-'}</td>
                            <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{emp.email || '-'}</td>
                            <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{emp.telephone || '-'}</td>
                            <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{emp.profilLibelle || emp.profilCode || '-'}</td>
                            <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>
                                <div style={{display: 'flex', gap: '8px'}}>
                                    <Link to={`/employes/${emp.id}`} style={{background: '#3498db', color: 'white', padding: '5px 10px', borderRadius: '3px', textDecoration: 'none', fontSize: '12px'}}>Voir</Link>
                                    {hasRole('ADMIN') && (
                                        <>
                                            <Link to={`/employes/edit/${emp.id}`} style={{background: '#f39c12', color: 'white', padding: '5px 10px', borderRadius: '3px', textDecoration: 'none', fontSize: '12px'}}>Modifier</Link>
                                            <button onClick={() => handleDelete(emp.id)} style={{background: '#e74c3c', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px'}}>Supprimer</button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeList;