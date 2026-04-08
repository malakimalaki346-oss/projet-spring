import React, { useState } from 'react';
import livrableService from '../../services/livrableService';

const LivrableForm = ({ phaseId, livrable, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: livrable?.code || '',
        libelle: livrable?.libelle || '',
        description: livrable?.description || '',
        cheminFichier: livrable?.cheminFichier || ''
    });
    const [errors, setErrors] = useState({});

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
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (livrable?.id) {
                await livrableService.update(livrable.id, formData);
            } else {
                await livrableService.create(phaseId, formData);
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
            <h3>{livrable?.id ? 'Modifier livrable' : 'Nouveau livrable'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label>Code *</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    {errors.code && <span style={{color: 'red', fontSize: '12px'}}>{errors.code}</span>}
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Libelle *</label>
                    <input type="text" name="libelle" value={formData.libelle} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    {errors.libelle && <span style={{color: 'red', fontSize: '12px'}}>{errors.libelle}</span>}
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Chemin du fichier</label>
                    <input type="text" name="cheminFichier" value={formData.cheminFichier} onChange={handleChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
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

export default LivrableForm;