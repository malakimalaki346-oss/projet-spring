import React, { useState, useEffect } from 'react';
import affectationService from '../../services/affectationService';
import employeService from '../../services/employeService';

const AffectationForm = ({ phaseId, employeId, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [employes, setEmployes] = useState([]);
    const [formData, setFormData] = useState({
        employeId: employeId || '',
        dateDebut: '',
        dateFin: '',
        role: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadEmployes();
        if (employeId) {
            loadAffectation();
        }
    }, [employeId, phaseId]);

    const loadEmployes = async () => {
        try {
            const data = await employeService.getAll();
            setEmployes(data || []);
        } catch (error) {
            console.error('Erreur chargement employes:', error);
        }
    };

    const loadAffectation = async () => {
        try {
            const data = await affectationService.getOne(phaseId, employeId);
            setFormData({
                employeId: data.employeId,
                dateDebut: data.dateDebut?.split('T')[0] || '',
                dateFin: data.dateFin?.split('T')[0] || '',
                role: data.role || ''
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
        if (!formData.employeId) newErrors.employeId = 'Employe requis';
        if (!formData.dateDebut) newErrors.dateDebut = 'Date debut requise';
        if (!formData.dateFin) newErrors.dateFin = 'Date fin requise';
        if (formData.dateDebut > formData.dateFin) {
            newErrors.dateFin = 'Date fin doit etre apres date debut';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const submitData = {
                dateDebut: formData.dateDebut,
                dateFin: formData.dateFin,
                role: formData.role
            };

            if (employeId) {
                await affectationService.update(phaseId, formData.employeId, submitData);
            } else {
                await affectationService.create(phaseId, formData.employeId, submitData);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px'}}>
            <h3>{employeId ? 'Modifier affectation' : 'Nouvelle affectation'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label>Employe *</label>
                    <select
                        name="employeId"
                        value={formData.employeId}
                        onChange={handleChange}
                        disabled={!!employeId}
                        style={{width: '100%', padding: '8px', marginTop: '5px'}}
                    >
                        <option value="">Selectionner</option>
                        {employes.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.prenom} {emp.nom} ({emp.matricule})</option>
                        ))}
                    </select>
                    {errors.employeId && <span style={{color: 'red', fontSize: '12px'}}>{errors.employeId}</span>}
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                    <div style={{marginBottom: '15px'}}>
                        <label>Date debut *</label>
                        <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                        {errors.dateDebut && <span style={{color: 'red', fontSize: '12px'}}>{errors.dateDebut}</span>}
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label>Date fin *</label>
                        <input type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                        {errors.dateFin && <span style={{color: 'red', fontSize: '12px'}}>{errors.dateFin}</span>}
                    </div>
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Role</label>
                    <input type="text" name="role" value={formData.role} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                </div>

                <div style={{display: 'flex', gap: '10px'}}>
                    <button type="button" onClick={onCancel} style={{background: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Annuler</button>
                    <button type="submit" disabled={loading} style={{background: '#3498db', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AffectationForm;