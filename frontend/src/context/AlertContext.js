import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const addAlert = (type, message, duration = 3000) => {
        const id = Date.now();
        setAlerts(prev => [...prev, { id, type, message, duration }]);
        setTimeout(() => removeAlert(id), duration);
    };

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const success = (msg) => addAlert('success', msg);
    const error = (msg) => addAlert('error', msg);
    const warning = (msg) => addAlert('warning', msg);
    const info = (msg) => addAlert('info', msg);

    return (
        <AlertContext.Provider value={{ alerts, success, error, warning, info, removeAlert }}>
            {children}
        </AlertContext.Provider>
    );
};