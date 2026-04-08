import React, { useState, useEffect } from 'react';
import documentService from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';

const DocumentList = ({ projetId, projetNom }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: '',
        titre: '',
        description: '',
        fichier: null
    });
    const { hasRole } = useAuth();

    useEffect(() => {
        if (projetId) {
            loadDocuments();
        }
    }, [projetId]);

    const loadDocuments = async () => {
        try {
            const data = await documentService.getByProjet(projetId);
            setDocuments(data || []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            fichier: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('code', formData.code);
        submitData.append('type', formData.type);
        submitData.append('titre', formData.titre);
        submitData.append('description', formData.description);
        if (formData.fichier) {
            submitData.append('fichier', formData.fichier);
        }

        try {
            await documentService.create(projetId, submitData);
            setShowForm(false);
            setFormData({ code: '', type: '', titre: '', description: '', fichier: null });
            loadDocuments();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce document ?')) {
            try {
                await documentService.delete(id);
                loadDocuments();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleDownload = async (id, titre) => {
        try {
            const blob = await documentService.download(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = titre;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Erreur lors du telechargement');
        }
    };

    if (loading) return <div>Chargement des documents...</div>;

    return (
        <div style={{marginTop: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <h3>Documents du projet ({documents.length})</h3>
                {hasRole('CHEF_PROJET') && (
                    <button onClick={() => setShowForm(!showForm)} style={{background: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                        {showForm ? 'Annuler' : '+ Ajouter document'}
                    </button>
                )}
            </div>

            {showForm && (
                <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px'}}>
                    <h4>Nouveau document</h4>
                    <form onSubmit={handleSubmit}>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                            <div>
                                <label>Code *</label>
                                <input type="text" name="code" value={formData.code} onChange={handleInputChange} required style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                            </div>
                            <div>
                                <label>Type *</label>
                                <select name="type" value={formData.type} onChange={handleInputChange} required style={{width: '100%', padding: '8px', marginTop: '5px'}}>
                                    <option value="">Selectionner</option>
                                    <option value="CDC">Cahier des charges</option>
                                    <option value="SPEC">Specifications</option>
                                    <option value="ARCHI">Architecture</option>
                                    <option value="CR">Compte rendu</option>
                                    <option value="CONTRAT">Contrat</option>
                                    <option value="AUTRE">Autre</option>
                                </select>
                            </div>
                        </div>
                        <div style={{marginBottom: '15px'}}>
                            <label>Titre *</label>
                            <input type="text" name="titre" value={formData.titre} onChange={handleInputChange} required style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                        </div>
                        <div style={{marginBottom: '15px'}}>
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                        </div>
                        <div style={{marginBottom: '15px'}}>
                            <label>Fichier</label>
                            <input type="file" onChange={handleFileChange} style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                        </div>
                        <button type="submit" style={{background: '#3498db', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Enregistrer</button>
                    </form>
                </div>
            )}

            {documents.length === 0 ? (
                <div style={{textAlign: 'center', padding: '30px', background: '#f8f9fa', borderRadius: '10px'}}>Aucun document</div>
            ) : (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr style={{background: '#f8f9fa'}}>
                            <th style={{padding: '10px', textAlign: 'left'}}>Code</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Type</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Titre</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Description</th>
                            <th style={{padding: '10px', textAlign: 'left'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => (
                            <tr key={doc.id}>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{doc.code}</td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{doc.type}</td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{doc.titre}</td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{doc.description || '-'}</td>
                                <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>
                                    <button onClick={() => handleDownload(doc.id, doc.titre)} style={{background: '#3498db', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px'}}>Telecharger</button>
                                    {hasRole('CHEF_PROJET') && (
                                        <button onClick={() => handleDelete(doc.id)} style={{background: '#e74c3c', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer'}}>Supprimer</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DocumentList;