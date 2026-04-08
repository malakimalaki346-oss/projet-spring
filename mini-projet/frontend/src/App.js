import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import ProjetList from './components/Projets/ProjetList';
import ProjetForm from './components/Projets/ProjetForm';
import ProjetDetail from './components/Projets/ProjetDetail';
import OrganismeList from './components/Organismes/OrganismeList';
import OrganismeDetail from './components/Organismes/OrganismeDetail';
import EmployeList from './components/Employes/EmployeList';
import EmployeDetail from './components/Employes/EmployeDetail';
import EmployeForm from './components/Employes/EmployeForm';
import PhaseDetail from './components/Phases/PhaseDetail';
import './App.css';

const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Chargement de l'application...</div>;
    }

    if (!isAuthenticated()) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <div className="app">
            <Navbar />
            <Sidebar />
            <div className="main-content">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projets" element={<ProjetList />} />
                    <Route path="/projets/new" element={<ProjetForm />} />
                    <Route path="/projets/edit/:id" element={<ProjetForm />} />
                    <Route path="/projets/:id" element={<ProjetDetail />} />
                    <Route path="/organismes" element={<OrganismeList />} />
                    <Route path="/organismes/:id" element={<OrganismeDetail />} />
                    <Route path="/employes" element={<EmployeList />} />
                    <Route path="/employes/new" element={<EmployeForm />} />
                    <Route path="/employes/:id" element={<EmployeDetail />} />
                    <Route path="/employes/edit/:id" element={<EmployeForm />} />
                    <Route path="/phases/:id" element={<PhaseDetail />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;