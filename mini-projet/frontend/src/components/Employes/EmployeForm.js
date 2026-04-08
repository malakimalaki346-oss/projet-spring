import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EmployeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profils, setProfils] = useState([]);
    const [formData, setFormData] = useState({
        matricule: '',
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        login: '',
        password: '',
        profilId: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadProfils();
        if (id) {
            loadEmploye();
        }
    }, [id]);

    const loadProfils = async () => {
        try {
            const response = await api.get('/profils');
            setProfils(response.data || []);
        } catch (error) {
            console.error('Erreur chargement profils:', error);
        }
    };

    const loadEmploye = async () => {
        try {
            const response = await api.get(`/employes/${id}`);
            const data = response.data;
            setFormData({
                matricule: data.matricule || '',
                nom: data.nom || '',
                prenom: data.prenom || '',
                email: data.email || '',
                telephone: data.telephone || '',
                login: data.login || '',
                password: '',
                profilId: data.profilId || ''
            });
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.matricule) newErrors.matricule = 'Matricule requis';
        if (!formData.nom) newErrors.nom = 'Nom requis';
        if (!formData.prenom) newErrors.prenom = 'Prenom requis';
        if (!formData.email) newErrors.email = 'Email requis';
        if (!formData.login) newErrors.login = 'Login requis';
        if (!id && !formData.password) newErrors.password = 'Mot de passe requis';
        if (!formData.profilId) newErrors.profilId = 'Profil requis';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (id) {
                await api.put(`/employes/${id}`, formData);
            } else {
                await api.post('/employes', formData);
            }
            navigate('/employes');
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h2>{id ? 'Modifier employe' : 'Nouvel employe'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label>Matricule *</label>
                    <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                    {errors.matricule && <span style={{color: 'red', fontSize: '12px'}}>{errors.matricule}</span>}
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                    <div style={{marginBottom: '15px'}}>
                        <label>Nom *</label>
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                        {errors.nom && <span style={{color: 'red', fontSize: '12px'}}>{errors.nom}</span>}
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label>Prenom *</label>
                        <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                        {errors.prenom && <span style={{color: 'red', fontSize: '12px'}}>{errors.prenom}</span>}
                    </div>
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                    {errors.email && <span style={{color: 'red', fontSize: '12px'}}>{errors.email}</span>}
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Telephone</label>
                    <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Login *</label>
                    <input type="text" name="login" value={formData.login} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                    {errors.login && <span style={{color: 'red', fontSize: '12px'}}>{errors.login}</span>}
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Mot de passe {!id && '*'}</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                    {errors.password && <span style={{color: 'red', fontSize: '12px'}}>{errors.password}</span>}
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Profil *</label>
                    <select name="profilId" value={formData.profilId} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}}>
                        <option value="">Selectionner</option>
                        {profils.map(profil => (
                            <option key={profil.id} value={profil.id}>{profil.libelle}</option>
                        ))}
                    </select>
                    {errors.profilId && <span style={{color: 'red', fontSize: '12px'}}>{errors.profilId}</span>}
                </div>

                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                    <button type="button" onClick={() => navigate('/employes')} style={{background: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Annuler</button>
                    <button type="submit" disabled={loading} style={{background: '#3498db', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeForm;