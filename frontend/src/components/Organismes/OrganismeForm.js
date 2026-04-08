import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OrganismeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        nom: '',
        adresse: '',
        telephone: '',
        contactNom: '',
        contactEmail: '',
        siteWeb: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            loadOrganisme();
        }
    }, [id]);

    const loadOrganisme = async () => {
        try {
            const response = await api.get(`/organismes/${id}`);
            const data = response.data;
            setFormData({
                code: data.code || '',
                nom: data.nom || '',
                adresse: data.adresse || '',
                telephone: data.telephone || '',
                contactNom: data.contactNom || '',
                contactEmail: data.contactEmail || '',
                siteWeb: data.siteWeb || ''
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
        if (!formData.code) newErrors.code = 'Code requis';
        if (!formData.nom) newErrors.nom = 'Nom requis';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (id) {
                await api.put(`/organismes/${id}`, formData);
            } else {
                await api.post('/organismes', formData);
            }
            navigate('/organismes');
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h2>{id ? 'Modifier organisme' : 'Nouvel organisme'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label>Code *</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    {errors.code && <span style={{color: 'red'}}>{errors.code}</span>}
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Nom *</label>
                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    {errors.nom && <span style={{color: 'red'}}>{errors.nom}</span>}
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Adresse</label>
                    <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Telephone</label>
                    <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Contact</label>
                    <input type="text" name="contactNom" value={formData.contactNom} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Email contact</label>
                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Site web</label>
                    <input type="text" name="siteWeb" value={formData.siteWeb} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button type="button" onClick={() => navigate('/organismes')} style={{background: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Annuler</button>
                    <button type="submit" disabled={loading} style={{background: '#3498db', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrganismeForm;