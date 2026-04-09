import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PhaseEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
        loadPhase();
    }, [id]);

    const loadPhase = async () => {
        try {
            const response = await api.get(`/phases/${id}`);
            const phase = response.data;
            setFormData({
                code: phase.code || '',
                libelle: phase.libelle || '',
                description: phase.description || '',
                dateDebut: phase.dateDebut ? phase.dateDebut.split('T')[0] : '',
                dateFin: phase.dateFin ? phase.dateFin.split('T')[0] : '',
                pourcentage: phase.pourcentage || ''
            });
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du chargement de la phase');
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
            await api.put(`/phases/${id}`, formData);
            navigate(`/phases/${id}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la modification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h2>Modifier la phase</h2>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label>Code *</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                    {errors.code && <span style={{color: 'red', fontSize: '12px'}}>{errors.code}</span>}
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Libelle *</label>
                    <input type="text" name="libelle" value={formData.libelle} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                    {errors.libelle && <span style={{color: 'red', fontSize: '12px'}}>{errors.libelle}</span>}
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                    <div style={{marginBottom: '15px'}}>
                        <label>Date debut *</label>
                        <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                        {errors.dateDebut && <span style={{color: 'red', fontSize: '12px'}}>{errors.dateDebut}</span>}
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label>Date fin *</label>
                        <input type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                        {errors.dateFin && <span style={{color: 'red', fontSize: '12px'}}>{errors.dateFin}</span>}
                    </div>
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label>Pourcentage * (%)</label>
                    <input type="number" step="1" name="pourcentage" value={formData.pourcentage} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px'}} />
                    {errors.pourcentage && <span style={{color: 'red', fontSize: '12px'}}>{errors.pourcentage}</span>}
                </div>
                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                    <button type="button" onClick={() => navigate(`/phases/${id}`)} style={{background: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Annuler</button>
                    <button type="submit" disabled={loading} style={{background: '#3498db', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PhaseEditForm;