import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ProjetForm.css';

const ProjetForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { hasRole, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [organismes, setOrganismes] = useState([]);
    const [chefs, setChefs] = useState([]);
    const [formData, setFormData] = useState({
        code: '',
        nom: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        montantGlobal: '',
        organismeId: '',
        chefProjetId: ''
    });
    const [errors, setErrors] = useState({});

    const isSecretaire = hasRole('SECRETAIRE');
    const isDirecteur = hasRole('DIRECTEUR');
    const isAdmin = hasRole('ADMIN');

    useEffect(() => {
        loadOrganismes();
        loadChefs();
        if (id) {
            loadProjet();
        }
    }, [id]);

    const loadOrganismes = async () => {
        try {
            const response = await api.get('/organismes');
            setOrganismes(response.data || []);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const loadChefs = async () => {
        try {
            const response = await api.get('/employes/profil/CHEF_PROJET');
            setChefs(response.data || []);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const loadProjet = async () => {
        try {
            const response = await api.get(`/projets/${id}`);
            const data = response.data;
            setFormData({
                code: data.code || '',
                nom: data.nom || '',
                description: data.description || '',
                dateDebut: data.dateDebut ? data.dateDebut.split('T')[0] : '',
                dateFin: data.dateFin ? data.dateFin.split('T')[0] : '',
                montantGlobal: data.montantGlobal || '',
                organismeId: data.organismeId || '',
                chefProjetId: data.chefProjetId || ''
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
        if (!formData.dateDebut) newErrors.dateDebut = 'Date debut requise';
        if (!formData.dateFin) newErrors.dateFin = 'Date fin requise';
        if (formData.dateDebut > formData.dateFin) {
            newErrors.dateFin = 'Date fin doit etre apres date debut';
        }
        if (!formData.montantGlobal || formData.montantGlobal <= 0) {
            newErrors.montantGlobal = 'Montant positif requis';
        }
        if (!formData.organismeId) newErrors.organismeId = 'Organisme requis';
        if (!formData.chefProjetId) newErrors.chefProjetId = 'Chef projet requis';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (id) {
                await api.put(`/projets/${id}`, formData);
            } else {
                await api.post('/projets', formData);
            }
            navigate('/projets');
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const isMontantDisabled = isSecretaire;
    const isChefDisabled = isSecretaire;

    return (
        <div className="projet-form">
            <h2>{id ? 'Modifier le projet' : 'Nouveau projet'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Code *</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} />
                    {errors.code && <span className="error">{errors.code}</span>}
                </div>

                <div className="form-group">
                    <label>Nom *</label>
                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} />
                    {errors.nom && <span className="error">{errors.nom}</span>}
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Date debut *</label>
                        <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} />
                        {errors.dateDebut && <span className="error">{errors.dateDebut}</span>}
                    </div>
                    <div className="form-group">
                        <label>Date fin *</label>
                        <input type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} />
                        {errors.dateFin && <span className="error">{errors.dateFin}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Montant global (DH) *</label>
                    <input
                        type="number"
                        name="montantGlobal"
                        value={formData.montantGlobal}
                        onChange={handleChange}
                        disabled={isMontantDisabled}
                        style={{backgroundColor: isMontantDisabled ? '#f0f0f0' : 'white'}}
                    />
                    {errors.montantGlobal && <span className="error">{errors.montantGlobal}</span>}
                </div>

                <div className="form-group">
                    <label>Organisme client *</label>
                    <select name="organismeId" value={formData.organismeId} onChange={handleChange}>
                        <option value="">Selectionner</option>
                        {organismes.map(org => (
                            <option key={org.id} value={org.id}>{org.nom}</option>
                        ))}
                    </select>
                    {errors.organismeId && <span className="error">{errors.organismeId}</span>}
                </div>

                <div className="form-group">
                    <label>Chef de projet *</label>
                    <select
                        name="chefProjetId"
                        value={formData.chefProjetId}
                        onChange={handleChange}
                        disabled={isChefDisabled}
                        style={{backgroundColor: isChefDisabled ? '#f0f0f0' : 'white'}}
                    >
                        <option value="">Selectionner</option>
                        {chefs.map(chef => (
                            <option key={chef.id} value={chef.id}>{chef.prenom} {chef.nom}</option>
                        ))}
                    </select>
                    {errors.chefProjetId && <span className="error">{errors.chefProjetId}</span>}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/projets')} className="btn-cancel">Annuler</button>
                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjetForm;