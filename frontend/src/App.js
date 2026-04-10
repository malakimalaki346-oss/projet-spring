import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider, useAlert } from './context/AlertContext';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import ProjetList from './components/Projets/ProjetList';
import ProjetForm from './components/Projets/ProjetForm';
import ProjetDetail from './components/Projets/ProjetDetail';
import OrganismeList from './components/Organismes/OrganismeList';
import OrganismeDetail from './components/Organismes/OrganismeDetail';
import OrganismeForm from './components/Organismes/OrganismeForm';
import EmployeList from './components/Employes/EmployeList';
import EmployeDetail from './components/Employes/EmployeDetail';
import EmployeForm from './components/Employes/EmployeForm';
import PhaseDetail from './components/Phases/PhaseDetail';
import FactureList from './pages/Factures/FactureList';
import RapportPhases from './pages/Reporting/RapportPhases';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import RoleRoute from './routes/RoleRoute';
import Alert from './components/Common/Alert';
import './App.css';
import PhaseForm from './components/Phases/PhaseForm';
import PhaseEditForm from './components/Phases/PhaseEditForm';


const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();
    const { alerts, removeAlert } = useAlert();

    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Chargement de l'application...</div>;
    }

    if (!isAuthenticated()) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <div className="app">
            <Navbar />
            <Sidebar />
            <div className="main-content">
                <div style={{position: 'fixed', top: '80px', right: '20px', zIndex: 1000, width: '300px'}}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} type={alert.type} message={alert.message} onClose={() => removeAlert(alert.id)} />
                    ))}
                </div>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projets" element={<ProjetList />} />
                    <Route path="/projets/new" element={<ProjetForm />} />
                    <Route path="/projets/edit/:id" element={<ProjetForm />} />
                    <Route path="/projets/:id" element={<ProjetDetail />} />
                    <Route path="/organismes" element={<OrganismeList />} />
                    <Route path="/organismes/:id" element={<OrganismeDetail />} />
                    <Route path="/organismes/new" element={
                        <RoleRoute allowedRoles={['SECRETAIRE', 'ADMIN']}>
                            <OrganismeForm />
                        </RoleRoute>
                    } />
                    <Route path="/organismes/edit/:id" element={
                        <RoleRoute allowedRoles={['SECRETAIRE', 'ADMIN']}>
                            <OrganismeForm />
                        </RoleRoute>
                    } />
                    <Route path="/employes" element={<EmployeList />} />
                    <Route path="/employes/new" element={<EmployeForm />} />
                    <Route path="/employes/:id" element={<EmployeDetail />} />
                    <Route path="/employes/edit/:id" element={<EmployeForm />} />
                    <Route path="/projets/:id/phases/new" element={<PhaseForm />} />
                    <Route path="/phases/edit/:id" element={<PhaseEditForm />} />
                    <Route path="/organismes/new" element={<OrganismeForm />} />
                    <Route path="/organismes/edit/:id" element={<OrganismeForm />} />
                    <Route path="/phases/:id" element={<PhaseDetail />} />
                    <Route path="/factures" element={
                        <RoleRoute allowedRoles={['COMPTABLE', 'DIRECTEUR','ADMIN']}>
                            <FactureList />
                        </RoleRoute>
                    } />
                    <Route path="/rapport-phases" element={
                        <RoleRoute allowedRoles={['COMPTABLE', 'DIRECTEUR','ADMIN']}>
                            <RapportPhases />
                        </RoleRoute>
                    } />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/organismes/edit/:id" element={<OrganismeForm />} />

                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AlertProvider>
                    <AppContent />
                </AlertProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;