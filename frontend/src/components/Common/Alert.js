import React, { useEffect, useState } from 'react';

const Alert = ({ type, message, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    const styles = {
        success: { background: '#d4edda', color: '#155724', borderLeft: '4px solid #28a745' },
        error: { background: '#f8d7da', color: '#721c24', borderLeft: '4px solid #dc3545' },
        warning: { background: '#fff3cd', color: '#856404', borderLeft: '4px solid #ffc107' },
        info: { background: '#d1ecf1', color: '#0c5460', borderLeft: '4px solid #17a2b8' }
    };

    return (
        <div style={{...styles[type], padding: '12px 20px', marginBottom: '10px', borderRadius: '4px'}}>
            {message}
        </div>
    );
};

export default Alert;