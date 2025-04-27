import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Notification = ({ message, type = 'success' }) => {
    useEffect(() => {
        if (message) {
            if (type === 'success') {
                toast.success(message);
            } else if (type === 'error') {
                toast.error(message);
            } else if (type === 'info') {
                toast(message);
            }
        }
    }, [message, type]);

    return null;
};

export default Notification; 