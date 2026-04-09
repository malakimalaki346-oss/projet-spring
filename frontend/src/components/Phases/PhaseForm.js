import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PhaseForm = () => {
    const { id: projetId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [projet, setProjet] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        libelle: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        pourcentage: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadProjet();
    }, [projetId]);

    const loadProjet = async () => {
        try {
            const response = await api.get(`/projets/${projetId}`);
            setProjet(response.data);
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
        if (!formData.libelle) newErrors.libelle = 'Libelle requis';
        if (!formData.dateDebut) newErrors.dateDebut = 'Date debut requise';
        if (!formData.dateFin) newErrors.dateFin = 'Date fin requise';
        if (!formData.pourcentage) newErrors.pourcentage = 'Pourcentage requis';
        if (formData.pourcentage < 0 || formData.pourcentage > 100) {
            newErrors.pourcentage = 'Pourcentage entre 0 et 100';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await api.post(`/projets/${projetId}/phases`, formData);
            navigate(`/projets/${projetId}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px', background: 'white', borderRadius: '10px'}}>
            <h2>Ajouter une phase au projet: {projet?.nom}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label>Code *</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    {errors.code && <span style={{color: 'red'}}>{errors.code}</span>}
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Libelle *</label>
                    <input type="text" name="libelle" value={formData.libelle} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    {errors.libelle && <span style={{color: 'red'}}>{errors.libelle}</span>}
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                    <div style={{marginBottom: '15px'}}>
                        <label>Date debut *</label>
                        <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                        {errors.dateDebut && <span style={{color: 'red'}}>{errors.dateDebut}</span>}
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label>Date fin *</label>
                        <input type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                        {errors.dateFin && <span style={{color: 'red'}}>{errors.dateFin}</span>}
                    </div>
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Pourcentage *</label>
                    <input type="number" name="pourcentage" value={formData.pourcentage} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    {errors.pourcentage && <span style={{color: 'red'}}>{errors.pourcentage}</span>}
                </div>
                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                    <button type="button" onClick={() => navigate(`/projets/${projetId}`)} style={{background: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Annuler</button>
                    <button type="submit" disabled={loading} style={{background: '#3498db', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PhaseForm;