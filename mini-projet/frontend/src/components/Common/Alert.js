import React, { useState, useEffect } from 'react';

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
        success: { background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
        error: { background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
        warning: { background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' },
        info: { background: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' }
    };

    return (
        <div style={{
            ...styles[type],
            padding: '12px 20px',
            borderRadius: '5px',
            marginBottom: '15px',
            position: 'relative'
        }}>
            <span>{message}</span>
            <button
                onClick={() => { setVisible(false); if (onClose) onClose(); }}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                ×
            </button>
        </div>
    );
};

export default Alert;