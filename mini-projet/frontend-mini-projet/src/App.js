import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import ProjetList from './components/Projets/ProjetList';
import ProjetForm from './components/Projets/ProjetForm';
import ProjetDetail from './components/Projets/ProjetDetail';
import './App.css';

const AppContent = () => {
    const { isAuthenticated } = useAuth();

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
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={<Navigate to="/dashboard" />} />
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